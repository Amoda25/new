import React from "react";
import { Navigate } from "react-router-dom";
import { getUserRole } from "../utils/jwtUtils";

const RoleRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = getUserRole();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleRoute;