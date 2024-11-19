import React from "react";
import { products as initialProducts } from "../mocks/products.json";
import { Products } from "../Components/Products.jsx";
import { Header } from "../Components/Header.jsx";
import { Footer } from "../Components/Footer.jsx";
import { IS_DEVELOPMENT } from "../config.js";
import { useFilters } from "../hoocks/useFilters.js";

export const ProductPage = () => {
  const { filterProducts } = useFilters();
  const filteredProducts = filterProducts(initialProducts);

  return (
    <>
      <Header />
      <main>
        <Products products={filteredProducts} />
      </main>
      {IS_DEVELOPMENT && <Footer />}
    </>
  );
};
