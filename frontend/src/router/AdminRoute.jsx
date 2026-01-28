import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { isLoggedIn, userRole } = useAuth();

  const requiredRole = "admin";

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== requiredRole) {
    alert("Acceso Denegado: Solo para Administradores.");
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default AdminRoute;
