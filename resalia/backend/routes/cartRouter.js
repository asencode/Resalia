import express from 'express';
import Cart from '../models/cartModel.js';
import expressAsyncHandler from 'express-async-handler';

const cartRouter = express.Router();

cartRouter.put(
  '/updateCartViews',
  expressAsyncHandler(async (req, res) => {
    try {
      Cart.updateOne(
        { slug: req.body.slug, 'items.slug': req.body.itemslug },
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
      res
        .status(500)
        .send({ message: 'Error al actualizar las visitas del plato.' });
      return;
    }
  })
);

export default cartRouter;
