import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabaseClient.js";
import "./ProductManager.css";

// --- Iconos SVG ---
const IconEdit = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#3498db"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const IconDelete = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#e74c3c"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);
const IconTrashSmall = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#e74c3c"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

function ProductManager() {
  const [products, setProducts] = useState([]);
  const [tasaDolar, setTasaDolar] = useState(1);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [showCatMenu, setShowCatMenu] = useState(false); // Nuevo: Menú de categorías
  const [customType, setCustomType] = useState("");
  const [customCat, setCustomCat] = useState(""); // Nuevo: Input para nueva categoría
  const formRef = useRef(null);
  const typeMenuRef = useRef(null);
  const catMenuRef = useRef(null);

  const opcionesBase = ["unidad", "litro", "docena", "gramo", "kg", "caja"];
  const [availableTypes, setAvailableTypes] = useState(opcionesBase);
  const [availableCategories, setAvailableCategories] = useState([]); // Estado global de categorías

  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    title: "",
    category: "",
    thumbnail: "",
    price: "",
    stock: 0,
    tipo: [],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  useEffect(() => {
    fetchTasa();
    fetchProducts();
    const handleClickOutside = (e) => {
      if (typeMenuRef.current && !typeMenuRef.current.contains(e.target))
        setShowTypeMenu(false);
      if (catMenuRef.current && !catMenuRef.current.contains(e.target))
        setShowCatMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Actualizar categorías y medidas disponibles basadas en los productos existentes
  useEffect(() => {
    const tiposEnDB = products.flatMap((p) => p.tipo || []);
    setAvailableTypes([...new Set([...opcionesBase, ...tiposEnDB])]);

    const catsEnDB = products.map((p) => p.category).filter(Boolean);
    setAvailableCategories([...new Set(catsEnDB)]);
  }, [products]);

  const fetchTasa = async () => {
    const { data } = await supabase
      .from("configuracion")
      .select("valor_dolar")
      .eq("id", 1)
      .single();
    if (data) setTasaDolar(data.valor_dolar);
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .order("id", { ascending: false });
    if (!error)
      setProducts(
        data.map((p) => ({ ...p, tipo: Array.isArray(p.tipo) ? p.tipo : [] })),
      );
  };

  const handleTipoToggle = (opt) => {
    const nuevos = currentProduct.tipo.includes(opt)
      ? currentProduct.tipo.filter((t) => t !== opt)
      : [...currentProduct.tipo, opt];
    setCurrentProduct({ ...currentProduct, tipo: nuevos });
  };

  const addCustomType = () => {
    const val = customType.trim().toLowerCase();
    if (val) {
      if (!availableTypes.includes(val))
        setAvailableTypes([...availableTypes, val]);
      handleTipoToggle(val);
      setCustomType("");
    }
  };

  const addCustomCategory = () => {
    const val = customCat.trim();
    if (val) {
      if (!availableCategories.includes(val))
        setAvailableCategories([...availableCategories, val]);
      setCurrentProduct({ ...currentProduct, category: val });
      setCustomCat("");
      setShowCatMenu(false);
    }
  };

  const removeTypeGlobal = (opt) => {
    if (window.confirm(`¿Eliminar "${opt}" de la lista?`)) {
      setAvailableTypes(availableTypes.filter((t) => t !== opt));
      setCurrentProduct({
        ...currentProduct,
        tipo: currentProduct.tipo.filter((t) => t !== opt),
      });
    }
  };

  const removeCategoryGlobal = (cat) => {
    if (
      window.confirm(
        `¿Eliminar la categoría "${cat}"? Los productos con esta categoría quedarán sin asignar.`,
      )
    ) {
      setAvailableCategories(availableCategories.filter((c) => c !== cat));
      if (currentProduct.category === cat)
        setCurrentProduct({ ...currentProduct, category: "" });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      title: currentProduct.title,
      category: currentProduct.category,
      thumbnail: currentProduct.thumbnail,
      price: parseFloat(currentProduct.price) || 0,
      stock: parseInt(currentProduct.stock) || 0,
      tipo: currentProduct.tipo,
    };

    const { error } = currentProduct.id
      ? await supabase
          .from("productos")
          .update(payload)
          .eq("id", currentProduct.id)
      : await supabase.from("productos").insert([payload]);

    if (!error) {
      fetchProducts();
      resetForm();
    }
  };

  const resetForm = () => {
    setCurrentProduct({
      id: null,
      title: "",
      category: "",
      thumbnail: "",
      price: "",
      stock: 0,
      tipo: [],
    });
    setShowTypeMenu(false);
    setShowCatMenu(false);
  };

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "Todas" || p.category === selectedCategory),
  );

  return (
    <div className="product-manager-container" id="product-manager-container">
      <h1 className="Title-list">Gestión de Inventario</h1>

      <div
        className={`form-section ${currentProduct.id ? "editing-mode" : ""}`}
        ref={formRef}
      >
        {currentProduct.id && <div className="edit-badge">MODO EDICIÓN</div>}

        <form onSubmit={handleSave}>
          <div className="form-grid-layout">
            <div className="form-inputs">
              <label className="input-label-text">Nombre del Producto</label>
              <input
                className="form-input"
                value={currentProduct.title}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    title: e.target.value,
                  })
                }
                required
              />

              {/* SECCIÓN CATEGORÍA MEJORADA */}
              <div
                style={{ position: "relative", marginBottom: "15px" }}
                ref={catMenuRef}
              >
                <label className="input-label-text">Categoría</label>
                <div className="category-selector-wrapper">
                  <button
                    type="button"
                    className="btn-dropdown-toggle"
                    onClick={() => setShowCatMenu(!showCatMenu)}
                  >
                    {currentProduct.category || "Seleccionar Categoría"}{" "}
                    {showCatMenu ? "▲" : "▼"}
                  </button>
                </div>

                {showCatMenu && (
                  <div className="dropdown-menu-types">
                    <div
                      className="inline-inputs"
                      style={{ marginBottom: "10px" }}
                    >
                      <input
                        className="form-input"
                        placeholder="Nueva categoría..."
                        value={customCat}
                        onChange={(e) => setCustomCat(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), addCustomCategory())
                        }
                      />
                      <button
                        type="button"
                        className="btn-add-inline"
                        onClick={addCustomCategory}
                      >
                        +
                      </button>
                    </div>
                    <div className="scrollable-options">
                      {availableCategories.map((cat) => (
                        <div key={cat} className="dropdown-item-row">
                          <div
                            className="item-clickable"
                            onClick={() => {
                              setCurrentProduct({
                                ...currentProduct,
                                category: cat,
                              });
                              setShowCatMenu(false);
                            }}
                          >
                            <input
                              type="radio"
                              checked={currentProduct.category === cat}
                              readOnly
                            />
                            <span>{cat}</span>
                          </div>
                          <button
                            type="button"
                            className="btn-action"
                            onClick={() => removeCategoryGlobal(cat)}
                          >
                            <IconTrashSmall />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="inline-inputs">
                <div style={{ flex: 1 }}>
                  <label className="input-label-text">Precio USD</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={currentProduct.price}
                    onChange={(e) =>
                      setCurrentProduct({
                        ...currentProduct,
                        price: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="input-label-text">Stock Disponible</label>
                  <input
                    type="number"
                    className="form-input"
                    value={currentProduct.stock}
                    onChange={(e) =>
                      setCurrentProduct({
                        ...currentProduct,
                        stock: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              {/* SECCIÓN FORMAS DE VENTA */}
              <div style={{ position: "relative" }} ref={typeMenuRef}>
                <label className="input-label-text">Formas de Venta</label>
                <button
                  type="button"
                  className="btn-dropdown-toggle"
                  onClick={() => setShowTypeMenu(!showTypeMenu)}
                >
                  {showTypeMenu ? "✕ Cerrar" : "✚ Configurar Medidas"}
                </button>

                {showTypeMenu && (
                  <div className="dropdown-menu-types">
                    <div
                      className="inline-inputs"
                      style={{ marginBottom: "10px" }}
                    >
                      <input
                        className="form-input"
                        placeholder="Ej: Bolsa"
                        value={customType}
                        onChange={(e) => setCustomType(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), addCustomType())
                        }
                      />
                      <button
                        type="button"
                        className="btn-add-inline"
                        onClick={addCustomType}
                      >
                        +
                      </button>
                    </div>
                    <div className="scrollable-options">
                      {availableTypes.map((opt) => (
                        <div key={opt} className="dropdown-item-row">
                          <label className="item-clickable">
                            <input
                              type="checkbox"
                              checked={currentProduct.tipo.includes(opt)}
                              onChange={() => handleTipoToggle(opt)}
                            />
                            <span>{opt}</span>
                          </label>
                          <button
                            type="button"
                            className="btn-action"
                            onClick={() => removeTypeGlobal(opt)}
                          >
                            <IconTrashSmall />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="pills-container">
                  {currentProduct.tipo.map((t) => (
                    <span key={t} className="type-pill">
                      {t} <b onClick={() => handleTipoToggle(t)}>×</b>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-media">
              <label className="input-label-text">Vista Previa</label>
              <div className="preview-box">
                {currentProduct.thumbnail ? (
                  <img src={currentProduct.thumbnail} alt="preview" />
                ) : (
                  <span>Sin Imagen</span>
                )}
              </div>
              <label className="input-label-text">URL de Imagen</label>
              <input
                className="form-input"
                placeholder="https://..."
                value={currentProduct.thumbnail}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    thumbnail: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="form-actions-main">
            <button type="submit" className="btn-submit">
              {currentProduct.id ? "Guardar Cambios" : "Registrar Producto"}
            </button>
            {currentProduct.id && (
              <button type="button" className="btn-cancel" onClick={resetForm}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="control-bar">
        <input
          className="form-input"
          style={{ flex: 2 }}
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="form-input"
          style={{ flex: 1 }}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="Todas">Todas las Categorías</option>
          {availableCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-grid">
        {filtered.map((p) => (
          <div key={p.id} className="admin-card">
            <div className="card-img-side">
              <img
                src={p.thumbnail || "https://via.placeholder.com/100"}
                className="admin-thumb"
                alt=""
              />
              <div className={`stock-tag ${p.stock < 5 ? "low" : ""}`}>
                Stock: {p.stock}
              </div>
            </div>
            <div className="admin-info">
              <span className="badge-category">{p.category}</span>
              <strong className="admin-title">{p.title}</strong>
              <div className="price-container">
                <span className="price-usd">${Number(p.price).toFixed(2)}</span>
                <span className="price-bs">
                  {(p.price * tasaDolar).toFixed(2)} Bs
                </span>
              </div>
              <div className="pills-container mini">
                {p.tipo.map((t) => (
                  <span key={t} className="type-pill-mini">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="admin-actions">
              <button
                className="btn-action edit"
                onClick={() => {
                  setCurrentProduct({ ...p });
                  formRef.current.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <IconEdit />
              </button>
              <button
                className="btn-action delete"
                onClick={async () => {
                  if (window.confirm("¿Eliminar?")) {
                    await supabase.from("productos").delete().eq("id", p.id);
                    fetchProducts();
                  }
                }}
              >
                <IconDelete />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductManager;
