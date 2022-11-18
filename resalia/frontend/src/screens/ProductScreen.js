import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function ProductScreen() {
  const params = useParams();
  const { slug, itemslug } = params;

  useEffect(() => {
    if (slug) {
      const addVisit = async () => {
        await axios
          .put('/api/carts/updateCartViews', { slug, itemslug })
          .catch((err) => {
            console.log(err.message);
          });
      };
      addVisit();
    }
  });

  return <div>Producto: {slug}</div>;
}
