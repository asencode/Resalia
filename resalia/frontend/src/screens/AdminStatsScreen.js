import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function AdminStatsScreen() {
  return (
    <div>
      <Helmet>
        <title>Resalia - Mis Estadísticas</title>
      </Helmet>
      <h1 className="mt-4 mb-5">Mis Estadísticas</h1>
    </div>
  );
}
