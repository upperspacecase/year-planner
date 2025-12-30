"use client";

import { useState, useRef, useMemo } from "react";
import {
    MONTHS,
    QUARTERS,
    THEMES,
    DAY_LABELS,
    getDaysInMonth,
    getDayOfWeek,
    getInitialEvents,
    getLocationColorMap,
    getDateRange,
    daysBetween,
    generateEventId,
    toDateKey,
    parseDateKey
} from "@/libs/calendarConstants";
import ReservationModal from "./ReservationModal";

export default function YearPlannerCalendar() {
    const currentYear = new Date().getFullYear();
    const [year] = useState(new Date().getMonth() >= 9 ? currentYear + 1 : currentYear);
    const [events, setEvents] = useState(() => getInitialEvents(year));
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [modalStartDate, setModalStartDate] = useState(null);

    // Form state
    const [eventTitle, setEventTitle] = useState("");
    const [eventLocation, setEventLocation] = useState("");
    const [selectedTheme, setSelectedTheme] = useState("experiences");
    const [eventEndDate, setEventEndDate] = useState(null);

    // Drag and Drop State
    const [dragOverDate, setDragOverDate] = useState(null);
    const dragSourceRef = useRef({ eventId: null, event: null, clickOffset: 0 });

    const today = new Date();
    const isCurrentYear = today.getFullYear() === year;

    // Stable location color mapping (sorted alphabetically)
    const locationColorMap = useMemo(() => getLocationColorMap(events), [events]);

    // Build a lookup: dateKey -> { event, position: 'start' | 'middle' | 'end' | 'single' }
    const dateEventMap = useMemo(() => {
        const map = {};
        Object.values(events).forEach(event => {
            const dates = getDateRange(event.startDate, event.endDate);
            dates.forEach((dateKey, index) => {
                let position = 'single';
                if (dates.length > 1) {
                    if (index === 0) position = 'start';
                    else if (index === dates.length - 1) position = 'end';
                    else position = 'middle';
                }
                map[dateKey] = { event, position };
            });
        });
        return map;
    }, [events]);

    const handleDayClick = (dateKey) => {
        const entry = dateEventMap[dateKey];
        if (entry) {
            // Edit existing event
            setEditingEvent(entry.event);
            setEventTitle(entry.event.title);
            setEventLocation(entry.event.location || "");
            setSelectedTheme(entry.event.theme);
            setModalStartDate(entry.event.startDate);
            setEventEndDate(entry.event.endDate);
        } else {
            // New event
            setEditingEvent(null);
            setEventTitle("");
            setEventLocation("");
            setSelectedTheme("experiences");
            setModalStartDate(dateKey);
            setEventEndDate(dateKey);
        }
        setShowModal(true);
    };

    const handleSaveEvent = () => {
        if (!eventTitle.trim() || !modalStartDate) return;

        const eventId = editingEvent?.id || generateEventId();
        const newEvent = {
            id: eventId,
            title: eventTitle.trim(),
            theme: selectedTheme,
            location: eventLocation.trim() || undefined,
            startDate: modalStartDate,
            endDate: eventEndDate || modalStartDate
        };

        setEvents(prev => {
            const updated = { ...prev };
            if (editingEvent) {
                delete updated[editingEvent.id];
            }
            updated[eventId] = newEvent;
            return updated;
        });

        closeModal();
    };

    const handleDeleteEvent = () => {
        if (editingEvent) {
            setEvents(prev => {
                const updated = { ...prev };
                delete updated[editingEvent.id];
                return updated;
            });
        }
        closeModal();
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingEvent(null);
        setModalStartDate(null);
        setEventEndDate(null);
    };

    // Drag handlers - move entire event
    const onDragStart = (e, dateKey) => {
        const entry = dateEventMap[dateKey];
        if (!entry) return;

        // Calculate offset from start of event
        const clickOffset = daysBetween(entry.event.startDate, dateKey);
        dragSourceRef.current = {
            eventId: entry.event.id,
            event: entry.event,
            clickOffset
        };
        e.dataTransfer.effectAllowed = "move";
    };

    const onDragOver = (e, dateKey) => {
        e.preventDefault();
        if (dragOverDate !== dateKey) {
            setDragOverDate(dateKey);
        }
    };

    const onDragLeave = () => {
        setDragOverDate(null);
    };

    const onDrop = (e, destinationDateKey) => {
        e.preventDefault();
        const { eventId, event, clickOffset } = dragSourceRef.current;

        if (!event || !eventId) {
            setDragOverDate(null);
            return;
        }

        // Calculate new start date based on where user dropped
        const dropDate = parseDateKey(destinationDateKey);
        dropDate.setDate(dropDate.getDate() - clickOffset);
        const newStartDate = toDateKey(dropDate);

        // Calculate duration and new end date
        const duration = daysBetween(event.startDate, event.endDate);
        const endDateObj = parseDateKey(newStartDate);
        endDateObj.setDate(endDateObj.getDate() + duration);
        const newEndDate = toDateKey(endDateObj);

        // Don't update if nothing changed
        if (newStartDate === event.startDate) {
            setDragOverDate(null);
            return;
        }

        setEvents(prev => ({
            ...prev,
            [eventId]: {
                ...event,
                startDate: newStartDate,
                endDate: newEndDate
            }
        }));

        setDragOverDate(null);
        dragSourceRef.current = { eventId: null, event: null, clickOffset: 0 };
    };

    return (
        <div className="min-h-screen pb-20 selection:bg-amber-200 bg-[#fcfbf7]">
            <nav className="sticky top-0 z-40 bg-[#fcfbf7]/80 backdrop-blur-md border-b border-stone-200/60 px-6 py-4">
                <div className="mx-auto max-w-[1800px] flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-center md:text-left">
                        <h1 className="font-serif text-3xl font-light tracking-tight text-[#2d2a26]">
                            {year} <span className="text-stone-400 font-sans text-xl ml-2 tracking-widest font-thin">ANNUAL</span>
                        </h1>
                    </div>
                </div>
            </nav>

            <main className="px-4 py-8 md:px-8 lg:px-12">
                <div className="mx-auto max-w-[1800px] overflow-x-auto">
                    <div className="min-w-[1000px]">
                        {/* Day numbers header */}
                        <div className="mb-4 flex border-b border-stone-100 pb-2">
                            <div className="w-10 shrink-0 md:w-16" />
                            <div className="w-24 shrink-0 md:w-36" />
                            <div className="flex flex-1">
                                {Array.from({ length: 31 }, (_, i) => (
                                    <div key={i} className="flex flex-1 items-center justify-center text-[10px] font-semibold text-stone-400">
                                        {(i + 1).toString().padStart(2, '0')}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Calendar grid */}
                        <div className="space-y-2">
                            {QUARTERS.map((quarter, qIdx) => (
                                <div key={quarter} className="group/quarter">
                                    <div className="space-y-0.5">
                                        {[0, 1, 2].map((mInQ) => {
                                            const monthIndex = qIdx * 3 + mInQ;
                                            const monthName = MONTHS[monthIndex];
                                            const daysInMonth = getDaysInMonth(year, monthIndex);
                                            const isFirstInQ = mInQ === 0;

                                            return (
                                                <div key={monthName} className="flex items-stretch group/month">
                                                    {/* Quarter label */}
                                                    <div className="w-10 shrink-0 flex items-center justify-center md:w-16">
                                                        {isFirstInQ && (
                                                            <span className="font-serif text-[10px] font-bold tracking-widest text-stone-300 rotate-[-90deg]">
                                                                {quarter}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Month label */}
                                                    <div className="flex w-24 shrink-0 items-center pr-4 md:w-36">
                                                        <span className="font-serif text-sm font-medium text-stone-700 tracking-tight">
                                                            {monthName}
                                                        </span>
                                                    </div>

                                                    {/* Days grid */}
                                                    <div className="flex flex-1 gap-[2px]">
                                                        {Array.from({ length: 31 }, (_, dIdx) => {
                                                            const day = dIdx + 1;
                                                            const isValid = day <= daysInMonth;
                                                            const dateKey = `${year}-${monthIndex}-${day}`;
                                                            const dayOfWeek = isValid ? getDayOfWeek(year, monthIndex, day) : -1;
                                                            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                                                            const entry = dateEventMap[dateKey];
                                                            const event = entry?.event;
                                                            const position = entry?.position;
                                                            const isToday = isCurrentYear && today.getMonth() === monthIndex && today.getDate() === day;
                                                            const isDragOver = dragOverDate === dateKey;

                                                            // Rounded corners based on position
                                                            let roundedClass = "rounded-sm";
                                                            if (position === 'start') roundedClass = "rounded-l-md rounded-r-none";
                                                            else if (position === 'end') roundedClass = "rounded-r-md rounded-l-none";
                                                            else if (position === 'middle') roundedClass = "rounded-none";

                                                            return (
                                                                <div
                                                                    key={dIdx}
                                                                    draggable={isValid && !!event}
                                                                    onDragStart={(e) => isValid && onDragStart(e, dateKey)}
                                                                    onDragOver={(e) => isValid && onDragOver(e, dateKey)}
                                                                    onDragLeave={onDragLeave}
                                                                    onDrop={(e) => isValid && onDrop(e, dateKey)}
                                                                    onClick={() => isValid && handleDayClick(dateKey)}
                                                                    className={`
                                    relative flex-1 aspect-[2/3] flex flex-col items-center justify-center
                                    ${roundedClass} transition-all duration-300 overflow-hidden
                                    ${isValid ? "cursor-pointer" : "bg-transparent opacity-0 pointer-events-none"}
                                    ${isValid && !event ? (isWeekend ? "bg-stone-50/50" : "bg-stone-50/20 hover:bg-stone-100") : ""}
                                    ${event ? `${THEMES[event.theme].color} ${THEMES[event.theme].borderColor} border-y border-l ${position === 'end' || position === 'single' ? 'border-r' : ''} shadow-sm` : "border border-stone-100/40"}
                                    ${isDragOver ? "ring-2 ring-stone-400 ring-offset-1 z-10 scale-110" : ""}
                                    ${isToday ? "ring-1 ring-amber-400" : ""}
                                  `}
                                                                    title={event ? `${event.title}${event.location ? ` @ ${event.location}` : ""}` : undefined}
                                                                >
                                                                    {isValid && (
                                                                        <span className={`
                                      text-[8px] font-bold z-10
                                      ${event ? THEMES[event.theme].textColor : "text-stone-300"}
                                      ${isToday && !event ? "text-amber-500" : ""}
                                    `}>
                                                                            {DAY_LABELS[dayOfWeek]}
                                                                        </span>
                                                                    )}
                                                                    {event && event.location && (
                                                                        <div
                                                                            className={`absolute bottom-0 left-0 right-0 h-[3px] ${locationColorMap[event.location]}`}
                                                                        />
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Legends */}
                <div className="mt-12 space-y-8">
                    {/* Theme Legend */}
                    <div className="flex flex-wrap justify-center items-center gap-8 border-b border-stone-100 pb-8">
                        {Object.entries(THEMES).map(([key, theme]) => (
                            <div key={key} className="flex items-center gap-2 group cursor-default">
                                <div className={`w-3 h-3 rounded-full ${theme.color} border ${theme.borderColor} transition-transform group-hover:scale-125`} />
                                <span className="text-xs font-medium text-stone-500 uppercase tracking-widest">{theme.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Location Legend */}
                    <div className="flex flex-col items-center gap-4">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-300">Locations & Destinations</span>
                        <div className="flex flex-wrap justify-center items-center gap-4 max-w-4xl">
                            {Object.entries(locationColorMap).length > 0 ? (
                                Object.entries(locationColorMap).map(([loc, colorClass]) => (
                                    <div key={loc} className="flex items-center gap-2 px-3 py-1 bg-white border border-stone-100 rounded-full shadow-sm">
                                        <div className={`w-2 h-2 rounded-full ${colorClass}`} />
                                        <span className="text-xs font-medium text-stone-600">{loc}</span>
                                    </div>
                                ))
                            ) : (
                                <span className="text-xs italic text-stone-400">No locations assigned yet</span>
                            )}
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="text-[10px] text-stone-400 italic">Drag events to reschedule • Click to add details</div>
                    </div>
                </div>
            </main>

            {/* Reservation Modal */}
            <ReservationModal
                showModal={showModal}
                year={year}
                editingEvent={editingEvent}
                eventTitle={eventTitle}
                setEventTitle={setEventTitle}
                eventLocation={eventLocation}
                setEventLocation={setEventLocation}
                selectedTheme={selectedTheme}
                setSelectedTheme={setSelectedTheme}
                startDate={modalStartDate}
                setStartDate={setModalStartDate}
                endDate={eventEndDate}
                setEndDate={setEventEndDate}
                onSave={handleSaveEvent}
                onDelete={handleDeleteEvent}
                onClose={closeModal}
            />
        </div>
    );
}
