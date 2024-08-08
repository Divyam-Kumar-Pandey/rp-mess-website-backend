import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
    rollNumber: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: false,
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
    status: {
        type: String,
        required: true,
        enum: ['NOT_STARTED','PENDING', 'RESOLVED'],
        default: 'NOT_STARTED',
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '365d', // 1 year 
    },
});

const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema);

export default Feedback;
