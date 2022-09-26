import React from 'react';
import { Link } from 'react-router-dom';

export default function HomeScreen() {
  return (
    <div>
      <h1>Home</h1>
      <Link to="/shops">Ver Clientes</Link>
    </div>
  );
}
