import { profile } from 'console';
import {Schema, model, models} from 'mongoose';

const UserSchema = new Schema({
    // required fields
    // roll number, password, name, email, isEmailVerified, isProfileComplete, role
    rollNumber: {
        type: String,
        required: true,
        unique: true,
    },
    //password
    password: {
        type: String,
        required: true,
    },
    forgotPasswordOTP: {
        type: String,
        required: false,
    },
    forgotPasswordOTPExpires: {
        type: Date,
        required: false,
    },
    name: {
        type: String,
        required: true,
    },
    // email
    email: {
        type: String,
        required: true,
        unique: true,
    },
    // additional details
    position : {
        type: String,
        required: false,
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
        type: [String],
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