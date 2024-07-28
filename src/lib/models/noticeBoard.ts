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
        default: Date.now(),
        expires: 60*60*24*180, // 180 days 
    },

});

const NoticeBoard = mongoose.models.Notification || mongoose.model('Notification', NoticeBoardSchema);

export default NoticeBoard;