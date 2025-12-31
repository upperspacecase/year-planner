import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

// EVENT SCHEMA for Year Planner (location-based colors, no themes)
const eventSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        location: {
            type: String,
            trim: true,
        },
        startDate: {
            type: String, // Format: "YYYY-M-D" e.g., "2025-0-15"
            required: true,
        },
        endDate: {
            type: String, // Format: "YYYY-M-D" e.g., "2025-0-17"
            required: true,
        },
        year: {
            type: Number,
            required: true,
            index: true,
        },
        // Clerk user ID for authentication
        clerkUserId: {
            type: String,
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
    }
);

// Compound index for querying events by year and user
eventSchema.index({ year: 1, clerkUserId: 1 });

// Add plugin that converts mongoose to json
eventSchema.plugin(toJSON);

export default mongoose.models.Event || mongoose.model("Event", eventSchema);
