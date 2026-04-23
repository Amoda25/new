import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserRole, isAuthenticated } from '../../utils/jwtUtils';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuth = isAuthenticated();
  const userRole = getUserRole();

  if (!isAuth) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to unauthorized page if role is not allowed
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
