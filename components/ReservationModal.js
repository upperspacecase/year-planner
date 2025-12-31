"use client";

import { useMemo } from "react";
import { MONTHS, getDaysInMonth, parseDateKey, daysBetween } from "@/libs/calendarConstants";

export default function ReservationModal({
    showModal,
    year,
    editingEvent,
    eventTitle,
    setEventTitle,
    eventLocation,
    setEventLocation,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    onSave,
    onDelete,
    onClose
}) {
    // Calculate duration - must be before any early returns (React hooks rule)
    const duration = useMemo(() => {
        if (!startDate || !endDate) return 1;
        return daysBetween(startDate, endDate) + 1;
    }, [startDate, endDate]);

    // Early return after all hooks
    if (!showModal || !startDate) return null;

    const formatDate = (dateKey) => {
        const [, m, d] = dateKey.split("-").map(Number);
        return new Date(year, m, d).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
    };

    // Generate month/day options for pickers
    const monthOptions = MONTHS.map((name, idx) => ({ value: idx, label: name }));

    const getDayOptions = (monthIdx) => {
        const days = getDaysInMonth(year, monthIdx);
        return Array.from({ length: days }, (_, i) => i + 1);
    };

    const parseStart = () => {
        const parts = startDate.split("-").map(Number);
        return { month: parts[1], day: parts[2] };
    };

    const parseEnd = () => {
        const parts = (endDate || startDate).split("-").map(Number);
        return { month: parts[1], day: parts[2] };
    };

    const handleStartChange = (month, day) => {
        const newStart = `${year}-${month}-${day}`;
        setStartDate(newStart);
        // If end is before new start, set end = start
        if (endDate && parseDateKey(endDate) < parseDateKey(newStart)) {
            setEndDate(newStart);
        }
    };

    const handleEndChange = (month, day) => {
        const newEnd = `${year}-${month}-${day}`;
        // Ensure end is not before start
        if (parseDateKey(newEnd) >= parseDateKey(startDate)) {
            setEndDate(newEnd);
        }
    };

    const start = parseStart();
    const end = parseEnd();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-stone-900/10 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                <div className="bg-stone-50 px-8 py-6 border-b border-stone-100">
                    <h2 className="font-serif text-xl text-stone-800">
                        {editingEvent ? "Edit Event" : "New Event"}
                    </h2>
                    <p className="text-sm text-stone-500 mt-1">
                        {formatDate(startDate)}
                        {endDate && endDate !== startDate && ` → ${formatDate(endDate)}`}
                        {duration > 1 && <span className="ml-2 text-stone-400">({duration} days)</span>}
                    </p>
                </div>

                <div className="p-8 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">
                            What are you planning?
                        </label>
                        <input
                            type="text"
                            value={eventTitle}
                            onChange={(e) => setEventTitle(e.target.value)}
                            placeholder="Japan trip, Mom's birthday, etc."
                            className="w-full border-b-2 border-stone-100 bg-transparent py-2 text-lg font-serif text-stone-800 placeholder:text-stone-300 focus:border-stone-800 focus:outline-none transition-colors"
                            autoFocus
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">
                            Where?
                        </label>
                        <input
                            type="text"
                            value={eventLocation}
                            onChange={(e) => setEventLocation(e.target.value)}
                            placeholder="Tokyo, Home, New York..."
                            className="w-full border-b-2 border-stone-100 bg-transparent py-1 text-sm font-sans text-stone-600 placeholder:text-stone-300 focus:border-stone-800 focus:outline-none transition-colors"
                        />
                        <p className="text-[10px] text-stone-400 mt-1">Events are color-coded by location</p>
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">
                                Start Date
                            </label>
                            <div className="flex gap-2">
                                <select
                                    value={start.month}
                                    onChange={(e) => handleStartChange(parseInt(e.target.value), start.day)}
                                    className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-sm text-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-300"
                                >
                                    {monthOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label.slice(0, 3)}</option>
                                    ))}
                                </select>
                                <select
                                    value={start.day}
                                    onChange={(e) => handleStartChange(start.month, parseInt(e.target.value))}
                                    className="w-16 bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-sm text-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-300"
                                >
                                    {getDayOptions(start.month).map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">
                                End Date
                            </label>
                            <div className="flex gap-2">
                                <select
                                    value={end.month}
                                    onChange={(e) => handleEndChange(parseInt(e.target.value), end.day)}
                                    className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-sm text-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-300"
                                >
                                    {monthOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label.slice(0, 3)}</option>
                                    ))}
                                </select>
                                <select
                                    value={end.day}
                                    onChange={(e) => handleEndChange(end.month, parseInt(e.target.value))}
                                    className="w-16 bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-sm text-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-300"
                                >
                                    {getDayOptions(end.month).map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4">
                        {editingEvent && (
                            <button
                                onClick={onDelete}
                                className="text-xs font-bold text-rose-400 hover:text-rose-600 transition-colors uppercase tracking-widest"
                            >
                                Delete
                            </button>
                        )}
                        <div className="flex gap-3 ml-auto">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 text-xs font-bold text-stone-400 uppercase tracking-widest hover:text-stone-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onSave}
                                disabled={!eventTitle.trim()}
                                className="bg-stone-900 text-white px-8 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-stone-200 hover:bg-stone-800 transition-all disabled:opacity-30 disabled:shadow-none"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
