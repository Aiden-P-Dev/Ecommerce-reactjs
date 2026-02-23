import React, { useEffect } from "react";

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

export function ProductForm({
  currentProduct,
  setCurrentProduct,
  handleSave,
  resetForm,
  availableCategories,
  availableTypes,
  showCatMenu,
  setShowCatMenu,
  showTypeMenu,
  setShowTypeMenu,
  customCat,
  setCustomCat,
  customType,
  setCustomType,
  addCustomCategory,
  addCustomType,
  removeCategoryGlobal,
  removeTypeGlobal,
  handleTipoToggle,
  stockToAdd,
  setStockToAdd,
  formRef,
  catMenuRef,
  typeMenuRef,
}) {
  // Lógica de cálculo financiero
  const calculateMargin = (buy, sell) => {
    if (!buy || !sell || buy === 0) return 0;
    return (((sell - buy) / buy) * 100).toFixed(2);
  };

  const updateFinance = (field, value) => {
    let newData = { ...currentProduct, [field]: value };

    if (field === "buy_price" || field === "price") {
      newData.margin = calculateMargin(newData.buy_price, newData.price);
    } else if (field === "margin") {
      const marginFact = 1 + parseFloat(value) / 100;
      newData.price = (newData.buy_price * marginFact).toFixed(2);
    }
    setCurrentProduct(newData);
  };

  return (
    <div
      className={`form-section ${currentProduct.id ? "editing-mode" : ""}`}
      ref={formRef}
    >
      {currentProduct.id && <div className="edit-badge">MODO EDICIÓN</div>}
      <form onSubmit={handleSave}>
        <div className="form-grid-layout">
          <div className="form-inputs">
            <div className="inline-inputs">
              <div style={{ flex: 2 }}>
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
              </div>
              <div style={{ flex: 1 }}>
                <label className="input-label-text">Fecha</label>
                <input
                  type="date"
                  className="form-input"
                  value={currentProduct.date || ""}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      date: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div
              style={{ position: "relative", marginBottom: "15px" }}
              ref={catMenuRef}
            >
              <label className="input-label-text">Categoría</label>
              <button
                type="button"
                className="btn-dropdown-toggle"
                onClick={() => setShowCatMenu(!showCatMenu)}
              >
                {currentProduct.category || "Seleccionar Categoría"}{" "}
                {showCatMenu ? "▲" : "▼"}
              </button>
              {showCatMenu && (
                <div className="dropdown-menu-types">
                  <div
                    className="inline-inputs"
                    style={{ marginBottom: "10px" }}
                  >
                    <input
                      className="form-input"
                      placeholder="Nueva..."
                      value={customCat}
                      onChange={(e) => setCustomCat(e.target.value)}
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

            <div className="inline-inputs finance-grid">
              <div>
                <label className="input-label-text">Costo (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={currentProduct.buy_price || ""}
                  onChange={(e) => updateFinance("buy_price", e.target.value)}
                />
              </div>
              <div>
                <label className="input-label-text">Venta (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={currentProduct.price || ""}
                  onChange={(e) => updateFinance("price", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="input-label-text">Ganancia %</label>
                <input
                  type="number"
                  className="form-input"
                  value={currentProduct.margin || ""}
                  onChange={(e) => updateFinance("margin", e.target.value)}
                />
              </div>
            </div>

            <div className="inline-inputs">
              <div style={{ flex: 1 }}>
                <label className="input-label-text">Stock Actual</label>
                <div style={{ display: "flex", gap: "5px" }}>
                  <input
                    className="form-input"
                    value={currentProduct.stock}
                    readOnly
                  />
                  <button
                    type="button"
                    className="btn-action"
                    title="Ajuste Manual"
                    onClick={() => {
                      const newVal = prompt(
                        "Ingrese el stock exacto:",
                        currentProduct.stock,
                      );
                      if (newVal !== null)
                        setCurrentProduct({
                          ...currentProduct,
                          stock: parseInt(newVal) || 0,
                        });
                    }}
                  >
                    ⚙️
                  </button>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <label
                  className="input-label-text"
                  style={{ color: "#18a560", fontWeight: "bold" }}
                >
                  Sumar al Stock
                </label>
                <input
                  type="number"
                  className="form-input"
                  style={{ borderColor: "#18a560" }}
                  value={stockToAdd}
                  onChange={(e) => setStockToAdd(e.target.value)}
                  placeholder="Ej: 10"
                />
              </div>
            </div>

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
                      value={customType}
                      onChange={(e) => setCustomType(e.target.value)}
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
  );
}
