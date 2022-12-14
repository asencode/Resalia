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
    views: { type: Number, required: false, default: 0 },
    urlgmaps: { type: String, required: false },
    languages: { type: [String], required: false },
    currency: { type: String, required: false },
    decimals: { type: Number, required: false },
    facebook: { type: String, required: false },
    instagram: { type: String, required: false },
    twitter: { type: String, required: false },
    youtube: { type: String, required: false },
    tiktok: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const Shop = mongoose.model('Shop', shopSchema);
export default Shop;
