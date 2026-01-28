import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient.js";
import "./DashboardStats.css";
import TasaDolar from "./TasaDolar.jsx";

function DashboardStats() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    lowStockCount: 0,
    lowStockItems: [],
    totalValueUsd: 0,
    totalValueBs: 0,
    categoryDistribution: {},
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

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
        .select("title, price, stock, category");

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
            acc.totalValueUsd += itemValueUsd;

            const cat = item.category || "Sin categoría";
            acc.categoryDistribution[cat] =
              (acc.categoryDistribution[cat] || 0) + 1;

            return acc;
          },
          {
            totalProducts: 0,
            totalStock: 0,
            lowStockCount: 0,
            lowStockItems: [],
            totalValueUsd: 0,
            categoryDistribution: {},
          },
        );

        setStats({
          ...summary,
          totalValueBs: summary.totalValueUsd * tasaActual,
        });
      }
    } catch (err) {
      console.error("Error cargando estadísticas:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="loading-stats">Analizando inventario...</div>;

  return (
    <div className="dashboard-container" id="dashboard-container">
      <h2 className="Title-list">Resumen de Negocio</h2>

      <div className="stats-grid">
        <div className="stat-card total-value">
          <div className="stat-icon-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="32px"
              viewBox="0 -960 960 960"
              width="32px"
              fill="#2ecc71"
            >
              <path d="M441-120v-86q-53-12-91.5-46T293-332l74-30q15 35 44 58.5t70 23.5q40 0 65.5-19t25.5-51q0-31-21-50.5T461-454q-75-24-111-62t-36-96q0-58 37.5-98.5T441-754v-86h80v86q48 12 79 41.5t45 74.5l-72 32q-13-28-34-44.5T488-702q-35 0-56 17t-21 43q0 25 18 41t80 35q74 25 107.5 61.5T650-349q0 70-43 113t-86 43v83h-80Z" />
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

        <div className="stat-card total-items">
          <div className="stat-icon-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="32px"
              viewBox="0 -960 960 960"
              width="32px"
              fill="#3498db"
            >
              <path d="m480-120-271-151q-15-8-23-22.5t-8-29.5v-314q0-15 8-29.5t23-22.5l271-151q15-8 30-8t30 8l271 151q15 8 23 22.5t8 29.5v314q0 15-8 29.5T751-271L480-120Zm0-362 216-121-216-121-216 121 216 121ZM240-543v205l180 100v-205L240-543Zm300 305 180-100v-205L540-443v205Z" />
            </svg>
          </div>
          <div className="stat-content">
            <label>Variedad</label>
            <div className="stat-number">{stats.totalProducts}</div>
            <p className="stat-desc">Productos únicos</p>
          </div>
        </div>

        <div
          className="stat-card low-stock clickable"
          onClick={() => setShowModal(true)}
        >
          <div className="stat-icon-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="32px"
              viewBox="0 -960 960 960"
              width="32px"
              fill="#e74c3c"
            >
              <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
            </svg>
          </div>
          <div className="stat-content">
            <label>Críticos</label>
            <div className="stat-number">{stats.lowStockCount}</div>
            <p className="stat-desc">Ver detalle de faltantes →</p>
          </div>
        </div>
      </div>

      <div className="secondary-stats-layout">
        <div className="category-panel">
          <div className="category-header">
            <h3>Distribución por Categoría</h3>
            <TasaDolar />
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
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Productos con Bajo Stock</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <div className="table-container">
              <table className="low-stock-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Stock Actual</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.lowStockItems.length > 0 ? (
                    stats.lowStockItems.map((item, i) => (
                      <tr key={i}>
                        <td>{item.title}</td>
                        <td>
                          <span className="td-badge">{item.category}</span>
                        </td>
                        <td className="td-stock">{item.stock}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3">No hay productos críticos</td>
                    </tr>
                  )}
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
