// In client/src/components/auth/ProtectedRoute.tsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // 1. Check for the token in local storage
  const token = localStorage.getItem('token');

  // 2. If the token exists, render the page
  //    The <Outlet /> is a placeholder for whatever
  //    page this component is wrapping (e.g., Dashboard).
  if (token) {
    return <Outlet />;
  }

  // 3. If no token, redirect to the login page
  //    The 'replace' prop is important for good browser history
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;