import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { generateToken, isAuth } from '../utils.js';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import Solicitud from '../models/solicitudModel.js';

const userRouter = express.Router();

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
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

userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const newSolicitud = new Solicitud({
      name: req.body.name,
      email: req.body.email,
      telefono: req.body.telefono,
      infoAdicional: req.body.infoAdicional,
    });
    const solicitud = newSolicitud.save();
    res.send({
      _id: solicitud._id,
      name: solicitud.name,
      email: solicitud.email,
      telefono: solicitud.telefono,
      infoAdicional: solicitud.infoAdicional,
    });
    return;
  })
);

userRouter.get('/personal-info/:userId', async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (user) {
    res.send(user);
  } else {
    res.status(404).send({ message: 'Usuario no encontrado' });
  }
});

userRouter.put(
  '/personal-info',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      user.name = req.body.name;
      user.surname = req.body.surname;
      user.phone1 = req.body.phone1;
      user.phone2 = req.body.phone2;
      user.address1 = req.body.address1;
      user.address2 = req.body.address2;
      user.city = req.body.city;
      user.province = req.body.province;
      user.postcode = req.body.postcode;

      const updatedUser = await user.save();
      res.send({
        _id: user._id,
        name: updatedUser.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user),
      });
      return;
    } else {
      res.status(404).send({ message: 'Usuario no encontrado' });
    }
  })
);

export default userRouter;
