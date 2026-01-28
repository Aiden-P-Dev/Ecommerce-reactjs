import { useId, useState, useEffect } from "react";
import { CartIcon, ClearCartIcon } from "./Icons.jsx";
import "./Cart.css";
import { useCart } from "../hoocks/useCart.js";
import Pdf from "./Pdf.jsx";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { supabase } from "../lib/supabaseClient.js";

// Íconos auxiliares
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
      {/* Parte superior: Imagen e Información */}
      <div className="cart-item-main">
        <img src={product.thumbnail} alt={product.title} />

        <div className="cart-item-info">
          <strong>{product.title}</strong>
          <p className="cart-item-price">${product.price}</p>

          <select
            className="sale-type-select"
            value={product.tipo_venta_seleccionado || opcionesVenta[0]}
            onChange={(e) => {
              updateCartItem(product.id, {
                tipo_venta_seleccionado: e.target.value,
              });
            }}
          >
            {opcionesVenta.map((opcion, index) => (
              <option key={index} value={opcion}>
                Venta por {opcion}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Parte inferior: Ajuste de cantidad y Botón eliminar */}
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

  // Cargar tasa del dólar desde Supabase
  useEffect(() => {
    const fetchTasa = async () => {
      const { data } = await supabase
        .from("configuracion")
        .select("valor_dolar")
        .eq("id", 1)
        .single();
      if (data) setTasaDolar(data.valor_dolar);
    };
    fetchTasa();
  }, []);

  // Calcular total
  const totalUSD = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const handleSaleAndPdf = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);

    try {
      // Descontar Stock en Supabase
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

      // Simular proceso y limpiar
      setTimeout(() => {
        clearCart();
        setIsProcessing(false);
        alert("¡Venta procesada con éxito!");
      }, 2000);
    } catch (err) {
      console.error("Error en la transacción:", err);
      setIsProcessing(false);
      alert("Hubo un error al procesar la venta.");
    }
  };

  return (
    <>
      <label className="cart-button" htmlFor={cartCheckboxId}>
        <CartIcon />
        {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
      </label>
      <input id={cartCheckboxId} type="checkbox" hidden />

      <aside className="cart">
        <h2 className="cart-title">RESUMEN</h2>

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
            </div>

            <button className="btn-clear-all" onClick={clearCart}>
              <ClearCartIcon /> VACIAR CARRITO
            </button>

            <PDFDownloadLink
              document={<Pdf cart={cart} tasaDolar={tasaDolar} />}
              fileName="Comprobante_El_Caribeno.pdf"
              style={{ textDecoration: "none" }}
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
