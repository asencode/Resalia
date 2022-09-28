import express from 'express';
import data from './data.js';
import expressAsyncHandler from 'express-async-handler';
import { generateToken } from './utils.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to database.');
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();

app.get('/api/products', (req, res) => {
  res.send(data.products);
});

app.get('/api/shops', (req, res) => {
  res.send(data.shops);
});

app.get('/api/shops/:slug/cart', async (req, res) => {
  const shop = data.shops.find((o) => o.slug === req.params.slug);
  if (shop) {
    const cart = data.carts.find((o) => o._id === shop.cart).items;
    if (cart) {
      res.send(cart);
    } else {
      res.status(404).send({ message: 'Cart Not Found' });
    }
  } else {
    res.status(404).send({ message: 'Shop Not Found' });
  }
});

app.get('/api/shops/:slug/menu', async (req, res) => {
  const shop = data.shops.find((o) => o.slug === req.params.slug);
  if (shop) {
    const menu = data.menus.find((o) => o._id === shop.menu).items;
    if (menu) {
      res.send(menu);
    } else {
      res.status(404).send({ message: 'Menu Not Found' });
    }
  } else {
    res.status(404).send({ message: 'Shop Not Found' });
  }
});

app.get('/api/shops/:slug', async (req, res) => {
  const shop = data.shops.find((o) => o.slug === req.params.slug);
  if (shop) {
    res.send(shop);
  } else {
    res.status(404).send({ message: 'Shop Not Found' });
  }
});

app.post(
  '/api/users/signin',
  expressAsyncHandler(async (req, res) => {
    const user = data.users.find((o) => o.email === req.body.email);
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Email o contraseña no válidas.' });
  })
);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
