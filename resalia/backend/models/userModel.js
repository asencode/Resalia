import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
    shops: { type: [String], required: false },
    surname: { type: String, required: false },
    address1: { type: String, required: false },
    address2: { type: String, required: false },
    city: { type: String, required: false },
    province: { type: String, required: false },
    postcode: { type: String, required: false },
    phone1: { type: String, required: false },
    phone2: { type: String, required: false },
  },
  {
    timestamp: true,
  }
);

const User = new mongoose.model('User', userSchema);
export default User;
