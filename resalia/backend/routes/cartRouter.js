import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Cart from '../models/cartModel.js';
import Menu from '../models/menuModel.js';
import Shop from '../models/shopModel.js';
import { slugify, isAuth } from '../utils.js';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import CartItem from '../models/cartItemModel.js';
import Format from '../models/formatModel.js';

const cartRouter = express.Router();

cartRouter.put(
  '/updateCartViews',
  expressAsyncHandler(async (req, res) => {
    try {
      Cart.updateOne(
        {
          shop: req.body.shop,
          slug: req.body.cart,
          'items.slug': req.body.slug,
        },
        {
          $inc: {
            'items.$.views': 1,
          },
        },
        function (err) {
          if (err) {
            console.log(err.message);
            res
              .status(500)
              .send({ message: 'Error al actualizar las visitas del plato.' });
            return;
          } else {
            res
              .status(200)
              .send({ message: 'Visitas del plato actualizadas con éxito' });
            return;
          }
        }
      );
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .send({ message: 'Error al actualizar las visitas del plato.' });
      return;
    }
  })
);

cartRouter.put(
  '/updateItemVisibility',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      Cart.updateOne(
        {
          shop: req.body.shop,
          slug: req.body.slug,
          'items.slug': req.body.itemSlug2,
        },
        {
          'items.$.isAvailable': req.body.available,
        },
        function (err) {
          if (err) {
            console.log(err.message);
            res.status(500).send({
              message: 'Error al actualizar la disponibilidad del plato.',
            });
            return;
          } else {
            res.status(200).send({
              message: 'Disponibilidad del plato actualizada con éxito',
            });
            return;
          }
        }
      );
    } catch (err) {
      console.log(err.message);
      res
        .status(500)
        .send({ message: 'Error al actualizar la disponibilidad del plato.' });
      return;
    }
  })
);

cartRouter.post(
  '/createCart',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      let cartslug = slugify(req.body.cartName);
      let iteration = 1;
      let notfound = false;

      let existingCart = await Cart.findOne({
        slug: cartslug,
        shop: req.body.shop,
      });

      while (existingCart) {
        existingCart = await Cart.findOne({
          slug: cartslug + '_' + iteration,
          shop: req.body.shop,
        });

        if (existingCart) {
          if (iteration >= 100) {
            notfound = true;
            break;
          } else {
            iteration++;
          }
        } else {
          cartslug = cartslug + '_' + iteration;
        }
      }

      if (notfound) {
        res.status(501).send({ message: 'Error al generar slug de la carta.' });
      } else {
        const newCart = new Cart({
          name: req.body.cartName,
          slug: cartslug,
          shop: req.body.shop,
        });
        const cart = await newCart.save();
        const shop = await Shop.findOne({ slug: req.body.shop });
        //TODO: comprobar que si una tienda no tiene alguno de estos datos la app no pete
        //(p.ej. que esta shop solo tenga 1 carta y 0 menus).
        const carts = await Cart.find({ shop: req.body.shop });
        const menus = await Menu.find({ shop: req.body.shop });

        res.send({ shop: shop, carts: carts, menus: menus });
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).send({ message: error.message });
    }
  })
);

