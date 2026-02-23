import { useId, useState, useEffect } from "react";
import { CartIcon, ClearCartIcon } from "./Icons.jsx";
import "./Cart.css";
import { useCart } from "../hoocks/useCart.js";
import Pdf from "./Pdf.jsx";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { supabase } from "../lib/supabaseClient.js";

const RemoveIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
  </svg>
);

function CartItem({
  product,
  addToCart,
  removeFromCart,
  updateCartItem,
  removeItemCompletely,
}) {
  const opcionesVenta = Array.isArray(product.tipo)
    ? product.tipo
    : product.tipo
      ? product.tipo.split(",").map((s) => s.trim())
      : ["unidad"];

  return (
    <li className="cart-item">
      <div className="cart-item-main">
        <img src={product.thumbnail} alt={product.title} />
        <div className="cart-item-info">
          <strong>{product.title}</strong>
          <p className="cart-item-price">${product.price}</p>
          <select
            className="sale-type-select"
            value={product.tipo_venta_seleccionado || opcionesVenta[0]}
            onChange={(e) =>
              updateCartItem(product.id, {
                tipo_venta_seleccionado: e.target.value,
              })
            }
          >
            {opcionesVenta.map((opcion, index) => (
              <option key={index} value={opcion}>
                Venta por {opcion}
              </option>
            ))}
          </select>
        </div>
      </div>
      <footer className="cart-item-footer">
        <div className="cart-item-actions">
          <button
            className="qty-btn"
            type="button"
            onClick={() => removeFromCart(product)}
          >
            -
          </button>
          <span className="qty-number">{product.quantity}</span>
          <button
            className="qty-btn"
            type="button"
            onClick={() => addToCart(product)}
          >
            +
          </button>
        </div>
        {/* CORRECCIÓN: Aseguramos que pase el objeto producto completo o el ID según pida tu hook */}
        <button
          className="btn-remove-full"
          type="button"
          onClick={() => removeItemCompletely(product)}
        >
          <RemoveIcon /> ELIMINAR PRODUCTO
        </button>
      </footer>
    </li>
  );
}

export function Cart() {
  const cartCheckboxId = useId();
  const {
    cart,
    clearCart,
    addToCart,
    removeFromCart,
    updateCartItem,
    removeItemCompletely,
  } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);
  const [tasaDolar, setTasaDolar] = useState(0);
  const [userName, setUserName] = useState("Cliente");

  const formatName = (text) => {
    if (!text) return "Vendedor";
    let clean = text.includes("@") ? text.split("@")[0] : text;
    clean = clean.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[._-]/g, " ");
    return clean
      .trim()
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  };

  useEffect(() => {
    const fetchSessionData = async () => {
      // Obtener Tasa
      const { data: config } = await supabase
        .from("configuracion")
        .select("valor_dolar")
        .eq("id", 1)
        .single();
      if (config) setTasaDolar(config.valor_dolar);

      // Obtener Usuario
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();

        const rawName =
          profile?.username || user.user_metadata?.full_name || user.email;
        setUserName(formatName(rawName));
      }
    };
    fetchSessionData();
  }, []);

  const totalUSD = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const handleSaleAndPdf = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);

    try {
      // 1. REGISTRAR EL PEDIDO PARA EL ADMINISTRADOR
      const { error: orderError } = await supabase.from("pedidos").insert([
        {
          cliente_nombre: userName,
          items: cart,
          total_usd: totalUSD,
          tasa_dolar: tasaDolar,
          estado: "pendiente",
        },
      ]);

      if (orderError) throw orderError;

      // 2. ACTUALIZAR STOCK EN PRODUCTOS
      for (const item of cart) {
        const { data: p } = await supabase
          .from("productos")
          .select("stock")
          .eq("id", item.id)
          .single();

        const nuevoStock = (p?.stock || 0) - item.quantity;

        await supabase
          .from("productos")
          .update({ stock: nuevoStock })
          .eq("id", item.id);
      }

      // Finalizar proceso con éxito
      setTimeout(() => {
        clearCart();
        setIsProcessing(false);
        alert("¡Venta registrada y procesada con éxito!");
      }, 1000);
    } catch (err) {
      console.error("Error procesando pedido:", err);
      alert("Hubo un error al registrar el pedido.");
      setIsProcessing(false);
    }
  };

  return (
    <>
      <label className="cart-button" htmlFor={cartCheckboxId}>
        <CartIcon />
        {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
      </label>
      <input
        id={cartCheckboxId}
        type="checkbox"
        hidden
        className="cart-input-check"
      />
      <label className="cart-overlay" htmlFor={cartCheckboxId}></label>
      <aside className="cart">
        <div className="cart-header">
          <h2 className="cart-title">RESUMEN</h2>
          <label className="close-aside" htmlFor={cartCheckboxId}>
            ✕
          </label>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart-container">
            <p>El carrito está vacío</p>
          </div>
        ) : (
          <ul className="cart-list">
            {cart.map((item) => (
              <CartItem
                key={item.id}
                product={item}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                updateCartItem={updateCartItem}
                removeItemCompletely={removeItemCompletely}
              />
            ))}
          </ul>
        )}

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total-display">
              <p>Total a Pagar:</p>
              <h3>${totalUSD.toFixed(2)}</h3>
              <small>({(totalUSD * tasaDolar).toLocaleString()} Bs.)</small>
              <p
                style={{
                  fontSize: "11px",
                  marginTop: "10px",
                  color: "#333",
                  fontWeight: "bold",
                }}
              >
                Orden de: {userName}
              </p>
            </div>

            <button className="btn-clear-all" onClick={clearCart}>
              <ClearCartIcon /> VACIAR CARRITO
            </button>

            <PDFDownloadLink
              document={
                <Pdf cart={cart} tasaDolar={tasaDolar} userName={userName} />
              }
              fileName={`Comprobante_${userName.replace(/\s+/g, "_")}.pdf`}
            >
              {({ loading }) => (
                <button
                  className="btn-checkout"
                  onClick={handleSaleAndPdf}
                  disabled={loading || isProcessing}
                >
                  {isProcessing
                    ? "PROCESANDO..."
                    : loading
                      ? "CARGANDO..."
                      : "GENERAR COMPRA"}
                </button>
              )}
            </PDFDownloadLink>
          </div>
        )}
      </aside>
    </>
  );
}
