import mongoose from 'mongoose';

const hospitalSchema = new mongoose.Schema({
  hospitalName: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  hospitalRegistrationDate: Date,
  numberOfAmbulanceAvailable: Number,
  email: String,
  phoneNo: String,
  hospitalRegistrationNo: String,
  emergencyWardNo: String,
//   certificateUpload: String,
  password: String,
});

export const registration = mongoose.model('Registration', hospitalSchema);