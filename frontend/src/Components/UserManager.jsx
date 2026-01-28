import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient.js";
import "./UserManager.css";

function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, rol")
      .order("email", { ascending: true });

    if (error) {
      console.error("Error:", error.message);
    } else {
      const onlyClients = data?.filter((user) => user.rol !== "admin") || [];
      setUsers(onlyClients);
    }
    setLoading(false);
  };

  const handleResetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });

    if (error) showAlert("Error: " + error.message, "error");
    else showAlert("Correo de recuperación enviado a " + email, "success");
  };

  const handleDeleteUser = async (userId) => {
    if (
      !window.confirm(
        "¿Estás seguro de eliminar a este cliente permanentemente?",
      )
    )
      return;

    const { error } = await supabase.from("profiles").delete().eq("id", userId);

    if (error) showAlert("Error al eliminar: " + error.message, "error");
    else {
      showAlert("Cliente eliminado con éxito", "success");
      fetchUsers();
    }
  };

  const showAlert = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  const filteredUsers = users.filter((u) =>
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading)
    return <div className="loading">Cargando lista de clientes...</div>;

  return (
    <div className="user-manager-container" id="user-manager-container">
      <h1 className="Title-list">Gestión de Clientes</h1>

      {message.text && (
        <div className={`alert-box ${message.type}`}>{message.text}</div>
      )}

      <div className="control-bar">
        <input
          type="text"
          placeholder="Buscar cliente por correo..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="user-table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Acciones de Seguridad</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info-cell">
                      <div className="user-avatar">
                        {user.email?.charAt(0).toUpperCase()}
                      </div>
                      <span>{user.email}</span>
                    </div>
                  </td>
                  <td>
                    <div className="user-actions">
                      <button
                        onClick={() => handleResetPassword(user.email)}
                        className="btn-action-reset"
                      >
                        Enviar nueva clave
                      </button>

                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="btn-action-delete"
                        title="Eliminar Cliente"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="2"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                    color: "#888",
                  }}
                >
                  No hay clientes registrados para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManager;
