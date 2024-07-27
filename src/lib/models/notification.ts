import mongoose from "mongoose";  

const NotificationSchema = new mongoose.Schema({
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

const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

export default Notification;