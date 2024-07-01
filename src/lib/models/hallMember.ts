import {Schema, model, models} from 'mongoose';

const HallMemberSchema = new Schema({
    rollNumber: {
        type: String,
        required: true,
        unique: true,
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

const HallMember = models.HallMember || model('HallMember', HallMemberSchema);

export default HallMember;