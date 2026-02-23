import React from "react";

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
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

export function ProductCard({ p, tasaDolar, onEdit, onDelete }) {
  return (
    <div className="admin-card">
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
        <div className="card-header-meta">
          <span className="badge-category">{p.category}</span>
          <span className="date-label">{p.date || "S/F"}</span>
        </div>
        <strong className="admin-title">{p.title}</strong>

        <div className="finance-info-card">
          <div className="price-row">
            <span>
              Costo: <b>${Number(p.buy_price || 0).toFixed(2)}</b>
            </span>
            <span className="margin-badge">+{p.margin || 0}%</span>
          </div>
          <div className="price-container">
            <span className="price-usd">
              Venta: ${Number(p.price).toFixed(2)}
            </span>
            <span className="price-bs">
              {(p.price * tasaDolar).toFixed(2)} Bs
            </span>
          </div>
        </div>

        <div className="pills-container mini">
          {p.tipo &&
            p.tipo.map((t) => (
              <span key={t} className="type-pill-mini">
                {t}
              </span>
            ))}
        </div>
      </div>
      <div className="admin-actions">
        <button className="btn-action edit" onClick={() => onEdit(p)}>
          <IconEdit />
        </button>
        <button className="btn-action delete" onClick={() => onDelete(p)}>
          <IconDelete />
        </button>
      </div>
    </div>
  );
}
