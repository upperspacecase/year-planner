import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

// EVENT SCHEMA for Year Planner
const eventSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        theme: {
            type: String,
            enum: ["health", "relationships", "experiences", "growth", "wealth"],
            default: "experiences",
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
        // Optional: link to user for multi-user support
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            index: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
    }
);

// Compound index for querying events by year
eventSchema.index({ year: 1, userId: 1 });

// Add plugin that converts mongoose to json
eventSchema.plugin(toJSON);

export default mongoose.models.Event || mongoose.model("Event", eventSchema);
