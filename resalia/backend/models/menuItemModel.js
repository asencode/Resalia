import mongoose from 'mongoose';
import { allergenSchema } from './allergenModel.js';
import { traceSchema } from './traceModel.js';
import { formatSchema } from './formatModel.js';

export const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true, required: true },
    aditionalInfo: { type: String, required: false },
    description: { type: String, required: true },
    views: { type: Number, required: true, default: 0 },
    isVegetariano: { type: Boolean, default: false, required: true },
    isVegano: { type: Boolean, default: false, required: true },
    isFeatured: { type: Boolean, default: false, required: true },
    isVisible: { type: Boolean, default: true, required: true },
    formats: [formatSchema],
    alergenos: allergenSchema,
    trazas: traceSchema,
  },
  {
    timestamp: true,
  }
);

const MenuItem = new mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;
