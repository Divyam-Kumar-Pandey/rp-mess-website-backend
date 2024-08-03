import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
    rollNumber: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        enum: [0, 1, 2, 3, 4, 5],
        default: 0,
    },
    timeSlot: {
        type: String,
        required: true,
        enum: ["BREAKFAST", "LUNCH", "SNACKS", "DINNER"],
    },
    date: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60*60*24*3, // 3 days
    }
});

const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;