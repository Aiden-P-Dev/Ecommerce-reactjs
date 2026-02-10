import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient.js";

const IconEntry = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 -960 960 960"
    fill="#27ae60"
    style={{ marginRight: "10px", verticalAlign: "middle" }}
  >
    <path d="M440-160v-326L336-382l-56-58 200-200 200 200-56 58-104-104v326h-80ZM160-600v-120q0-33 23.5-56.5T240-800h480q33 0 56.5 23.5T800-720v120h-80v-120H240v120h-80Z" />
  </svg>
);

function InventoryEntry({ onUpdate }) {
  const [dbProducts, setDbProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Cargar productos al inicio
  useEffect(() => {
    fetchProducts();

    // 2. CONFIGURACIÓN DE TIEMPO REAL
    // Escucha cualquier cambio (INSERT, UPDATE, DELETE) en la tabla 'productos'
    const channel = supabase
      .channel("cambios-inventario")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "productos" },
        (payload) => {
          console.log("Cambio detectado en tiempo real:", payload);
          fetchProducts(); // Recarga la lista local automáticamente
          if (onUpdate) onUpdate(); // Avisa a componentes padres si es necesario
        },
      )
      .subscribe();

    // Limpiar la suscripción cuando el componente se desmonte
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("productos")
      .select("id, title, stock")
      .order("title", { ascending: true });

    if (data) setDbProducts(data);
    if (error) console.error("Error cargando productos:", error);
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    if (!selectedProductId || !quantity) return;

    setIsSubmitting(true);
    const product = dbProducts.find((p) => p.id == selectedProductId);

    if (product) {
      const nuevoStock = (parseInt(product.stock) || 0) + parseInt(quantity);

      // Actualización optimista local para que se vea el cambio ANTES de que responda el server
      setDbProducts((prev) =>
        prev.map((p) =>
          p.id == selectedProductId ? { ...p, stock: nuevoStock } : p,
        ),
      );

      const { error } = await supabase
        .from("productos")
        .update({ stock: nuevoStock })
        .eq("id", selectedProductId);

      if (!error) {
        // Limpiamos campos pero NO llamamos a fetchProducts() aquí
        // porque el useEffect con Realtime ya lo hará por nosotros.
        setSearchTerm("");
        setSelectedProductId("");
        setQuantity("");
      } else {
        alert("Error al actualizar: " + error.message);
        fetchProducts(); // Revertir en caso de error
      }
    }
    setIsSubmitting(false);
  };

  const filteredOptions = dbProducts.filter((p) =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const styles = {
    container: {
      padding: "20px",
      width: "100%",
      boxSizing: "border-box",
    },
    flexRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: "20px",
      marginTop: "15px",
    },
    column: {
      flex: "1",
      minWidth: "250px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    button: {
      marginTop: "10px",
      height: "48px",
      cursor: selectedProductId ? "pointer" : "not-allowed",
      backgroundColor: selectedProductId ? "#fff" : "#ccc",
      color: "#000",
      border: "2px solid #000",
      boxShadow: selectedProductId ? "4px 4px 0px #000" : "none",
      fontWeight: "800",
      fontSize: "1rem",
      borderRadius: "5px",
      transition: "all 0.2s",
    },
  };

  return (
    <div className="form-section" style={styles.container}>
      <h2
        className="Title-list"
        style={{
          fontSize: "1.4rem",
          display: "flex",
          alignItems: "center",
          margin: 0,
        }}
      >
        <IconEntry /> Entrada Rápida de Inventario
      </h2>

      <form onSubmit={handleAddStock}>
        <div style={styles.flexRow}>
          <div style={styles.column}>
            <label className="input-label-text">1. Buscar Producto</label>
            <input
              type="text"
              placeholder="Escribe para filtrar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ width: "100%", boxSizing: "border-box" }}
            />

            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="form-input"
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                border: selectedProductId
                  ? "2px solid #27ae60"
                  : "1px solid #ccc",
              }}
            >
              <option value="">-- Selecciona producto --</option>
              {filteredOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} (Stock: {p.stock})
                </option>
              ))}
            </select>
          </div>

          <div style={styles.column}>
            <label className="input-label-text">2. Cantidad a Sumar</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="form-input"
              placeholder="0"
              required
              min="1"
              style={{ width: "100%", boxSizing: "border-box" }}
            />

            <button
              type="submit"
              disabled={isSubmitting || !selectedProductId}
              style={styles.button}
              onMouseEnter={(e) => {
                if (selectedProductId) {
                  e.target.style.backgroundColor = "#000";
                  e.target.style.color = "#fff";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedProductId) {
                  e.target.style.backgroundColor = "#fff";
                  e.target.style.color = "#000";
                }
              }}
            >
              {isSubmitting ? "Guardando..." : "Actualizar Stock"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default InventoryEntry;
