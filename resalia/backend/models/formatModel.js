import mongoose from 'mongoose';

export const formatSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: false },
  },
  {
    timestamp: true,
  }
);

const Format = new mongoose.model('Format', formatSchema);
export default Format;
