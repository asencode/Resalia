import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function MenuItemScreen() {
  const params = useParams();
  const { shop, menu, slug } = params;

  useEffect(() => {
    if (shop) {
      const addVisit = async () => {
        await axios
          .put('/api/menus/updateMenuViews', { shop, menu, slug })
          .catch((err) => {
            console.log(err.message);
          });
      };
      addVisit();
    }
  }, [shop, menu, slug]);

  return <div>Producto: {slug}</div>;
}
