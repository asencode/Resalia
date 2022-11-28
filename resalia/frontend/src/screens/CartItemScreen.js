import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function CartItemScreen() {
  const params = useParams();
  const { shop, cart, slug } = params;

  useEffect(() => {
    if (shop) {
      const addVisit = async () => {
        await axios
          .put('/api/carts/updateCartViews', { shop, cart, slug })
          .catch((err) => {
            console.log(err.message);
          });
      };
      addVisit();
    }
  }, [shop, cart, slug]);

  return <div>Producto: {slug}</div>;
}
