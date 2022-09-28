import React, { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Resalia } from '../Resalia';

export default function AdminDashboardScreen() {
  const { state } = useContext(Resalia);
  const { userInfo } = state;
  return (
    <div>
      <Helmet>
        <title>Admin Dashboard</title>
      </Helmet>
      <h1 className="my-3">Admin Dashboard</h1>
    </div>
  );
}
