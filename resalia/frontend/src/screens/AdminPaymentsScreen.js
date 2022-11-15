import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function AdminPaymentsScreen() {
  return (
    <div>
      <Helmet>
        <title>Resalia - Mis Pagos</title>
      </Helmet>
      <h1 className="mt-4 mb-5">Mis Pagos</h1>
    </div>
  );
}
