import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
    rollNumber: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: false,
    },
    imgUrl: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '365d', // 1 year 
    },
});

const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema);

export default Feedback;
