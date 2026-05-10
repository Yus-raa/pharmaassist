import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    cart: [],
  },

  reducers: {

    // ADD ITEM TO CART
    addToCart: (state, action) => {
      const item = action.payload;

      const existingItem = state.cart.find(
        (i) => i._id === item._id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cart.push({
          ...item,
          quantity: 1,
        });
      }
    },

    // REMOVE ITEM
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(
        (item) => item._id !== action.payload
      );
    },

    // INCREASE QUANTITY
    increaseQty: (state, action) => {
      const item = state.cart.find(
        (i) => i._id === action.payload
      );

      if (item) {
        item.quantity += 1;
      }
    },

    // DECREASE QUANTITY
    decreaseQty: (state, action) => {
      const item = state.cart.find(
        (i) => i._id === action.payload
      );

      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },

    // CLEAR CART
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;