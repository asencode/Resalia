import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    shop: { type: String, required: true },
    items: { type: Array, default: [], required: true },
  },
  {
    timestamp: true,
  }
);

const Cart = new mongoose.model('Cart', cartSchema);
export default Cart;
