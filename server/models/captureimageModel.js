import mongoose from 'mongoose';

const CaptureSchema = new mongoose.Schema({
  email: String,
  image: String,
});

export const capture = mongoose.model('UserLoginCapture', CaptureSchema);