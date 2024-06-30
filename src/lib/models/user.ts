import { profile } from 'console';
import {Schema, model, models} from 'mongoose';

const UserSchema = new Schema({
    rollNumber: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    roomNumber: {
        type: String,
        required: false,
    },
    profilePicture: {
        type: String,
        required: false,
    },
    graduationYear: {
        type: Number,
        required: false,
    },
    isProfileComplete: {
        type: Boolean,
        required: true,
        default: false,
    },

    role: {
        type: String,
        required: true,
        enum: ['ADMIN', 'STUDENT', 'STAFF', 'SUPERADMIN'],
        default: 'STUDENT',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = models.User || model('User', UserSchema);

export default User;