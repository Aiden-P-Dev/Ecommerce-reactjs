import { useId } from "react";
import { CartIcon, ClearCartIcon, RemoveFromCartIcon } from "./Icons.jsx";
import "./Cart.css";
import { useCart } from "../hoocks/useCart.js";
import Pdf from "./Pdf.jsx";
import { PDFDownloadLink } from "@react-pdf/renderer";

function CartItem({ thumbnail, price, title, quantity, addToCart }) {
  return (
    <li>
      <img src={thumbnail} alt={title} />
      <div>
        <strong>{title}</strong> - ${price}
      </div>
      <footer className="foooter">
        <small>Qty: {quantity}</small>
        <button className="addtocart" onClick={addToCart}>
          +
        </button>
      </footer>
    </li>
  );
}

export function Cart() {
  const cartCheckboxId = useId();
  const { cart, clearCart, addToCart } = useCart();

  return (
    <>
      <label className="cart-button" htmlFor={cartCheckboxId}>
        <CartIcon />
      </label>
      <input id={cartCheckboxId} type="checkbox" hidden />

      <aside className="cart">
        <ul>
          {cart.map((Product) => (
            <CartItem
              key={Product.id}
              addToCart={() => addToCart(Product)}
              {...Product}
            />
          ))}
        </ul>
        <button className="cart-needed" onClick={clearCart}>
          <ClearCartIcon />
        </button>
        <div>
          <PDFDownloadLink
            document={<Pdf cart={cart} />}
            fileName="Factura.pdf"
          >
            {({ loading, url, error, blob }) =>
              loading ? (
                <button className="cart-need">loading Document...</button>
              ) : (
                <button className="cart-need">Tome su pedido</button>
              )
            }
          </PDFDownloadLink>
        </div>
      </aside>
    </>
  );
}
