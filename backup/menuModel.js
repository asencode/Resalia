import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema(
  {
    shop: { type: String, required: true },
    items: { type: Array, default: [], required: true },
  },
  {
    timestamp: true,
  }
);

const Menu = new mongoose.model('Menu', menuSchema);
export default Menu;
