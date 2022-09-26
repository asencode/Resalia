import express from 'express';
import data from './data.js';

const app = express();

app.get('/api/products', (req, res) => {
  res.send(data.products);
});

app.get('/api/shops', (req, res) => {
  res.send(data.shops);
});

app.get('/api/shops/:slug/cart', async (req, res) => {
  console.log('entro1');
  const shop = data.shops.find((o) => o.slug === req.params.slug);
  console.log('entro2');
  if (shop) {
    console.log('entro3');
    const cart = data.carts.find((o) => o._id === shop.cart).items;
    console.log('entro4');
    if (cart) {
      console.log('entro5');
      res.send(cart);
    } else {
      console.log('entro6');
      res.status(404).send({ message: 'Cart Not Found' });
    }
  } else {
    console.log('entro7');
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

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
