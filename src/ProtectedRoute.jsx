import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    // If no token, redirect to login
    return <Navigate to="/auth" replace />;
  }

  // If token exists, allow access
  return children;
};

export default ProtectedRoute;