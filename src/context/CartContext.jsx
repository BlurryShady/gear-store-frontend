import { createContext, useContext, useReducer } from "react";

const CartContext = createContext(null);

function parsePrice(p) {
  if (p == null) return 0;
  if (typeof p === "number") return p;
  // Remove anything that's not digit, dot or minus (e.g. $ or commas)
  const cleaned = String(p).replace(/[^0-9.-]+/g, "");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function toInt(n, fallback = 0) {
  const v = Number(n);
  return Number.isFinite(v) ? Math.floor(v) : fallback;
}

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product } = action.payload;
      // coerce qty to integer (default 1)
      const quantity = Math.max(1, toInt(action.payload.quantity, 1));

      const existing = state.items.find((item) => item.product.id === product.id);

      // If product already in cart → increase quantity
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }

      // Otherwise add new cart item
      return {
        ...state,
        items: [...state.items, { product, quantity }],
      };
    }

    case "REMOVE_ITEM": {
      const id = action.payload.id;
      return {
        ...state,
        items: state.items.filter((item) => item.product.id !== id),
      };
    }

    case "CHANGE_QUANTITY": {
      const { id } = action.payload;
      const delta = toInt(action.payload.delta, 0);

      return {
        ...state,
        items: state.items
          .map((item) =>
            item.product.id === id
              ? { ...item, quantity: Math.max(1, item.quantity + delta) }
              : item
          ),
        // If you ever want to allow going to 0 → you could filter here
      };
    }

    case "CLEAR_CART":
      return { ...state, items: [] };

    default:
      return state;
  }
}

const initialState = {
  items: [],
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const totalCount = state.items.reduce((sum, item) => sum + toInt(item.quantity, 0), 0);

  const totalPrice = state.items.reduce((sum, item) => {
    const price = parsePrice(item.product?.price);
    const qty = toInt(item.quantity, 0);
    return sum + price * qty;
  }, 0);

  const value = {
    items: state.items,
    totalCount,
    totalPrice,
    dispatch,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
}
