import express from 'express';
import Cart from '../models/cartModel.js';
import Menu from '../models/menuModel.js';
import Shop from '../models/shopModel.js';
import User from '../models/userModel.js';
import data from '../data.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  await Shop.deleteMany({});
  const createdShops = await Shop.insertMany(data.shops);
  await Cart.deleteMany({});
  const createdCarts = await Cart.insertMany(data.carts);
  await Menu.deleteMany({});
  const createdMenus = await Menu.insertMany(data.menus);
  await User.deleteMany({});
  const createdUsers = await User.insertMany(data.users);
  res.send({ createdShops, createdCarts, createdMenus, createdUsers });
});

export default seedRouter;
