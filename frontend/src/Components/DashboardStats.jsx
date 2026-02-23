import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient.js";
import "./DashboardStats.css";
import TasaDolar from "./TasaDolar.jsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

function DashboardStats() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    lowStockCount: 0,
    lowStockItems: [],
    totalValueUsd: 0,
    totalValueBs: 0,
    totalExpectedProfit: 0,
    categoryDistribution: {},
    historyByDate: {},
  });
  const [loading, setLoading] = useState(true);
  const [showLowStockModal, setShowLowStockModal] = useState(false);
  const [showProfitModal, setShowProfitModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { data: configData } = await supabase
        .from("configuracion")
        .select("valor_dolar")
        .eq("id", 1)
        .single();

      const tasaActual = configData?.valor_dolar || 0;

      const { data: prodData, error } = await supabase
        .from("productos")
        .select("title, price, buy_price, stock, category, date");

      if (error) throw error;

      if (prodData) {
        const summary = prodData.reduce(
          (acc, item) => {
            acc.totalProducts += 1;
            acc.totalStock += item.stock || 0;

            if ((item.stock || 0) < 5) {
              acc.lowStockCount += 1;
              acc.lowStockItems.push(item);
            }

            const itemValueUsd = (item.price || 0) * (item.stock || 0);
            const itemCostUsd = (item.buy_price || 0) * (item.stock || 0);
            const itemProfit = itemValueUsd - itemCostUsd;

            acc.totalValueUsd += itemValueUsd;
            acc.totalExpectedProfit += itemProfit;

            const cat = item.category || "Sin categoría";
            acc.categoryDistribution[cat] =
              (acc.categoryDistribution[cat] || 0) + 1;

            const fecha = item.date || "Sin Fecha";
            if (!acc.historyByDate[fecha]) {
              acc.historyByDate[fecha] = { items: [], dailyProfit: 0 };
            }
            acc.historyByDate[fecha].items.push({
              title: item.title,
              profit: itemProfit,
              stock: item.stock,
              buy_price: item.buy_price || 0,
              price: item.price || 0,
            });
            acc.historyByDate[fecha].dailyProfit += itemProfit;

            return acc;
          },
          {
            totalProducts: 0,
            totalStock: 0,
            lowStockCount: 0,
            lowStockItems: [],
            totalValueUsd: 0,
            totalExpectedProfit: 0,
            categoryDistribution: {},
            historyByDate: {},
          },
        );

        const sortedDates = Object.keys(summary.historyByDate).sort().reverse();
        setStats({
          ...summary,
          totalValueBs: summary.totalValueUsd * tasaActual,
        });
        if (sortedDates.length > 0) setSelectedDate(sortedDates[0]);
      }
    } catch (err) {
      console.error("Error cargando estadísticas:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteHistoryByDate = async (fecha) => {
    if (
      !window.confirm(
        `¿Estás seguro de eliminar todos los registros del ${fecha}? Esta acción no se puede deshacer.`,
      )
    )
      return;

    try {
      const { error } = await supabase
        .from("productos")
        .delete()
        .eq("date", fecha);

      if (error) throw error;

      alert("Registros eliminados correctamente");
      fetchStats(); // Recargar datos
    } catch (err) {
      alert("Error al eliminar registros");
      console.error(err);
    }
  };

  const exportPDF = (fecha) => {
    const doc = new jsPDF();
    const data = stats.historyByDate[fecha];
    doc.setFontSize(18);
    doc.text(`Reporte de Ganancias - ${fecha}`, 14, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(
      `Ganancia Total Proyectada: $${data.dailyProfit.toFixed(2)}`,
      14,
      30,
    );

    const tableRows = data.items.map((item) => [
      item.title,
      item.stock,
      `$${item.buy_price.toFixed(2)}`,
      `$${item.price.toFixed(2)}`,
      `$${item.profit.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 35,
      head: [["Producto", "Stock", "Costo", "Venta", "Ganancia Total"]],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: [46, 204, 113] },
    });
    doc.save(`Reporte_Inventario_${fecha}.pdf`);
  };

  const filteredItems =
    selectedDate && stats.historyByDate[selectedDate]
      ? stats.historyByDate[selectedDate].items.filter((item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : [];

  if (loading)
    return <div className="loading-stats">Cargando datos financieros...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header-flex">
        <h2 className="Title-list">Panel de Control Financiero</h2>
        <TasaDolar />
      </div>

      <div className="stats-grid">
        {/* CAPITAL */}
        <div className="stat-card total-value">
          <div className="stat-icon-wrapper blue-bg">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3498db"
              strokeWidth="2"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="stat-content">
            <label>Capital en Stock</label>
            <div className="stat-number">
              $
              {stats.totalValueUsd.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
            <div className="stat-number-secondary">
              Bs.{" "}
              {stats.totalValueBs.toLocaleString("es-VE", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
        </div>

        {/* GANANCIAS */}
        <div
          className="stat-card profit-value clickable"
          onClick={() => setShowProfitModal(true)}
        >
          <div className="stat-icon-wrapper green-bg">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#18a560"
              strokeWidth="2"
            >
              <path d="M23 6l-9.5 9.5-5-5L1 18M17 6h6v6" />
            </svg>
          </div>
          <div className="stat-content">
            <label>Ganancia Proyectada</label>
            <div className="stat-number green-text">
              $
              {stats.totalExpectedProfit.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="stat-desc">Ver historial por fechas →</p>
          </div>
        </div>

        {/* CRÍTICOS */}
        <div
          className="stat-card low-stock clickable"
          onClick={() => setShowLowStockModal(true)}
        >
          <div className="stat-icon-wrapper red-bg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48px"
              viewBox="0 -960 960 960"
              width="48px"
              fill="none"
              stroke="#e74c3c"
              strokeWidth="4"
            >
              <path d="M450-380v-380h60v380h-60Zm0 180v-60h60v60h-60ZM223-40H100q-24 0-42-18t-18-42v-123h60v123h123v60Zm514 0v-60h123v-123h60v123q0 24-18 42t-42 18H737ZM40-737v-123q0-24 18-42t42-18h123v60H100v123H40Zm820 0v-123H737v-60h123q24 0 42 18t18 42v123h-60Z" />
            </svg>
          </div>
          <div className="stat-content">
            <label>Productos Críticos</label>
            <div className="stat-number red-text">{stats.lowStockCount}</div>
            <p className="stat-desc">Revisar stock bajo →</p>
          </div>
        </div>
      </div>

      <div className="category-panel">
        <div className="category-header">
          <div className="header-info">
            <h3>Distribución por Categoría</h3>
            <p className="variety-counter">
              Variedad: <b>{stats.totalProducts}</b> productos únicos
            </p>
          </div>
        </div>
        <div className="category-grid">
          {Object.entries(stats.categoryDistribution).map(([cat, count]) => (
            <div key={cat} className="category-badge">
              <span className="cat-text">{cat}</span>
              <span className="cat-count-pill">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL DE GANANCIAS */}
      {showProfitModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowProfitModal(false)}
        >
          <div
            className="modal-content profit-modal-wide"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Historial de Productos y Ganancias</h3>
              <button
                className="close-btn"
                onClick={() => setShowProfitModal(false)}
              >
                &times;
              </button>
            </div>

            <div className="profit-modal-body">
              <div className="date-sidebar">
                {Object.keys(stats.historyByDate)
                  .sort()
                  .reverse()
                  .map((fecha) => (
                    <div
                      key={fecha}
                      className={`date-tab-container ${selectedDate === fecha ? "active" : ""}`}
                    >
                      <button
                        className="date-tab-btn"
                        onClick={() => {
                          setSelectedDate(fecha);
                          setSearchTerm("");
                        }}
                      >
                        <span className="date-label">{fecha}</span>
                        <span className="date-profit">
                          ${stats.historyByDate[fecha].dailyProfit.toFixed(2)}
                        </span>
                      </button>
                      <button
                        className="delete-date-btn"
                        onClick={() => deleteHistoryByDate(fecha)}
                        title="Eliminar registros de esta fecha"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  ))}
              </div>

              <div className="date-detail-content">
                <div className="detail-controls">
                  <input
                    type="text"
                    placeholder="Buscar producto..."
                    className="search-input-modal"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button
                    className="export-btn"
                    onClick={() => exportPDF(selectedDate)}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{ marginRight: "8px" }}
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                    </svg>
                    Exportar PDF
                  </button>
                </div>

                <div className="table-container">
                  <table className="low-stock-table">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Stock</th>
                        <th>Costo</th>
                        <th>Venta</th>
                        <th>Gcia Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.title}</td>
                          <td>{item.stock}</td>
                          <td>${item.buy_price.toFixed(2)}</td>
                          <td>${item.price.toFixed(2)}</td>
                          <td className="green-text bold">
                            +${item.profit.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL STOCK BAJO */}
      {showLowStockModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowLowStockModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header alert">
              <h3>🚨 Reposición de Inventario</h3>
              <button
                className="close-btn"
                onClick={() => setShowLowStockModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="table-container">
              <table className="low-stock-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.lowStockItems.map((item, i) => (
                    <tr key={i}>
                      <td>{item.title}</td>
                      <td>
                        <span className="td-badge">{item.category}</span>
                      </td>
                      <td className="red-text bold">{item.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardStats;
