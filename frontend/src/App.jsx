import React from "react";
import { FiltersProvider } from "./context/filters.jsx";
import { CartProvider } from "./context/cart.jsx";
import { AppRouter } from "./router/AppRouter.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
// import "./viewtransition.css";

function App() {
  return (
    <AuthProvider>
      <FiltersProvider>
        <CartProvider>
          <AppRouter />
        </CartProvider>
      </FiltersProvider>
    </AuthProvider>
  );
}

export default App;
