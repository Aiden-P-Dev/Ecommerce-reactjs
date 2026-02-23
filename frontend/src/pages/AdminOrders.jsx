import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient.js";
import "./AdminOrders.css";

export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar pedidos desde Supabase
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("pedidos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data);
    } catch (error) {
      console.error("Error cargando pedidos:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Cambiar estado del pedido
  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from("pedidos")
      .update({ estado: newStatus })
      .eq("id", id);

    if (!error) {
      setOrders(
        orders.map((o) => (o.id === id ? { ...o, estado: newStatus } : o)),
      );
    }
  };

  // Eliminar pedido
  const deleteOrder = async (id) => {
    if (!confirm("¿Seguro que quieres eliminar este pedido?")) return;

    const { error } = await supabase.from("pedidos").delete().eq("id", id);

    if (!error) {
      setOrders(orders.filter((o) => o.id !== id));
    }
  };

  if (loading) return <div className="loader">Cargando pedidos...</div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Gestión de Pedidos</h1>
        <button onClick={fetchOrders} className="btn-refresh">
          Actualizar
        </button>
      </div>

      {orders.length === 0 ? (
        <p>No hay pedidos registrados aún.</p>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order.id} className={`order-card ${order.estado}`}>
              <div className="order-info">
                <span className="order-date">
                  {new Date(order.created_at).toLocaleString()}
                </span>
                <h3>Cliente: {order.cliente_nombre}</h3>
                <span className={`badge ${order.estado}`}>
                  {order.estado.toUpperCase()}
                </span>
              </div>

              <div className="order-items">
                <h4>Productos:</h4>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.quantity}x {item.title} -
                      <small>
                        {" "}
                        ({item.tipo_venta_seleccionado || "unidad"})
                      </small>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="order-totals">
                <p>
                  Total: <strong>${order.total_usd.toFixed(2)}</strong>
                </p>
                <p>
                  Tasa: <small>{order.tasa_dolar} Bs.</small>
                </p>
              </div>

              <div className="order-actions">
                <select
                  value={order.estado}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="procesado">Procesado</option>
                  <option value="entregado">Entregado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
                <button
                  onClick={() => deleteOrder(order.id)}
                  className="btn-delete"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
