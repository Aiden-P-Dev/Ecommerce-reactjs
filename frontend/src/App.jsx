import React from "react";
import { FiltersProvider } from "./context/filters.jsx";
import { CartProvider } from "./context/cart.jsx";
import { AppRouter } from "./router/AppRouter.jsx";

function App() {
  return (
    <FiltersProvider>
      <CartProvider>
        <AppRouter />
      </CartProvider>
    </FiltersProvider>
  );
}

export default App;
