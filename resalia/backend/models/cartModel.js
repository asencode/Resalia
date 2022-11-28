import mongoose from 'mongoose';
import { cartItemSchema } from './cartItemModel.js';

export const cartSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    shop: { type: String, required: true },
    items: [cartItemSchema],
  },
  {
    timestamp: true,
  }
);

const Cart = new mongoose.model('Cart', cartSchema);
export default Cart;
