import mongoose from 'mongoose';
import Allergen from './allergenModel.js';

const cartItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true, required: true },
    description: { type: String, required: true },
    views: { type: Number, required: true, default: 0 },
    alergenos: { type: [Allergen.Schema], required: true },
  },
  {
    timestamp: true,
  }
);

const CartItem = new mongoose.model('CartItem', cartItemSchema);
export default CartItem;
