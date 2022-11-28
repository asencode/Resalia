import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Menu from '../models/menuModel.js';

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

export default menuRouter;
