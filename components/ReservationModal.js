"use client";

import { THEMES } from "@/libs/calendarConstants";

export default function ReservationModal({
    showModal,
    modalDate,
    year,
    reservationTitle,
    setReservationTitle,
    reservationLocation,
    setReservationLocation,
    selectedTheme,
    setSelectedTheme,
    reservations,
    onSave,
    onDelete,
    onClose
}) {
    if (!showModal || !modalDate) return null;

    const formatDate = () => {
        const [, m, d] = modalDate.split("-").map(Number);
        return new Date(year, m, d).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-stone-900/10 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                <div className="bg-stone-50 px-8 py-6 border-b border-stone-100">
                    <h2 className="font-serif text-xl text-stone-800">
                        {formatDate()}
                    </h2>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">
                                Reservation Title
                            </label>
                            <input
                                type="text"
                                value={reservationTitle}
                                onChange={(e) => setReservationTitle(e.target.value)}
                                placeholder="What are you reserving?"
                                className="w-full border-b-2 border-stone-100 bg-transparent py-2 text-lg font-serif text-stone-800 placeholder:text-stone-300 focus:border-stone-800 focus:outline-none transition-colors"
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">
                                Location / Destination
                            </label>
                            <input
                                type="text"
                                value={reservationLocation}
                                onChange={(e) => setReservationLocation(e.target.value)}
                                placeholder="Where is this happening?"
                                className="w-full border-b-2 border-stone-100 bg-transparent py-1 text-sm font-sans text-stone-600 placeholder:text-stone-300 focus:border-stone-800 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">
                            Theme
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(THEMES).map(([key, theme]) => (
                                <button
                                    key={key}
                                    onClick={() => setSelectedTheme(key)}
                                    className={`
                    flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all
                    ${selectedTheme === key
                                            ? `${theme.color} border ${theme.borderColor} text-stone-900 shadow-sm`
                                            : "bg-stone-50 border border-transparent text-stone-500 hover:bg-stone-100"}
                  `}
                                >
                                    <div className={`w-2 h-2 rounded-full ${theme.color} border ${theme.borderColor}`} />
                                    {theme.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                        {reservations[modalDate] && (
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
                                disabled={!reservationTitle.trim()}
                                className="bg-[#2d2a26] text-white px-8 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-stone-200 hover:bg-stone-800 transition-all disabled:opacity-30 disabled:shadow-none"
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
