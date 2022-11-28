import mongoose from 'mongoose';
import { menuItemSchema } from './menuItemModel.js';

export const menuSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    shop: { type: String, required: true },
    items: [menuItemSchema],
  },
  {
    timestamp: true,
  }
);

const Menu = new mongoose.model('Menu', menuSchema);
export default Menu;
