import mongoose from 'mongoose';

const tempUserSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  emailOTP: { type: String, required: false },
  role: { type: [String], required: false },
  expireAt: { type: Date, default: Date.now, index: { expires: '1h' } },
});

const TempUser = mongoose.models.TempUser || mongoose.model('TempUser', tempUserSchema);

export default TempUser;