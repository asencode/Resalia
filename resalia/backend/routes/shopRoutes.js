import express from 'express';
import Shop from '../models/shopModel.js';
import Cart from '../models/cartModel.js';
import Menu from '../models/menuModel.js';
import User from '../models/userModel.js';
import expressAsyncHandler from 'express-async-handler';
import { isAuth } from '../utils.js';
import multer from 'multer';
import { uuid } from 'uuidv4';
import path from 'path';

const shopRouter = express.Router();

shopRouter.get('/', async (req, res) => {
  const { query } = req;
  const userId = query.userId;

  if (userId) {
    const user = await User.findById(userId);
    if (user) {
      var shops;
      if (user.isAdmin) {
        shops = await Shop.find();
      } else {
        shops = await Shop.find({ slug: user.shops }).sort({ name: 1 });
      }

      if (shops) {
        res.send(shops);
      } else {
        res.status(404).send({ message: 'Shops Not Found' });
      }
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  } else {
    res.status(404).send({ message: 'User Not Found' });
  }
});

shopRouter.get('/:slug/cart', async (req, res) => {
  const cart = await Cart.findOne({ shop: req.params.slug });
  if (cart.items) {
    res.send(cart.items);
  } else {
    res.status(404).send({ message: 'Cart Not Found' });
  }
});

shopRouter.get('/:slug/menu', async (req, res) => {
  const menu = await Menu.findOne({ shop: req.params.slug });
  if (menu.items) {
    res.send(menu.items);
  } else {
    res.status(404).send({ message: 'Menu Not Found' });
  }
});

shopRouter.get('/:slug', async (req, res) => {
  const shop = await Shop.findOne({ slug: req.params.slug });
  if (shop) {
    res.send(shop);
  } else {
    res.status(404).send({ message: 'Shop Not Found' });
  }
});

shopRouter.put(
  '/update',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const shop = await Shop.findOne({ slug: req.body.slug });

    if (shop) {
      shop.name = req.body.name;
      shop.address = req.body.address;
      shop.city = req.body.city;
      shop.locality = req.body.locality;
      shop.postcode = req.body.postcode;
      shop.email = req.body.email;
      shop.phone1 = req.body.phone1;
      shop.phone2 = req.body.phone2;

      const updatedShop = await shop.save();
      res.send({
        name: updatedShop.name,
        address: updatedShop.address,
        city: updatedShop.city,
        locality: updatedShop.locality,
        postcode: updatedShop.postcode,
        email: updatedShop.email,
        phone1: updatedShop.phone1,
        phone2: updatedShop.phone2,
      });
      return;
    } else {
      res.status(404).send({ message: 'Establecimiento no encontrado.' });
    }
  })
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.IMAGES_DIR + 'shops/');
  },
  filename: (req, file, cb) => {
    const fileName = v4() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

let upload = multer({
  limits: { fileSize: 2097152 },
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg' ||
      file.mimetype == 'image/bmp' ||
      file.mimetype == 'image/gif' ||
      file.mimetype == 'image/webp'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(
        new Error('Formatos permitidos: PNG, JPG, JPEG, BMP, GIF, WEBP')
      );
    }
  },
});

shopRouter.put(
  '/upload-image',
  isAuth,
  upload.single('profileImg'),
  expressAsyncHandler(async (req, res) => {
    const shop = await Shop.findOne({ slug: req.body.slug });

    console.log('filename', res.req.file.filename);

    if (shop) {
      shop.image = res.req.file.filename;

      const updatedShop = await shop.save();
      res
        .status(200)
        .send({ message: 'Imagen de la tienda actualizada con éxito' });
    } else {
      res.status(500).send({
        message: `No se pudo actualizar la imagen. ${err}`,
      });
    }
  })
);

export default shopRouter;
