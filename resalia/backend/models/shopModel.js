import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: {
      type: String,
      required: false,
      default: 'profile-shop-default.png',
    },
    address: { type: String, required: true },
    city: { type: String, required: true },
    locality: { type: String, required: true },
    postcode: { type: String, required: true },
    email: { type: String, required: true },
    phone1: { type: String, required: true },
    phone2: { type: String, required: false },
    locationLA: { type: Number, required: false },
    locationLO: { type: Number, required: false },
  },
  {
    timestamps: true,
  }
);

const Shop = mongoose.model('Shop', shopSchema);
export default Shop;
