import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Menuprincipal } from "../pages/Menuprincipal.jsx";
import { ProductPage } from "../pages/ProductPage.jsx";
import { Login } from "../pages/Login.jsx";
import { Signup } from "../pages/Signup.jsx";

import PrivateRoute from "./PrivateRoute.jsx";
import Prueba from "../pages/Prueba.jsx";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Menuprincipal />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<PrivateRoute />}>
        <Route path="/products" element={<ProductPage />} />
      </Route>

      <Route element={<Prueba />}>
        <Route path="/admin-panel" element={<Prueba />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
