"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#f5f5f3]">
            {/* Header */}
            <header className="px-6 py-4 flex items-center justify-between max-w-4xl mx-auto">
                <span className="font-serif text-xl text-stone-800">YearPlanner</span>
                <div className="flex items-center gap-4">
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="text-sm text-stone-600 hover:text-stone-900 transition-colors">
                                Sign in
                            </button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <Link href="/calendar" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">
                            My Calendar
                        </Link>
                        <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
                    </SignedIn>
                </div>
            </header>

            {/* Hero */}
            <main className="px-6 pt-20 pb-32">
                <div className="max-w-2xl mx-auto text-center">
                    <h1 className="font-serif text-5xl md:text-7xl font-light text-stone-800 mb-6 italic leading-tight">
                        Turn resolutions<br />into reservations
                    </h1>
                    <p className="text-lg text-stone-500 mb-10 max-w-md mx-auto">
                        Plan your year with intention. Reserve time for the people, places, and experiences that matter most.
                    </p>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="bg-stone-900 text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-stone-800 transition-colors">
                                Start planning your year
                            </button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <Link
                            href="/calendar"
                            className="inline-block bg-stone-900 text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-stone-800 transition-colors"
                        >
                            Open your calendar
                        </Link>
                    </SignedIn>
                </div>

                {/* Features */}
                <div className="max-w-3xl mx-auto mt-24 grid md:grid-cols-3 gap-8 text-center">
                    <div>
                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="font-medium text-stone-800 mb-2">Visual Planning</h3>
                        <p className="text-sm text-stone-500">See your entire year at a glance. Drag and drop to reschedule.</p>
                    </div>
                    <div>
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h3 className="font-medium text-stone-800 mb-2">Location Colors</h3>
                        <p className="text-sm text-stone-500">Events are color-coded by destination so you can see patterns.</p>
                    </div>
                    <div>
                        <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                        </div>
                        <h3 className="font-medium text-stone-800 mb-2">Share Plans</h3>
                        <p className="text-sm text-stone-500">Share your reservations with friends and family.</p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="px-6 py-8 border-t border-stone-200 text-center">
                <p className="text-xs text-stone-400">© {new Date().getFullYear()} YearPlanner</p>
            </footer>
        </div>
    );
}
