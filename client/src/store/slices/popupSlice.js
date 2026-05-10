import { createSlice } from "@reduxjs/toolkit";

const popupSlice = createSlice({
  name: "popup",

  initialState: {
    isAuthPopupOpen: false,
    isSidebarOpen: false,
    isSearchBarOpen: false,
    isCartOpen: false,
    isAIPopupOpen: false,
  },

  reducers: {

    // AUTH POPUP
    toggleAuthPopup: (state) => {
      state.isAuthPopupOpen =
        !state.isAuthPopupOpen;
    },

    // SIDEBAR
    toggleSidebar: (state) => {
      state.isSidebarOpen =
        !state.isSidebarOpen;
    },

    // SEARCH BAR
    toggleSearchBar: (state) => {
      state.isSearchBarOpen =
        !state.isSearchBarOpen;
    },

    // CART
    toggleCart: (state) => {
      state.isCartOpen =
        !state.isCartOpen;
    },

    // AI MODAL
    toggleAIModal: (state) => {
      state.isAIPopupOpen =
        !state.isAIPopupOpen;
    },

    // OPTIONAL CLOSE ALL
    closeAllPopups: (state) => {
      state.isAuthPopupOpen = false;
      state.isSidebarOpen = false;
      state.isSearchBarOpen = false;
      state.isCartOpen = false;
      state.isAIPopupOpen = false;
    },
  },
});

export const {
  toggleAuthPopup,
  toggleSidebar,
  toggleSearchBar,
  toggleCart,
  toggleAIModal,
  closeAllPopups,
} = popupSlice.actions;

export default popupSlice.reducer;