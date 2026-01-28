export const cartInitialState =
  JSON.parse(window.localStorage.getItem("cart")) || [];

export const CART_ACTION_TYPES = {
  ADD_TO_CART: "ADD_TO_CART",
  REMOVE_FROM_CART: "REMOVE_FROM_CART",
  CLEAR_CART: "CLEAR_CART",
  UPDATE_CART_ITEM: "UPDATE_CART_ITEM",
};

const updateLocalStorage = (state) => {
  window.localStorage.setItem("cart", JSON.stringify(state));
};

const UPDATE_STATE_BY_ACTION = {
  [CART_ACTION_TYPES.ADD_TO_CART]: (state, action) => {
    const { id, tipo } = action.payload;
    const productInCartIndex = state.findIndex((item) => item.id === id);

    if (productInCartIndex >= 0) {
      const newState = structuredClone(state);
      newState[productInCartIndex].quantity += 1;
      updateLocalStorage(newState);
      return newState;
    }

    let opciones = ["unidad"];
    if (Array.isArray(tipo)) {
      opciones = tipo;
    } else if (typeof tipo === "string" && tipo.length > 0) {
      opciones = tipo.split(",").map((s) => s.trim());
    }

    const newState = [
      ...state,
      {
        ...action.payload,
        quantity: 1,
        tipo_venta_seleccionado: opciones[0],
      },
    ];

    updateLocalStorage(newState);
    return newState;
  },

  [CART_ACTION_TYPES.UPDATE_CART_ITEM]: (state, action) => {
    const { id, updates } = action.payload;
    const newState = state.map((item) => {
      if (item.id === id) return { ...item, ...updates };
      return item;
    });
    updateLocalStorage(newState);
    return newState;
  },

  [CART_ACTION_TYPES.REMOVE_FROM_CART]: (state, action) => {
    const { id } = action.payload;
    const itemIndex = state.findIndex((i) => i.id === id);
    if (itemIndex < 0) return state;

    const newState = structuredClone(state);
    if (newState[itemIndex].quantity > 1) {
      newState[itemIndex].quantity -= 1;
    } else {
      newState.splice(itemIndex, 1);
    }
    updateLocalStorage(newState);
    return newState;
  },

  [CART_ACTION_TYPES.CLEAR_CART]: () => {
    updateLocalStorage([]);
    return [];
  },
};

export const cartReducer = (state, action) => {
  const { type: actionType } = action;
  const updateState = UPDATE_STATE_BY_ACTION[actionType];
  return updateState ? updateState(state, action) : state;
};
