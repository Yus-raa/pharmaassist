import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import { axiosInstance } from "../../lib/axios";

import { toast } from "react-toastify";

// FETCH MY ORDERS
export const fetchMyOrders =
  createAsyncThunk(
    "order/fetchMyOrders",

    async (
      _,
      { rejectWithValue }
    ) => {
      try {

        const { data } =
          await axiosInstance.get(
            "/order/orders/me"
          );

        return data.myOrders;

      } catch (error) {

        const message =
          error.response?.data
            ?.message ||
          "Failed to fetch orders";

        toast.error(message);

        return rejectWithValue(
          message
        );
      }
    }
  );

// FETCH SINGLE ORDER
export const fetchSingleOrder =
  createAsyncThunk(
    "order/fetchSingleOrder",

    async (
      id,
      { rejectWithValue }
    ) => {
      try {

        const { data } =
          await axiosInstance.get(
            `/order/${id}`
          );

        return data.order;

      } catch (error) {

        const message =
          error.response?.data
            ?.message ||
          "Failed to fetch order";

        toast.error(message);

        return rejectWithValue(
          message
        );
      }
    }
  );

// PLACE ORDER
export const placeOrder =
  createAsyncThunk(
    "order/placeOrder",

    async (
      orderData,
      { rejectWithValue }
    ) => {
      try {

        const { data } =
          await axiosInstance.post(
            "/order/new",
            orderData
          );

        toast.success(
          data.message
        );

        return data;

      } catch (error) {

        const message =
          error.response?.data
            ?.message ||
          "Failed to place order";

        toast.error(message);

        return rejectWithValue(
          message
        );
      }
    }
  );

// MARK ORDER AS PAID
export const markOrderAsPaid =
  createAsyncThunk(
    "order/markOrderAsPaid",

    async (
      { orderId, payment_id },
      { rejectWithValue }
    ) => {
      try {

        const { data } =
          await axiosInstance.put(
            `/order/payment-success/${orderId}`,
            { payment_id }
          );

        toast.success(
          data.message
        );

        return data.order;

      } catch (error) {

        const message =
          error.response?.data
            ?.message ||
          "Payment verification failed";

        toast.error(message);

        return rejectWithValue(
          message
        );
      }
    }
  );

const initialState = {
  myOrders: [],
  singleOrder: null,

  loading: false,
  placingOrder: false,
  paymentLoading: false,

  error: null,

  // CHECKOUT FLOW
  orderStep: 1,

  // PAYMENT
  clientSecret: "",
  orderId: "",
  finalPrice: 0,
};

const orderSlice = createSlice({
  name: "order",

  initialState,

  reducers: {

    // SET CHECKOUT STEP
    setOrderStep: (
      state,
      action
    ) => {
      state.orderStep =
        action.payload;
    },

    // RESET CHECKOUT
    resetOrderState: (
      state
    ) => {
      state.orderStep = 1;

      state.clientSecret =
        "";

      state.orderId = "";

      state.finalPrice = 0;

      state.error = null;
    },
  },

  extraReducers: (
    builder
  ) => {

    // =========================
    // FETCH MY ORDERS
    // =========================
    builder
      .addCase(
        fetchMyOrders.pending,
        (state) => {
          state.loading = true;

          state.error = null;
        }
      )

      .addCase(
        fetchMyOrders.fulfilled,
        (
          state,
          action
        ) => {
          state.loading = false;

          state.myOrders =
            action.payload;
        }
      )

      .addCase(
        fetchMyOrders.rejected,
        (
          state,
          action
        ) => {
          state.loading = false;

          state.error =
            action.payload;
        }
      );

    // =========================
    // FETCH SINGLE ORDER
    // =========================
    builder
      .addCase(
        fetchSingleOrder.pending,
        (state) => {
          state.loading = true;

          state.error = null;
        }
      )

      .addCase(
        fetchSingleOrder.fulfilled,
        (
          state,
          action
        ) => {
          state.loading = false;

          state.singleOrder =
            action.payload;
        }
      )

      .addCase(
        fetchSingleOrder.rejected,
        (
          state,
          action
        ) => {
          state.loading = false;

          state.error =
            action.payload;
        }
      );

    // =========================
    // PLACE ORDER
    // =========================
    builder
      .addCase(
        placeOrder.pending,
        (state) => {
          state.placingOrder =
            true;

          state.error = null;
        }
      )

      .addCase(
        placeOrder.fulfilled,
        (
          state,
          action
        ) => {
          state.placingOrder =
            false;

          state.clientSecret =
            action.payload.clientSecret;

          state.orderId =
            action.payload.orderId;

          state.finalPrice =
            action.payload.total_price;

          state.orderStep = 2;
        }
      )

      .addCase(
        placeOrder.rejected,
        (
          state,
          action
        ) => {
          state.placingOrder =
            false;

          state.error =
            action.payload;
        }
      );

    // =========================
    // MARK ORDER AS PAID
    // =========================
    builder
      .addCase(
        markOrderAsPaid.pending,
        (state) => {
          state.paymentLoading =
            true;

          state.error = null;
        }
      )

      .addCase(
        markOrderAsPaid.fulfilled,
        (
          state,
          action
        ) => {
          state.paymentLoading =
            false;

          // UPDATE ORDER IN MY ORDERS
          state.myOrders =
            state.myOrders.map(
              (order) =>
                order._id ===
                action.payload._id
                  ? action.payload
                  : order
            );

          // UPDATE SINGLE ORDER
          if (
            state.singleOrder
              ?._id ===
            action.payload._id
          ) {
            state.singleOrder =
              action.payload;
          }

          // RESET CHECKOUT FLOW
          state.clientSecret =
            "";

          state.orderId = "";

          state.finalPrice = 0;

          state.orderStep = 1;
        }
      )

      .addCase(
        markOrderAsPaid.rejected,
        (
          state,
          action
        ) => {
          state.paymentLoading =
            false;

          state.error =
            action.payload;
        }
      );
  },
});

export const {
  setOrderStep,
  resetOrderState,
} = orderSlice.actions;

export default orderSlice.reducer;