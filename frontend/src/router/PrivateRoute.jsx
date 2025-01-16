// import React from "react";
// export const PrivateRoute = ({ children }) => {
//   const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

//   return isLoggedIn ? children : <Navigate to="/login" />;
// };

import { Navigate, Outlet } from "react-router-dom";
import React from "react";
import { useAuth } from "../context/AuthContext.jsx";

function PrivateRoute() {
  const { loading, isAuthenticated } = useAuth();
  console.log(loading.isAuthenticated);
  if (loading) return <h1>cargando</h1>;
  if (!loading && !isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export default PrivateRoute;
