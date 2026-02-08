import React, { useState, useEffect } from "react";
import "./Products.css";

import { AddToCartIcon, RemoveFromCartIcon } from "./Icons.jsx";
import { useCart } from "../hoocks/useCart.js";
import { useFilters } from "../hoocks/useFilters.js";
import { supabase } from "../lib/supabaseClient.js";

// Componente Interno del Skeleton para la cuadrícula
const SkeletonProduct = () => (
  <li
    className="skeleton-container animate-pulse-custom"
    style={{ listStyle: "none" }}
  >
    <div
      className="skeleton-image-box"
      style={{ height: "180px", marginBottom: "15px" }}
    >
      <svg
        viewBox="0 0 16 20"
        fill="currentColor"
        className="skeleton-icon"
        style={{ width: "40px" }}
      >
        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
      </svg>
    </div>
    <div
      className="skeleton-line title"
      style={{ width: "80%", marginBottom: "10px" }}
    ></div>
    <div
      className="skeleton-line"
      style={{ width: "40%", marginBottom: "20px" }}
    ></div>
    <div
      className="skeleton-footer"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <div
        className="skeleton-line"
        style={{ width: "50px", height: "35px", borderRadius: "4px" }}
      ></div>
    </div>
  </li>
);

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
      // 1. Obtener tasa del dólar
      const { data: configData } = await supabase
        .from("configuracion")
        .select("valor_dolar")
        .eq("id", 1)
        .single();

      setTasaDolar(configData?.valor_dolar || 0);

      // 2. Obtener productos
      const { data: prodData, error } = await supabase
        .from("productos")
        .select("*");

      if (error) throw error;
      setProducts(prodData || []);
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      // Un pequeño delay artificial opcional para que se aprecie el skeleton
      // setTimeout(() => setLoading(false), 800);
      setLoading(false);
    }
  };

  const filteredProducts = filterProducts(products);

  const checkProductInCart = (product) => {
    return cart.some((item) => item.id === product.id);
  };

  return (
    <main className="products">
      <ul>
        {loading ? (
          /* MIENTRAS CARGA: Mostramos 8 esqueletos */
          Array.from({ length: 8 }).map((_, index) => (
            <SkeletonProduct key={index} />
          ))
        ) : filteredProducts.length > 0 ? (
          /* CUANDO CARGA: Mostramos productos reales */
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
          /* SI NO HAY RESULTADOS */
          <div
            className="no-products"
            style={{ width: "100%", gridColumn: "1 / -1" }}
          >
            <h2 style={{ color: "white", textAlign: "center" }}>
              No se encontraron productos que coincidan.
            </h2>
          </div>
        )}
      </ul>
    </main>
  );
}
