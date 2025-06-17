import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');

  if (!token) {
    // If no token, redirect to admin login page
    return <Navigate to="/admin/login" replace />;
  }

  // If token exists, render the child components (Outlet or children prop)
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
