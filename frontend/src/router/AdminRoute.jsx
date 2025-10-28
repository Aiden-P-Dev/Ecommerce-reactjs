import React from "react";
import { Navigate, Outlet } from "react-router-dom";
// Asegúrate de que este hook o contexto proporciona el rol y el estado de login
import { useAuth } from "../context/AuthContext"; // <--- Debes tener este archivo

const AdminRoute = ({ children }) => {
  // Suposición: usas un hook que te da el estado del usuario
  const { isLoggedIn, userRole } = useAuth();

  // Define el rol requerido
  const requiredRole = "admin";

  // 1. Si no está logueado, redirige al login.
  if (!isLoggedIn) {
    // Si el usuario no ha iniciado sesión, lo mandamos a la página de login
    return <Navigate to="/login" replace />;
  }

  // 2. Si está logueado pero NO es administrador, lo redirige a la página principal o a un 403.
  if (userRole !== requiredRole) {
    // Si el usuario no tiene el rol de administrador, lo mandamos a la página principal
    // Opcional: podrías redirigirlo a una página 403 (Acceso Denegado)
    alert("Acceso Denegado: Solo para Administradores.");
    return <Navigate to="/" replace />;
  }

  // 3. Si está logueado Y es administrador, permite el acceso.
  return children ? children : <Outlet />;
};

export default AdminRoute;
