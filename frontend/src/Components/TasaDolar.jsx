import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient.js";
import "./TasaDolar.css";

function TasaDolar() {
  const [tasaDolar, setTasaDolar] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchTasa();
  }, []);

  const fetchTasa = async () => {
    try {
      const { data, error } = await supabase
        .from("configuracion")
        .select("valor_dolar")
        .eq("id", 1)
        .single();
      if (data) setTasaDolar(data.valor_dolar);
    } catch (err) {
      console.error("Error de conexión:", err);
    }
  };

  const handleUpdateTasa = async (val) => {
    const n = parseFloat(val) || 0;
    setTasaDolar(n);
    setIsSaving(true);

    await supabase.from("configuracion").update({ valor_dolar: n }).eq("id", 1);

    setTimeout(() => setIsSaving(false), 800);
  };

  return (
    <div className={`tasa-widget-container ${isSaving ? "saving" : ""}`}>
      <div className="tasa-icon-box">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </div>

      <div className="tasa-info">
        <span className="tasa-label-main">Tasa de Cambio</span>
        <span className="tasa-label-sub">USD a Bolívares</span>
      </div>

      <div className="tasa-input-wrapper">
        <input
          type="number"
          step="0.01"
          value={tasaDolar}
          onChange={(e) => handleUpdateTasa(e.target.value)}
          className="tasa-modern-input"
        />
        <span className="tasa-badge">Bs.F</span>
      </div>
    </div>
  );
}

export default TasaDolar;
