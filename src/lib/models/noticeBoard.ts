import mongoose from "mongoose";  

const NoticeBoardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    imgUrl: {
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
        expires: 60*60*24*180, // 180 days 
    },

});

const NoticeBoard = mongoose.models.NoticeBoard || mongoose.model('NoticeBoard', NoticeBoardSchema);

export default NoticeBoard;