import React from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { Menuprincipal } from "../pages/Menuprincipal.jsx";
import { ProductPage } from "../pages/ProductPage.jsx";
import { Login } from "../pages/Login.jsx";
import { Signup } from "../pages/Signup.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
// import "../viewtransition.css";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Menuprincipal />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<PrivateRoute />}>
        <Route path="/products" element={<ProductPage />}></Route>
      </Route>

      {/* <Route
        path="/products"
        element={
          <PrivateRoute>
            <ProductPage />
          </PrivateRoute>
        }
      /> */}

      {/* Redirect to products if user is logged in */}
      {/* <Route
        path="*"
        element={
          <PrivateRoute>
            <Navigate to="/products" replace />
          </PrivateRoute>
        }
      /> */}
    </Routes>
  );
};
