"use client";

import { parseDateKey, daysBetween } from "@/libs/calendarConstants";

export default function EventCard({ event, onClick, color }) {
    const startDate = parseDateKey(event.startDate);
    const endDate = parseDateKey(event.endDate);
    const duration = daysBetween(event.startDate, event.endDate) + 1;

    const formatDate = (date) => {
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    const dateRange = duration === 1
        ? formatDate(startDate)
        : `${formatDate(startDate)} – ${formatDate(endDate)}`;

    return (
        <button
            onClick={onClick}
            className="w-full text-left bg-white rounded-xl p-4 shadow-sm border border-stone-100 hover:shadow-md hover:border-stone-200 transition-all group"
        >
            <div className="flex items-start gap-3">
                {/* Color indicator */}
                <div className={`w-1 h-12 rounded-full ${color.bg} shrink-0`} />

                <div className="flex-1 min-w-0">
                    {/* Title */}
                    <h3 className="font-medium text-stone-800 truncate group-hover:text-stone-900">
                        {event.title}
                    </h3>

                    {/* Date */}
                    <p className="text-sm text-stone-500 mt-0.5">
                        {dateRange}
                        {duration > 1 && (
                            <span className="text-stone-400 ml-1">({duration} days)</span>
                        )}
                    </p>

                    {/* Location */}
                    {event.location && (
                        <p className="text-sm text-stone-400 mt-0.5 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {event.location}
                        </p>
                    )}
                </div>

                {/* Arrow */}
                <svg className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transition-colors shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </button>
    );
}
