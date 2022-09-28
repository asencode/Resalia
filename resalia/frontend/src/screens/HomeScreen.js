import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function HomeScreen() {
  return (
    <div>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <h1 className="my-3">Home</h1>
      <Link to="/shops">Ver Clientes</Link>
    </div>
  );
}
