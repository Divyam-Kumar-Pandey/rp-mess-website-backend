import {Schema, model, models} from 'mongoose';

const HallMemberSchema = new Schema({
    rollNumber: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        // kept as string for simplicity, so that we don't need to make array while uploading new CSVs
        required: true,
        enum: ['ADMIN', 'STUDENT', 'STAFF', 'SUPERADMIN'],
        default: 'STUDENT',
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const HallMember = models.HallMember || model('HallMember', HallMemberSchema);

export default HallMember;