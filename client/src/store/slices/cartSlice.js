import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: JSON.parse(localStorage.getItem("cart")) || [],
};

const saveCartToLocalStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    // ADD TO CART
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;

      const existingItem = state.cart.find(
        (item) => item._id === product._id
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cart.push({
          ...product,
          quantity,
        });
      }

      saveCartToLocalStorage(state.cart);
    },

    // REMOVE FROM CART
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(
        (item) => item._id !== action.payload
      );

      saveCartToLocalStorage(state.cart);
    },

    // UPDATE QUANTITY
    updateCartQuantity: (state, action) => {
      const { id, quantity } = action.payload;

      const item = state.cart.find(
        (item) => item._id === id
      );

      if (item) {
        item.quantity = quantity;
      }

      saveCartToLocalStorage(state.cart);
    },

    // CLEAR CART
    clearCart: (state) => {
      state.cart = [];

      saveCartToLocalStorage([]);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;