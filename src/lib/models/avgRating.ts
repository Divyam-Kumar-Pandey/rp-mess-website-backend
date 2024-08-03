import mongoose from "mongoose";

const avgRatingSchema = new mongoose.Schema({
    avgRating: {
        type: Number,
        required: true,
        default: 0,
    },
    numRatings: {
        type: Number,
        required: true,
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
});

const AvgRating = mongoose.model("AvgRating", avgRatingSchema);

export default AvgRating;