cartRouter.put(
  '/updateCartItem',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      Cart.findOneAndUpdate(
        {
          shop: req.body.shop,
          slug: req.body.slug,
          'items.slug': req.body.itemSlug,
        },
        {
          'items.$.name': req.body.itemName,
          'items.$.category': req.body.itemCategory,
          'items.$.price': req.body.itemPrice,
          'items.$.description': req.body.itemDescription,
          'items.$.isVegetariano': req.body.itemIsVegetariano,
          'items.$.isVegano': req.body.itemIsVegano,
          'items.$.isFeatured': req.body.itemIsFeatured,
          'items.$.formats': req.body.itemFormats,
          'items.$.alergenos': req.body.itemAlergenos,
          'items.$.trazas': req.body.itemTrazas,
        },
        {
          new: true,
        },
        function (err, doc) {
          if (err) {
            console.log(err.message);
            res.status(500).send({
              message: 'Error al actualizar el plato.',
            });
            return;
          } else {
            res.status(200).send({
              message: 'Plato actualizado con éxito',
              cart: doc,
            });
            return;
          }
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send({ message: 'Error al actualizar el plato.' });
      return;
    }
  })
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.IMAGES_DIR + 'carts/');
  },
  filename: (req, file, cb) => {
    const fileName = uuidv4() + path.extname(file.originalname);
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

cartRouter.put(
  '/upload-image',
  isAuth,
  upload.single('itemImg'),
  expressAsyncHandler(async (req, res) => {
    Cart.findOneAndUpdate(
      {
        shop: req.body.shop,
        slug: req.body.slug,
        'items.slug': req.body.itemSlug,
      },
      {
        'items.$.image': res.req.file.filename,
      },
      {
        new: true,
      },
      function (err, doc) {
        if (err) {
          console.log(err.message);
          res.status(500).send({
            message: 'Error al actualizar la imagen el plato.',
          });
          return;
        } else {
          res.status(200).send({
            message: 'Imagen del plato actualizada con éxito',
            cart: doc,
          });
        }
      }
    );
  })
);

cartRouter.put(
  '/createItemFormat',
  isAuth,
  expressAsyncHandler((req, res) => {
    try {
      const newItemFormat = new Format({
        name: req.body.name,
        price: req.body.price,
      });
      Cart.findOneAndUpdate(
        {
          shop: req.body.shop,
          slug: req.body.slug,
          'items.slug': req.body.itemSlug,
        },
        {
          $push: { 'items.$.formats': newItemFormat },
        },
        {
          new: true,
        },
        function (err, doc) {
          if (err) {
            console.log(err.message);
            res.status(500).send({
              message: 'Error al crear el formato del ítem.',
            });
            return;
          } else {
            res.status(200).send({
              message: 'Formato del ítem creado con éxito',
              cart: doc,
            });
            return;
          }
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send({ message: err.message });
    }
  })
);

cartRouter.put(
  '/removeItemFormat',
  isAuth,
  expressAsyncHandler((req, res) => {
    try {
      Cart.findOneAndUpdate(
        {
          shop: req.body.shop,
          slug: req.body.slug,
          'items.slug': req.body.itemSlug,
        },
        {
          $pull: {
            'items.$.formats': { name: req.body.name, price: req.body.price },
          },
        },
        {
          new: true,
        },
        function (err, doc) {
          if (err) {
            console.log(err.message);
            res.status(500).send({
              message: 'Error al eliminar el formato del ítem.',
            });
            return;
          } else {
            res.status(200).send({
              message: 'Formato del ítem eliminado con éxito',
              cart: doc,
            });
            return;
          }
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send({ message: err.message });
    }
  })
);

cartRouter.put(
  '/updateItemFormat',
  isAuth,
  expressAsyncHandler((req, res) => {
    try {
      Cart.findOneAndUpdate(
        {
          shop: req.body.shop,
          slug: req.body.slug,
          'items.slug': req.body.itemSlug,
        },
        {
          $set: {
            'items.$[].formats.$[format].name': req.body.name,
            'items.$[].formats.$[format].price': req.body.price,
          },
        },
        {
          arrayFilters: [
            {
              'format.name': req.body.oldName,
              'format.price': req.body.oldPrice,
            },
          ],
          new: true,
        },
        function (err, doc) {
          if (err) {
            console.log(err.message);
            res.status(500).send({
              message: 'Error al actualizar el formato del ítem.',
            });
            return;
          } else {
            res.status(200).send({
              message: 'Formato del ítem actualizado con éxito',
              cart: doc,
            });
            return;
          }
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send({ message: err.message });
    }
  })
);

cartRouter.post(
  '/createCartItem',
  isAuth,
  upload.single('image'),
  expressAsyncHandler(async (req, res) => {
    try {
      let slug = slugify(req.body.name);
      let iteration = 1;
      let notfound = false;

      let existingCartItem = await Cart.findOne({
        shop: req.body.shop,
        slug: req.body.slug,
        'items.slug': slug,
      });

      while (existingCartItem) {
        existingCartItem = await Cart.findOne({
          shop: req.body.shop,
          slug: req.body.slug,
          slug: slug + '_' + iteration,
        });

        if (existingCartItem) {
          if (iteration >= 100) {
            notfound = true;
            break;
          } else {
            iteration++;
          }
        } else {
          slug = slug + '_' + iteration;
        }
      }

      if (notfound) {
        res.status(501).send({ message: 'Error al generar slug del ítem.' });
      } else {
        const newCartItem = new CartItem({
          slug: slug,
          image: res.req.file
            ? res.req.file.filename
            : process.env.DEFAULT_CART_ITEM_IMAGE,
          name: req.body.name,
          category: req.body.category,
          price: req.body.price,
          description: req.body.description,
          isVegetariano: req.body.isVegetariano,
          isVegano: req.body.isVegano,
          isFeatured: req.body.isFeatured,
          formats: req.body.formats,
          alergenos: req.body.alergenos,
          trazas: req.body.trazas,
        });

        Cart.findOneAndUpdate(
          {
            shop: req.body.shop,
            slug: req.body.slug,
          },
          {
            $push: { items: newCartItem },
          },
          {
            new: true,
          },
          function (err, doc) {
            if (err) {
              console.log(err.message);
              res.status(500).send({
                message: 'Error al crear el plato.',
              });
              return;
            } else {
              res.status(200).send({
                message: 'Plato creado con éxito',
                cart: doc,
              });
            }
          }
        );
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).send({ message: error.message });
    }
  })
);

export default cartRouter;
