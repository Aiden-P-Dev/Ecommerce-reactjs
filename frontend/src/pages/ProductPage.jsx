import React, { useEffect, useState } from "react";
import { Products } from "../Components/Products.jsx";
import { Header } from "../Components/Header.jsx";
import { Footer } from "../Components/Footer.jsx";
import { useFilters } from "../hoocks/useFilters.js";
import { supabase } from "../lib/supabaseClient.js";

export const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { filterProducts } = useFilters();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase.from("productos").select("*");

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error("Error cargando Supabase:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = filterProducts(products);

  return (
    <>
      <Header />
      <main>
        {loading ? <h2></h2> : <Products products={filteredProducts} />}
      </main>
      <Footer />
    </>
  );
};
