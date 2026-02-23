import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import "./UserProfile.css";

export function UserProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || "",
        username:
          user.user_metadata?.username || user.user_metadata?.full_name || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const updates = {
        data: {
          username: formData.username,
          full_name: formData.username,
        },
      };

      if (formData.email !== user.email) {
        updates.email = formData.email;
      }

      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error("Las contraseñas no coinciden");
        }
        if (formData.newPassword.length < 6) {
          throw new Error("La contraseña debe tener al menos 6 caracteres");
        }
        updates.password = formData.newPassword;
      }

      const { data, error } = await supabase.auth.updateUser(updates);

      if (error) throw error;

      setMessage({
        type: "success",
        text: "¡Perfil actualizado con éxito!",
      });

      setFormData((prev) => ({
        ...prev,
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-layout">
        <div className="profile-header">
          <h2 className="profile-title">MI PERFIL</h2>
          <Link to="/" className="btn-back">
            VOLVER AL MENÚ
          </Link>
        </div>

        <form onSubmit={handleUpdateProfile} className="profile-grid-form">
          {/* PANEL IZQUIERDO: INFORMACIÓN */}
          <div className="panel info-panel">
            <div className="section-header">
              <span className="label">DATOS PERSONALES</span>
            </div>

            <div className="input-container">
              <label className="label">NOMBRE COMPLETO</label>
              <input
                className="input-field"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-container">
              <label className="label">CORREO ELECTRÓNICO</label>
              <input
                className="input-field"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {message.text && (
              <div
                className={
                  message.type === "success" ? "message-success" : "text-danger"
                }
              >
                {message.text}
              </div>
            )}
          </div>

          {/* PANEL DERECHO: SEGURIDAD */}
          <div className="panel security-panel">
            <div className="section-header">
              <span className="label security-tag">SEGURIDAD</span>
              <p className="small-text">
                Deja en blanco para no cambiar la contraseña
              </p>
            </div>

            <div className="input-container">
              <label className="label">NUEVA CONTRASEÑA</label>
              <input
                className="input-field"
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>

            <div className="input-container">
              <label className="label">CONFIRMAR CONTRASEÑA</label>
              <input
                className="input-field"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "PROCESANDO..." : "GUARDAR CAMBIOS"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
