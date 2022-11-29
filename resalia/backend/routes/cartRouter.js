import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Cart from '../models/cartModel.js';
import Menu from '../models/menuModel.js';
import Shop from '../models/shopModel.js';
import { slugify, isAuth } from '../utils.js';

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
        console.log('carta creada', cart.items);
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

export default cartRouter;
