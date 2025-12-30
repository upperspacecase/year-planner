"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import {
    MONTHS,
    QUARTERS,
    THEMES,
    DAY_LABELS,
    LOCATION_PALETTE,
    getDaysInMonth,
    getDayOfWeek,
    getInitialReservations
} from "@/libs/calendarConstants";
import ReservationModal from "./ReservationModal";

export default function YearPlannerCalendar() {
    const currentYear = new Date().getFullYear();
    const [year] = useState(new Date().getMonth() >= 9 ? currentYear + 1 : currentYear);
    const [reservations, setReservations] = useState(() => getInitialReservations(year));
    const [showModal, setShowModal] = useState(false);
    const [modalDate, setModalDate] = useState(null);
    const [reservationTitle, setReservationTitle] = useState("");
    const [reservationLocation, setReservationLocation] = useState("");
    const [selectedTheme, setSelectedTheme] = useState("experiences");

    // Drag and Drop State
    const [dragOverDate, setDragOverDate] = useState(null);
    const dragSourceRef = useRef({ sourceDateKey: null, reservation: null });

    const today = new Date();
    const isCurrentYear = today.getFullYear() === year;

    // Dynamic location color mapping
    const locationColorMap = useMemo(() => {
        const locations = Array.from(new Set(Object.values(reservations).map(r => r.location).filter(Boolean)));
        const map = {};
        locations.forEach((loc, index) => {
            if (loc) {
                map[loc] = LOCATION_PALETTE[index % LOCATION_PALETTE.length];
            }
        });
        return map;
    }, [reservations]);

    const handleDayClick = (dateKey) => {
        setModalDate(dateKey);
        const res = reservations[dateKey];
        if (res) {
            setReservationTitle(res.title);
            setReservationLocation(res.location || "");
            setSelectedTheme(res.theme);
        } else {
            setReservationTitle("");
            setReservationLocation("");
            setSelectedTheme("experiences");
        }
        setShowModal(true);
    };

    const handleSaveReservation = () => {
        if (modalDate && reservationTitle.trim()) {
            setReservations((prev) => ({
                ...prev,
                [modalDate]: {
                    title: reservationTitle.trim(),
                    theme: selectedTheme,
                    location: reservationLocation.trim() || undefined
                },
            }));
        }
        setShowModal(false);
        setModalDate(null);
    };

    const handleDeleteReservation = () => {
        if (modalDate) {
            setReservations((prev) => {
                const newReservations = { ...prev };
                delete newReservations[modalDate];
                return newReservations;
            });
        }
        setShowModal(false);
        setModalDate(null);
    };

    const onDragStart = (e, dateKey) => {
        const reservation = reservations[dateKey];
        if (!reservation) return;

        dragSourceRef.current = { sourceDateKey: dateKey, reservation };
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
        const { sourceDateKey, reservation } = dragSourceRef.current;

        if (!reservation || !sourceDateKey || sourceDateKey === destinationDateKey) {
            setDragOverDate(null);
            return;
        }

        setReservations((prev) => {
            const updated = { ...prev };
            delete updated[sourceDateKey];
            updated[destinationDateKey] = reservation;
            return updated;
        });

        setDragOverDate(null);
        dragSourceRef.current = { sourceDateKey: null, reservation: null };
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
                                                            const reservation = reservations[dateKey];
                                                            const isToday = isCurrentYear && today.getMonth() === monthIndex && today.getDate() === day;
                                                            const isDragOver = dragOverDate === dateKey;

                                                            return (
                                                                <div
                                                                    key={dIdx}
                                                                    draggable={isValid && !!reservation}
                                                                    onDragStart={(e) => isValid && onDragStart(e, dateKey)}
                                                                    onDragOver={(e) => isValid && onDragOver(e, dateKey)}
                                                                    onDragLeave={onDragLeave}
                                                                    onDrop={(e) => isValid && onDrop(e, dateKey)}
                                                                    onClick={() => isValid && handleDayClick(dateKey)}
                                                                    className={`
                                    relative flex-1 aspect-[2/3] flex flex-col items-center justify-center
                                    rounded-sm transition-all duration-300 overflow-hidden
                                    ${isValid ? "cursor-pointer" : "bg-transparent opacity-0 pointer-events-none"}
                                    ${isValid && !reservation ? (isWeekend ? "bg-stone-50/50" : "bg-stone-50/20 hover:bg-stone-100") : ""}
                                    ${reservation ? `${THEMES[reservation.theme].color} ${THEMES[reservation.theme].borderColor} border shadow-sm` : "border border-stone-100/40"}
                                    ${isDragOver ? "ring-2 ring-stone-400 ring-offset-1 z-10 scale-110" : ""}
                                    ${isToday ? "ring-1 ring-amber-400" : ""}
                                  `}
                                                                    title={reservation ? `${reservation.title}${reservation.location ? ` @ ${reservation.location}` : ""}` : undefined}
                                                                >
                                                                    {isValid && (
                                                                        <span className={`
                                      text-[8px] font-bold z-10
                                      ${reservation ? THEMES[reservation.theme].textColor : "text-stone-300"}
                                      ${isToday && !reservation ? "text-amber-500" : ""}
                                    `}>
                                                                            {DAY_LABELS[dayOfWeek]}
                                                                        </span>
                                                                    )}
                                                                    {reservation && reservation.location && (
                                                                        <div
                                                                            className={`absolute bottom-0 left-0 right-0 h-[3px] ${locationColorMap[reservation.location]}`}
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
                modalDate={modalDate}
                year={year}
                reservationTitle={reservationTitle}
                setReservationTitle={setReservationTitle}
                reservationLocation={reservationLocation}
                setReservationLocation={setReservationLocation}
                selectedTheme={selectedTheme}
                setSelectedTheme={setSelectedTheme}
                reservations={reservations}
                onSave={handleSaveReservation}
                onDelete={handleDeleteReservation}
                onClose={() => setShowModal(false)}
            />
        </div>
    );
}
