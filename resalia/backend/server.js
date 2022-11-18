import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import shopRouter from './routes/shopRoutes.js';
import userRouter from './routes/userRoutes.js';
import seedRouter from './routes/seedRouter.js';
import cors from 'cors';
import cartRouter from './routes/cartRouter.js';
import menuRouter from './routes/menuRouter.js';

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/shops', shopRouter);
app.use('/api/users', userRouter);
app.use('/api/carts', cartRouter);
app.use('/api/menus', menuRouter);
app.use('/api/seed', seedRouter);

app.use('/images', express.static('public/images'));

app.use((err, req, res, next) => {
  if (err.code == 'LIMIT_FILE_SIZE') {
    return res.status(500).send({
      message: 'Debes subir una imagen de menos de 2 MB de tamaño.',
    });
  } else {
    res.status(500).send({ message: err.message });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
