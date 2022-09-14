import React from 'react';
import { Link } from 'react-router-dom';
import data from '../data';

export default function HomeScreen() {
  return (
    <div>
      <h1>Menú A La Carta</h1>
      <div className="products">
        {data.products.map((product) => (
          <div className="product" key={product.slug}>
            <Link to={`/product/${product.slug}`}>
              <img src={product.image} alt={product.name} />
            </Link>
            <div className="productInfo">
              <Link to={`/product/${product.slug}`}>
                <p>{product.name}</p>
              </Link>
              <p>
                <i>{product.category}</i>
              </p>
              <p>
                <strong>{product.price}€</strong>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
