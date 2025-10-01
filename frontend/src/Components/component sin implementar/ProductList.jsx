import React, { useState, useEffect } from "react";
import productsData from "../mocks/products.json";

function ProductListFromJson() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    console.log("Datos cargados del JSON:", productsData.products);
    setProducts(productsData.products);
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Nuestros Productos</h1>
      {products.length === 0 ? (
        <p>Cargando productos...</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {products.map((product) => (
            <li
              key={product.id}
              data-tipo={product.category}
              style={{
                border: "1px solid #ddd",
                marginBottom: "10px",
                padding: "15px",
                display: "flex",
                alignItems: "center",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={product.thumbnail}
                alt={product.title}
                loading="lazy"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  marginRight: "15px",
                  borderRadius: "4px",
                }}
              />
              <div style={{ flexGrow: 1 }}>
                <strong
                  style={{
                    fontSize: "1.2em",
                    display: "block",
                    marginBottom: "5px",
                  }}
                >
                  {product.title}
                </strong>
                <p style={{ margin: "0 0 5px 0", color: "#555" }}>
                  Categoría: {product.category}
                </p>
                <h2
                  data-price={product.price}
                  style={{ margin: 0, color: "#007bff", fontSize: "1.5em" }}
                >
                  {product.price ? product.price.toFixed(2) : "N/A"}
                </h2>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProductListFromJson;
