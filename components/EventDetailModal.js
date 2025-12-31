"use client";

import { parseDateKey, daysBetween } from "@/libs/calendarConstants";

export default function EventDetailModal({ event, onClose, color }) {
    if (!event) return null;

    const startDate = parseDateKey(event.startDate);
    const endDate = parseDateKey(event.endDate);
    const duration = daysBetween(event.startDate, event.endDate) + 1;

    const formatDate = (date) => {
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "long",
            day: "numeric",
        });
    };

    const dateRange = duration === 1
        ? formatDate(startDate)
        : `${formatDate(startDate)} – ${formatDate(endDate)}`;

    const handleShare = async () => {
        const shareText = `${event.title}\n📅 ${dateRange}${event.location ? `\n📍 ${event.location}` : ""}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: event.title,
                    text: shareText,
                });
            } catch (err) {
                // User cancelled or error
            }
        } else {
            // Fallback: copy to clipboard
            await navigator.clipboard.writeText(shareText);
            alert("Copied to clipboard!");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-stone-900/20 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
                {/* Color banner */}
                <div className={`h-2 ${color.bg}`} />

                <div className="p-6">
                    {/* Location badge */}
                    {event.location && (
                        <div className="flex items-center gap-2 mb-4">
                            <div className={`w-2 h-2 rounded-full ${color.bg}`} />
                            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                                {event.location}
                            </span>
                        </div>
                    )}

                    {/* Title */}
                    <h2 className="text-2xl font-serif text-stone-800 mb-4">
                        {event.title}
                    </h2>

                    {/* Details */}
                    <div className="space-y-3 mb-6">
                        {/* Date */}
                        <div className="flex items-center gap-3 text-stone-600">
                            <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <div>
                                <p className="font-medium">{dateRange}</p>
                                {duration > 1 && (
                                    <p className="text-sm text-stone-400">{duration} days</p>
                                )}
                            </div>
                        </div>

                        {/* Location */}
                        {event.location && (
                            <div className="flex items-center gap-3 text-stone-600">
                                <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <p className="font-medium">{event.location}</p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleShare}
                            className="flex-1 flex items-center justify-center gap-2 bg-stone-100 text-stone-700 px-4 py-3 rounded-xl text-sm font-medium hover:bg-stone-200 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            Share
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 bg-stone-900 text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
