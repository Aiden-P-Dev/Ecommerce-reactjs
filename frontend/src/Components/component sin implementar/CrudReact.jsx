import React, { useState, useEffect } from "react";
import { useCart } from "../hoocks/useCart.js"; // Ajusta la ruta si es necesario

function ProductManager() {
  const { products, addProduct, updateProduct, deleteProduct } = useCart();

  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    title: "",
    category: "",
    thumbnail: "",
    price: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleCreateOrUpdate = (e) => {
    e.preventDefault();
    if (
      !currentProduct.title ||
      !currentProduct.category ||
      !currentProduct.price
    ) {
      alert(
        "Por favor, completa los campos obligatorios (Título, Categoría, Precio)."
      );
      return;
    }

    if (currentProduct.id) {
      updateProduct(currentProduct);
    } else {
      addProduct(currentProduct);
    }

    setCurrentProduct({
      id: null,
      title: "",
      category: "",
      thumbnail: "",
      price: "",
      description: "",
    });
  };

  const handleEditClick = (product) => {
    setCurrentProduct({ ...product });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Gestión de Productos</h1>

      {/* --- Formulario para Crear/Editar Producto --- */}
      <h2>{currentProduct.id ? "Editar Producto" : "Crear Nuevo Producto"}</h2>
      <form
        onSubmit={handleCreateOrUpdate}
        style={{
          marginBottom: "30px",
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <div style={{ marginBottom: "10px" }}>
          <label
            htmlFor="title"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Título:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={currentProduct.title}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label
            htmlFor="category"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Categoría:
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={currentProduct.category}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label
            htmlFor="thumbnail"
            style={{ display: "block", marginBottom: "5px" }}
          >
            URL de Imagen:
          </label>
          <input
            type="text"
            id="thumbnail"
            name="thumbnail"
            value={currentProduct.thumbnail}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label
            htmlFor="price"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Precio:
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={currentProduct.price}
            onChange={handleChange}
            required
            step="0.01"
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="description"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Descripción:
          </label>
          <textarea
            id="description"
            name="description"
            value={currentProduct.description}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
              boxSizing: "border-box",
              minHeight: "80px",
            }}
          ></textarea>
        </div>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {currentProduct.id ? "Actualizar Producto" : "Agregar Producto"}
        </button>
        {currentProduct.id && (
          <button
            type="button"
            onClick={() =>
              setCurrentProduct({
                id: null,
                title: "",
                category: "",
                thumbnail: "",
                price: "",
                description: "",
              })
            }
            style={{
              marginLeft: "10px",
              padding: "10px 20px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Cancelar Edición
          </button>
        )}
      </form>

      {/* --- Lista de Productos --- */}
      <h2>Lista de Productos Disponibles</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {products.length > 0 ? (
          products.map((product) => (
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
                src={product.thumbnail || "https://via.placeholder.com/100"}
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
                <p
                  style={{
                    margin: "0 0 5px 0",
                    color: "#666",
                    fontSize: "0.9em",
                  }}
                >
                  {product.description}
                </p>
                <h2
                  data-price={product.price}
                  style={{ margin: 0, color: "#007bff", fontSize: "1.5em" }}
                >
                  ${product.price ? product.price.toFixed(2) : "N/A"}
                </h2>
              </div>
              <div>
                <button
                  onClick={() => handleEditClick(product)}
                  style={{
                    padding: "8px 12px",
                    marginRight: "5px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))
        ) : (
          <p>No hay productos disponibles.</p>
        )}
      </ul>
    </div>
  );
}

export default ProductManager;
