import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import "./index.css";

import App from "./App.jsx";
import { store } from "./store/store.js";

import { getUser } from "./store/slices/authSlice"; 

// Auto load admin session
store.dispatch(getUser());

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);