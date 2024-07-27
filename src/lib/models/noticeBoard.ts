import mongoose from "mongoose";  

const NoticeBoardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    imgURL: {
        type: String,
        required: false,
    },
    body: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 30
    },

});

const NoticeBoard = mongoose.models.Notification || mongoose.model('Notification', NoticeBoardSchema);

export default NoticeBoard;