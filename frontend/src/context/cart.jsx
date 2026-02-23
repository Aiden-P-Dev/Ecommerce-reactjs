import { createContext, useReducer } from "react";
import {
  cartReducer,
  cartInitialState,
  CART_ACTION_TYPES,
} from "../reducers/cart.js";

export const CartContext = createContext();

function useCartReducer() {
  const [state, dispatch] = useReducer(cartReducer, cartInitialState);

  const addToCart = (product) =>
    dispatch({
      type: CART_ACTION_TYPES.ADD_TO_CART,
      payload: product,
    });

  const removeFromCart = (product) =>
    dispatch({
      type: CART_ACTION_TYPES.REMOVE_FROM_CART,
      payload: product,
    });

  const updateCartItem = (id, updates) =>
    dispatch({
      type: CART_ACTION_TYPES.UPDATE_CART_ITEM,
      payload: { id, updates },
    });

  // NUEVA FUNCIÓN: Envía la orden al reducer para eliminar por completo
  const removeItemCompletely = (product) =>
    dispatch({
      type: CART_ACTION_TYPES.REMOVE_ITEM_COMPLETELY,
      payload: product,
    });

  const clearCart = () => dispatch({ type: CART_ACTION_TYPES.CLEAR_CART });

  return {
    state,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    removeItemCompletely, // <-- Retornamos la nueva función
  };
}

export function CartProvider({ children }) {
  const {
    state,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    removeItemCompletely,
  } = useCartReducer();

  return (
    <CartContext.Provider
      value={{
        cart: state,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        removeItemCompletely, // <-- LA EXPORTAMOS AL CONTEXTO
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
