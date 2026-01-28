import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient.js";
import "./ProductList.css";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error cargando productos:", error);
    } else {
      setProducts(data);
    }
    setLoading(false);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Todas" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["Todas", ...new Set(products.map((p) => p.category))];

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setEditForm({ ...product });
  };

  const handleSave = async (id) => {
    const { error } = await supabase
      .from("productos")
      .update({
        title: editForm.title,
        price: parseFloat(editForm.price),
        stock: parseInt(editForm.stock),
        category: editForm.category,
      })
      .eq("id", id);

    if (error) {
      alert("Error al actualizar: " + error.message);
    } else {
      setProducts(products.map((p) => (p.id === id ? editForm : p)));
      setEditingId(null);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar este producto permanentemente?",
    );
    if (!confirmDelete) return;

    const { error } = await supabase.from("productos").delete().eq("id", id);
    if (error) {
      alert("Error: " + error.message);
    } else {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  if (loading) return <p className="loading-text">Cargando base de datos...</p>;

  return (
    <div className="Product-list">
      <div className="Product-grid">
        <h1 className="Title-list">Inventario en Tiempo Real</h1>

        <div className="filters-container">
          <input
            type="text"
            placeholder="Buscar producto..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "Todas"
                  ? "Todas las Categorías"
                  : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid-container">
          <ul className="Grid-list" style={{ listStyle: "none", padding: 0 }}>
            {filteredProducts.map((product) => {
              const isEditing = editingId === product.id;
              const isRecent =
                new Date(product.created_at) >
                new Date(Date.now() - 24 * 60 * 60 * 1000);

              return (
                <li
                  className="item-list"
                  key={product.id}
                  style={{
                    border: isRecent ? "3px solid #4FDA86" : "1px solid #ddd",
                  }}
                >
                  <img
                    className="img-list"
                    src={product.thumbnail}
                    alt={product.title}
                  />

                  <div className="container-info">
                    {isEditing ? (
                      <div className="edit-mode-container">
                        <input
                          className="edit-input"
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm({ ...editForm, title: e.target.value })
                          }
                        />
                        <div style={{ display: "flex", gap: "5px" }}>
                          <input
                            className="edit-input"
                            type="number"
                            step="0.01"
                            value={editForm.price}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                price: e.target.value,
                              })
                            }
                          />
                          <input
                            className="edit-input"
                            type="number"
                            value={editForm.stock}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                stock: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="btn-group">
                          <button
                            onClick={() => handleSave(product.id)}
                            className="btn-save"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="btn-cancel"
                          >
                            X
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <strong className="title-info">{product.title}</strong>
                        <p className="category-info">{product.category}</p>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <h2 className="price-info">
                            ${Number(product.price).toFixed(2)}
                          </h2>
                          <span className="stock-info">
                            Stock: {product.stock}
                          </span>
                        </div>
                        <div className="btn-group">
                          <button
                            onClick={() => handleEditClick(product)}
                            className="btn-edit"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="btn-delete"
                          >
                            Eliminar
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          {filteredProducts.length === 0 && (
            <p className="no-results">No se encontraron productos.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductList;
