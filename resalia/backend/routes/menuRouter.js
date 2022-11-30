import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Cart from '../models/cartModel.js';
import Menu from '../models/menuModel.js';
import Shop from '../models/shopModel.js';
import { isAuth, slugify } from '../utils.js';

const menuRouter = express.Router();

menuRouter.put(
  '/updateMenuViews',
  expressAsyncHandler(async (req, res) => {
    try {
      Menu.updateOne(
        {
          shop: req.body.shop,
          slug: req.body.menu,
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

menuRouter.put(
  '/updateItemVisibility',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      Menu.updateOne(
        {
          shop: req.body.shop,
          slug: req.body.slug,
          'items.slug': req.body.itemSlug,
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

menuRouter.post(
  '/createMenu',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      let menuslug = slugify(req.body.menuName);
      let iteration = 1;
      let notfound = false;

      let existingMenu = await Menu.findOne({
        slug: menuslug,
        shop: req.body.shop,
      });

      while (existingMenu) {
        existingMenu = await Menu.findOne({
          slug: menuslug + '_' + iteration,
          shop: req.body.shop,
        });

        if (existingMenu) {
          if (iteration >= 100) {
            notfound = true;
            break;
          } else {
            iteration++;
          }
        } else {
          menuslug = menuslug + '_' + iteration;
        }
      }

      if (notfound) {
        res.status(501).send({ message: 'Error al generar slug del menú.' });
      } else {
        const newMenu = new Menu({
          name: req.body.menuName,
          slug: menuslug,
          shop: req.body.shop,
        });
        const menu = await newMenu.save();

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

export default menuRouter;
