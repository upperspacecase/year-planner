"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import {
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton,
    useAuth,
} from "@clerk/nextjs";
import {
    MONTHS,
    QUARTERS,
    DAY_LABELS,
    getDaysInMonth,
    getDayOfWeek,
    getLocationColorMap,
    getDateRange,
    daysBetween,
    generateEventId,
    toDateKey,
    parseDateKey,
    DEFAULT_EVENT_COLOR,
} from "@/libs/calendarConstants";
import ReservationModal from "./ReservationModal";
import EventCard from "./EventCard";
import EventDetailModal from "./EventDetailModal";
import Link from "next/link";

export default function YearPlannerCalendar() {
    const { isSignedIn, isLoaded } = useAuth();
    const currentYear = new Date().getFullYear();
    const [year] = useState(new Date().getMonth() >= 9 ? currentYear + 1 : currentYear);
    const [events, setEvents] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [modalStartDate, setModalStartDate] = useState(null);
    const [showSignInPrompt, setShowSignInPrompt] = useState(false);
    const [selectedViewEvent, setSelectedViewEvent] = useState(null);

    // Form state
    const [eventTitle, setEventTitle] = useState("");
    const [eventLocation, setEventLocation] = useState("");
    const [eventEndDate, setEventEndDate] = useState(null);

    // Drag and Drop State
    const [dragOverDate, setDragOverDate] = useState(null);
    const dragSourceRef = useRef({ eventId: null, event: null, clickOffset: 0 });

    const today = new Date();
    const isCurrentYear = today.getFullYear() === year;

    // Fetch events from API on mount (only when signed in)
    useEffect(() => {
        if (isLoaded && isSignedIn) {
            fetchEvents();
        } else if (isLoaded && !isSignedIn) {
            setEvents({});
            setIsLoading(false);
        }
    }, [year, isLoaded, isSignedIn]);

    const fetchEvents = async () => {
        try {
            const response = await fetch(`/api/events?year=${year}`);
            if (response.ok) {
                const data = await response.json();
                setEvents(data);
            } else {
                setEvents({});
            }
        } catch (error) {
            console.error("Error fetching events:", error);
            setEvents({});
        } finally {
            setIsLoading(false);
        }
    };

    const saveEventToAPI = async (event, isNew = false) => {
        try {
            const method = isNew ? "POST" : "PUT";
            const body = { ...event, year };

            const response = await fetch("/api/events", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error("Error saving event:", error);
        }
        return null;
    };

    const deleteEventFromAPI = async (eventId) => {
        try {
            await fetch(`/api/events?id=${eventId}`, { method: "DELETE" });
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    // Stable location color mapping
    const locationColorMap = useMemo(() => getLocationColorMap(events), [events]);

    // Get color for an event based on location
    const getEventColor = (event) => {
        if (event.location && locationColorMap[event.location]) {
            return locationColorMap[event.location];
        }
        return DEFAULT_EVENT_COLOR;
    };

    // Build date-to-event lookup
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
            setEditingEvent(entry.event);
            setEventTitle(entry.event.title);
            setEventLocation(entry.event.location || "");
            setModalStartDate(entry.event.startDate);
            setEventEndDate(entry.event.endDate);
        } else {
            setEditingEvent(null);
            setEventTitle("");
            setEventLocation("");
            setModalStartDate(dateKey);
            setEventEndDate(dateKey);
        }
        setShowModal(true);
    };

    const handleSaveEvent = async () => {
        if (!eventTitle.trim() || !modalStartDate) return;

        // Require sign-in to save
        if (!isSignedIn) {
            closeModal();
            setShowSignInPrompt(true);
            return;
        }

        const isNew = !editingEvent;
        const eventId = editingEvent?.id || generateEventId();
        const newEvent = {
            id: eventId,
            title: eventTitle.trim(),
            location: eventLocation.trim() || undefined,
            startDate: modalStartDate,
            endDate: eventEndDate || modalStartDate
        };

        // Optimistic update
        setEvents(prev => {
            const updated = { ...prev };
            if (editingEvent) delete updated[editingEvent.id];
            updated[eventId] = newEvent;
            return updated;
        });

        closeModal();

        // Save to API
        const savedEvent = await saveEventToAPI(newEvent, isNew);
        if (savedEvent && savedEvent.id !== eventId) {
            setEvents(prev => {
                const updated = { ...prev };
                delete updated[eventId];
                updated[savedEvent.id] = savedEvent;
                return updated;
            });
        }
    };

    const handleDeleteEvent = async () => {
        if (editingEvent) {
            const eventId = editingEvent.id;
            setEvents(prev => {
                const updated = { ...prev };
                delete updated[eventId];
                return updated;
            });
            closeModal();
            await deleteEventFromAPI(eventId);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingEvent(null);
        setModalStartDate(null);
        setEventEndDate(null);
    };

    // Drag handlers
    const onDragStart = (e, dateKey) => {
        const entry = dateEventMap[dateKey];
        if (!entry) return;
        const clickOffset = daysBetween(entry.event.startDate, dateKey);
        dragSourceRef.current = { eventId: entry.event.id, event: entry.event, clickOffset };
        e.dataTransfer.effectAllowed = "move";
    };

    const onDragOver = (e, dateKey) => {
        e.preventDefault();
        if (dragOverDate !== dateKey) setDragOverDate(dateKey);
    };

    const onDragLeave = () => setDragOverDate(null);

    const onDrop = async (e, destinationDateKey) => {
        e.preventDefault();
        const { eventId, event, clickOffset } = dragSourceRef.current;

        if (!event || !eventId) {
            setDragOverDate(null);
            return;
        }

        if (!isSignedIn) {
            setDragOverDate(null);
            setShowSignInPrompt(true);
            return;
        }

        const dropDate = parseDateKey(destinationDateKey);
        dropDate.setDate(dropDate.getDate() - clickOffset);
        const newStartDate = toDateKey(dropDate);

        const duration = daysBetween(event.startDate, event.endDate);
        const endDateObj = parseDateKey(newStartDate);
        endDateObj.setDate(endDateObj.getDate() + duration);
        const newEndDate = toDateKey(endDateObj);

        if (newStartDate === event.startDate) {
            setDragOverDate(null);
            return;
        }

        const updatedEvent = { ...event, startDate: newStartDate, endDate: newEndDate };

        setEvents(prev => ({ ...prev, [eventId]: updatedEvent }));
        setDragOverDate(null);
        dragSourceRef.current = { eventId: null, event: null, clickOffset: 0 };

        await saveEventToAPI(updatedEvent, false);
    };

    if (!isLoaded || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f5f5f3]">
                <div className="text-stone-400">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20 bg-[#f5f5f3]">
            {/* Sign-in prompt modal */}
            {showSignInPrompt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-stone-900/20 backdrop-blur-sm" onClick={() => setShowSignInPrompt(false)} />
                    <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl p-8 text-center">
                        <h2 className="font-serif text-2xl text-stone-800 mb-2">Sign in to save</h2>
                        <p className="text-stone-500 mb-6">Create an account to save your events and access them anywhere.</p>
                        <SignInButton mode="modal">
                            <button
                                onClick={() => setShowSignInPrompt(false)}
                                className="w-full bg-stone-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-stone-800 transition-colors"
                            >
                                Sign in or Sign up
                            </button>
                        </SignInButton>
                        <button onClick={() => setShowSignInPrompt(false)} className="mt-4 text-sm text-stone-400 hover:text-stone-600">
                            Maybe later
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="pt-12 pb-8 px-6 text-center">
                <div className="flex justify-between items-center max-w-6xl mx-auto mb-8">
                    <Link href="/" className="font-serif text-lg text-stone-600 hover:text-stone-900 transition-colors">
                        YearPlanner
                    </Link>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="text-sm text-stone-500 hover:text-stone-800 transition-colors">
                                Sign in
                            </button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
                    </SignedIn>
                </div>
                <h1 className="font-serif text-6xl font-light text-stone-800 mb-3 italic">
                    {year}
                </h1>
                <p className="text-stone-500 font-serif italic text-lg">
                    Turn resolutions into reservations
                </p>
            </header>

            <main className="px-4 md:px-8 lg:px-12">
                <div className="mx-auto max-w-6xl overflow-x-auto">
                    <div className="min-w-[900px]">
                        {/* Day numbers header */}
                        <div className="flex mb-2">
                            <div className="w-8 shrink-0" />
                            <div className="w-20 shrink-0" />
                            <div className="flex flex-1">
                                {Array.from({ length: 31 }, (_, i) => (
                                    <div key={i} className="flex-1 text-center text-xs text-stone-400 font-medium">
                                        {i + 1}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Calendar grid */}
                        <div className="space-y-0">
                            {QUARTERS.map((quarter, qIdx) => (
                                <div key={quarter}>
                                    {[0, 1, 2].map((mInQ) => {
                                        const monthIndex = qIdx * 3 + mInQ;
                                        const monthName = MONTHS[monthIndex];
                                        const daysInMonth = getDaysInMonth(year, monthIndex);
                                        const isFirstInQ = mInQ === 0;

                                        return (
                                            <div key={monthName} className="flex items-center h-8">
                                                <div className="w-8 shrink-0 text-center">
                                                    {isFirstInQ && (
                                                        <span className="text-[10px] font-medium text-stone-300 uppercase tracking-wider">
                                                            Q{qIdx + 1}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="w-20 shrink-0 pr-3">
                                                    <span className="text-sm text-stone-600">
                                                        {monthName}
                                                    </span>
                                                </div>

                                                <div className="flex flex-1">
                                                    {Array.from({ length: 31 }, (_, dIdx) => {
                                                        const day = dIdx + 1;
                                                        const isValid = day <= daysInMonth;
                                                        const dateKey = `${year}-${monthIndex}-${day}`;
                                                        const dayOfWeek = isValid ? getDayOfWeek(year, monthIndex, day) : -1;
                                                        const entry = dateEventMap[dateKey];
                                                        const event = entry?.event;
                                                        const position = entry?.position;
                                                        const isDragOver = dragOverDate === dateKey;

                                                        let roundedClass = "rounded";
                                                        if (position === 'start') roundedClass = "rounded-l-md rounded-r-none";
                                                        else if (position === 'end') roundedClass = "rounded-r-md rounded-l-none";
                                                        else if (position === 'middle') roundedClass = "rounded-none";

                                                        const color = event ? getEventColor(event) : null;

                                                        return (
                                                            <div
                                                                key={dIdx}
                                                                draggable={isValid && !!event && isSignedIn}
                                                                onDragStart={(e) => isValid && onDragStart(e, dateKey)}
                                                                onDragOver={(e) => isValid && onDragOver(e, dateKey)}
                                                                onDragLeave={onDragLeave}
                                                                onDrop={(e) => isValid && onDrop(e, dateKey)}
                                                                onClick={() => isValid && handleDayClick(dateKey)}
                                                                className={`
                                  flex-1 h-6 flex items-center justify-center mx-[1px]
                                  ${roundedClass} transition-all cursor-pointer
                                  ${isValid ? "" : "opacity-0 pointer-events-none"}
                                  ${event && color ? color.bg : "hover:bg-stone-200/50"}
                                  ${isDragOver ? "ring-2 ring-stone-500 scale-110 z-10" : ""}
                                `}
                                                                title={event ? `${event.title}${event.location ? ` @ ${event.location}` : ""}` : undefined}
                                                            >
                                                                {isValid && (
                                                                    <span className={`text-[10px] font-medium ${event && color ? color.text : "text-stone-400"}`}>
                                                                        {DAY_LABELS[dayOfWeek]}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Location Legend */}
                {Object.keys(locationColorMap).length > 0 && (
                    <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
                        {Object.entries(locationColorMap).map(([location, color]) => (
                            <div key={location} className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-sm ${color.bg}`} />
                                <span className="text-xs text-stone-500">{location}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Event Cards (chronologically sorted) */}
                {Object.keys(events).length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-center text-sm font-medium text-stone-400 uppercase tracking-wider mb-6">
                            Your Reservations
                        </h2>
                        <div className="grid gap-3 max-w-lg mx-auto">
                            {Object.values(events)
                                .sort((a, b) => {
                                    const dateA = parseDateKey(a.startDate);
                                    const dateB = parseDateKey(b.startDate);
                                    return dateA - dateB;
                                })
                                .map(event => (
                                    <EventCard
                                        key={event.id}
                                        event={event}
                                        color={getEventColor(event)}
                                        onClick={() => setSelectedViewEvent(event)}
                                    />
                                ))
                            }
                        </div>
                    </div>
                )}
            </main>

            {/* Event Detail Modal */}
            {selectedViewEvent && (
                <EventDetailModal
                    event={selectedViewEvent}
                    color={getEventColor(selectedViewEvent)}
                    onClose={() => setSelectedViewEvent(null)}
                />
            )}

            <ReservationModal
                showModal={showModal}
                year={year}
                editingEvent={editingEvent}
                eventTitle={eventTitle}
                setEventTitle={setEventTitle}
                eventLocation={eventLocation}
                setEventLocation={setEventLocation}
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
