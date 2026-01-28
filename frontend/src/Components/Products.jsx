import React, { useState, useEffect } from "react";
import "./Products.css";
import { AddToCartIcon, RemoveFromCartIcon } from "./Icons.jsx";
import { useCart } from "../hoocks/useCart.js";
import { useFilters } from "../hoocks/useFilters.js";
import { supabase } from "../lib/supabaseClient.js";

export function Products() {
  const { addToCart, removeFromCart, cart } = useCart();
  const { filterProducts } = useFilters();

  const [products, setProducts] = useState([]);
  const [tasaDolar, setTasaDolar] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: configData } = await supabase
        .from("configuracion")
        .select("valor_dolar")
        .eq("id", 1)
        .single();

      setTasaDolar(configData?.valor_dolar || 0);

      const { data: prodData, error } = await supabase
        .from("productos")
        .select("*");

      if (error) throw error;
      setProducts(prodData || []);
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = filterProducts(products);

  const checkProductInCart = (product) => {
    return cart.some((item) => item.id === product.id);
  };

  if (loading) return <div className="loading">CARGANDO INVENTARIO...</div>;

  return (
    <main className="products">
      <ul>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const isProductInCart = checkProductInCart(product);
            const precioNum = Number(product.price || 0);
            const precioBs = (precioNum * tasaDolar).toFixed(2);

            const tipoVenta =
              Array.isArray(product.tipo) && product.tipo.length > 0
                ? product.tipo[0]
                : "";

            return (
              <li key={product.id} tipo={product.category}>
                <img
                  src={product.thumbnail || "https://via.placeholder.com/150"}
                  alt={product.title}
                  loading="lazy"
                />

                <div>
                  <strong>{product.title}</strong>
                  <div className="price-container">
                    <h2 price={precioNum.toString()}>
                      $ {precioNum.toFixed(2)}
                    </h2>
                    <span className="bs-text">{precioBs} Bs</span>
                  </div>
                </div>

                {tipoVenta && <span className="badge-tipo">{tipoVenta}</span>}

                <div>
                  <button
                    className="boton-producto"
                    style={{
                      backgroundColor: isProductInCart ? "#000" : "#18a560",
                      color: "#fff",
                    }}
                    onClick={() => {
                      isProductInCart
                        ? removeFromCart(product)
                        : addToCart(product);
                    }}
                  >
                    {isProductInCart ? (
                      <RemoveFromCartIcon />
                    ) : (
                      <AddToCartIcon />
                    )}
                  </button>
                </div>
              </li>
            );
          })
        ) : (
          <div className="no-products">
            <h2 style={{ color: "white", textAlign: "center", width: "100%" }}>
              No se encontraron productos que coincidan.
            </h2>
          </div>
        )}
      </ul>
    </main>
  );
}
