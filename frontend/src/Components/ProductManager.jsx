import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabaseClient.js";
import { ProductForm } from "./ProductForm.jsx";
import { ProductCard } from "./ProductCard.jsx";
import "./ProductManager.css";

function ProductManager() {
  const [products, setProducts] = useState([]);
  const [tasaDolar, setTasaDolar] = useState(1);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [showCatMenu, setShowCatMenu] = useState(false);
  const [customType, setCustomType] = useState("");
  const [customCat, setCustomCat] = useState("");
  const [stockToAdd, setStockToAdd] = useState(0);

  const formRef = useRef(null);
  const typeMenuRef = useRef(null);
  const catMenuRef = useRef(null);

  const opcionesBase = ["unidad", "litro", "docena", "gramo", "kg", "caja"];
  const [availableTypes, setAvailableTypes] = useState(opcionesBase);
  const [availableCategories, setAvailableCategories] = useState([]);

  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    title: "",
    category: "",
    thumbnail: "",
    buy_price: "",
    price: "",
    margin: "",
    stock: 0,
    tipo: [],
    date: new Date().toISOString().split("T")[0], // Fecha de hoy por defecto
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

  const handleSave = async (e) => {
    e.preventDefault();
    const finalStock =
      (parseInt(currentProduct.stock) || 0) + (parseInt(stockToAdd) || 0);

    const payload = {
      title: currentProduct.title,
      category: currentProduct.category,
      thumbnail: currentProduct.thumbnail,
      buy_price: parseFloat(currentProduct.buy_price) || 0,
      price: parseFloat(currentProduct.price) || 0,
      margin: parseFloat(currentProduct.margin) || 0,
      stock: finalStock,
      tipo: currentProduct.tipo,
      date: currentProduct.date,
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
    } else {
      alert("Error al guardar");
    }
  };

  const resetForm = () => {
    setCurrentProduct({
      id: null,
      title: "",
      category: "",
      thumbnail: "",
      buy_price: "",
      price: "",
      margin: "",
      stock: 0,
      tipo: [],
      date: new Date().toISOString().split("T")[0],
    });
    setStockToAdd(0);
    setShowTypeMenu(false);
    setShowCatMenu(false);
  };

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "Todas" || p.category === selectedCategory),
  );

  return (
    <div className="product-manager-container">
      <h1 className="Title-list">Gestión de Inventario</h1>
      <ProductForm
        currentProduct={currentProduct}
        setCurrentProduct={setCurrentProduct}
        handleSave={handleSave}
        resetForm={resetForm}
        availableCategories={availableCategories}
        availableTypes={availableTypes}
        showCatMenu={showCatMenu}
        setShowCatMenu={setShowCatMenu}
        showTypeMenu={showTypeMenu}
        setShowTypeMenu={setShowTypeMenu}
        customCat={customCat}
        setCustomCat={setCustomCat}
        customType={customType}
        setCustomType={setCustomType}
        addCustomCategory={() => {
          const val = customCat.trim();
          if (val && !availableCategories.includes(val))
            setAvailableCategories([...availableCategories, val]);
          setCurrentProduct({ ...currentProduct, category: val });
          setCustomCat("");
          setShowCatMenu(false);
        }}
        addCustomType={() => {
          const val = customType.trim().toLowerCase();
          if (val) {
            if (!availableTypes.includes(val))
              setAvailableTypes([...availableTypes, val]);
            handleTipoToggle(val);
            setCustomType("");
          }
        }}
        removeCategoryGlobal={(cat) => {
          if (window.confirm(`¿Eliminar "${cat}"?`))
            setAvailableCategories(
              availableCategories.filter((c) => c !== cat),
            );
        }}
        removeTypeGlobal={(opt) => {
          if (window.confirm(`¿Eliminar "${opt}"?`))
            setAvailableTypes(availableTypes.filter((t) => t !== opt));
        }}
        handleTipoToggle={handleTipoToggle}
        stockToAdd={stockToAdd}
        setStockToAdd={setStockToAdd}
        formRef={formRef}
        catMenuRef={catMenuRef}
        typeMenuRef={typeMenuRef}
      />

      <div className="control-bar">
        <input
          className="form-input"
          style={{ flex: 2 }}
          placeholder="Buscar..."
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
          <ProductCard
            key={p.id}
            p={p}
            tasaDolar={tasaDolar}
            onEdit={(prod) => {
              setCurrentProduct({ ...prod });
              setStockToAdd(0);
              formRef.current.scrollIntoView({ behavior: "smooth" });
            }}
            onDelete={async (prod) => {
              if (window.confirm("¿Eliminar?")) {
                await supabase.from("productos").delete().eq("id", prod.id);
                fetchProducts();
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductManager;
