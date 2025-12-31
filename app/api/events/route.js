import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Event from "@/models/Event";

// GET all events for a year
export async function GET(request) {
    try {
        await connectMongo();

        const { searchParams } = new URL(request.url);
        const year = searchParams.get("year");

        if (!year) {
            return NextResponse.json({ error: "Year is required" }, { status: 400 });
        }

        const events = await Event.find({ year: parseInt(year) }).sort({ startDate: 1 });

        // Convert to object format for frontend
        const eventsMap = {};
        events.forEach(event => {
            eventsMap[event._id.toString()] = {
                id: event._id.toString(),
                title: event.title,
                theme: event.theme,
                location: event.location,
                startDate: event.startDate,
                endDate: event.endDate,
            };
        });

        return NextResponse.json(eventsMap);
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST create new event
export async function POST(request) {
    try {
        await connectMongo();

        const body = await request.json();
        const { title, theme, location, startDate, endDate, year } = body;

        if (!title || !startDate || !endDate || !year) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const event = await Event.create({
            title,
            theme: theme || "experiences",
            location,
            startDate,
            endDate,
            year,
        });

        return NextResponse.json({
            id: event._id.toString(),
            title: event.title,
            theme: event.theme,
            location: event.location,
            startDate: event.startDate,
            endDate: event.endDate,
        });
    } catch (error) {
        console.error("Error creating event:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT update event
export async function PUT(request) {
    try {
        await connectMongo();

        const body = await request.json();
        const { id, title, theme, location, startDate, endDate } = body;

        if (!id) {
            return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
        }

        const event = await Event.findByIdAndUpdate(
            id,
            { title, theme, location, startDate, endDate },
            { new: true }
        );

        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        return NextResponse.json({
            id: event._id.toString(),
            title: event.title,
            theme: event.theme,
            location: event.location,
            startDate: event.startDate,
            endDate: event.endDate,
        });
    } catch (error) {
        console.error("Error updating event:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE event
export async function DELETE(request) {
    try {
        await connectMongo();

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
        }

        const event = await Event.findByIdAndDelete(id);

        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting event:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
