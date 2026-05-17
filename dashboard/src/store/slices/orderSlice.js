import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

// ======================================================
// FETCH ALL ORDERS
// ======================================================

export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAllOrders",

  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(
        "/order/admin/getall"
      );

      return data.orders;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch orders."
      );
    }
  }
);

// ======================================================
// UPDATE ORDER STATUS
// ======================================================

export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",

  async ({ orderId, status }, thunkAPI) => {
    try {
      const { data } = await axiosInstance.put(
        `/order/admin/update/${orderId}`,
        { status }
      );

      toast.success(
        data.message ||
          "Order status updated successfully."
      );

      return data.order;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update order status."
      );

      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to update order status."
      );
    }
  }
);

// ======================================================
// DELETE ORDER
// ======================================================

export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",

  async (orderId, thunkAPI) => {
    try {
      const { data } = await axiosInstance.delete(
        `/order/admin/delete/${orderId}`
      );

      toast.success(
        data.message ||
          "Order deleted successfully."
      );

      return orderId;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete order."
      );

      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete order."
      );
    }
  }
);

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {
  loading: false,
  orders: [],
  error: null,
  message: null,
};

// ======================================================
// SLICE
// ======================================================

const orderSlice = createSlice({
  name: "order",

  initialState,

  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },

    clearOrderMessage: (state) => {
      state.message = null;
    },
  },

  extraReducers: (builder) => {
    // ==================================================
    // FETCH ALL ORDERS
    // ==================================================

    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        fetchAllOrders.fulfilled,
        (state, action) => {
          state.loading = false;
          state.orders = action.payload;
        }
      )

      .addCase(
        fetchAllOrders.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );

    // ==================================================
    // UPDATE ORDER STATUS
    // ==================================================

    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        updateOrderStatus.fulfilled,
        (state, action) => {
          state.loading = false;

          state.orders = state.orders.map((order) =>
            order._id === action.payload._id
              ? action.payload
              : order
          );
        }
      )

      .addCase(
        updateOrderStatus.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );

    // ==================================================
    // DELETE ORDER
    // ==================================================

    builder
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        deleteOrder.fulfilled,
        (state, action) => {
          state.loading = false;

          state.orders = state.orders.filter(
            (order) => order._id !== action.payload
          );
        }
      )

      .addCase(
        deleteOrder.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const {
  clearOrderError,
  clearOrderMessage,
} = orderSlice.actions;

export default orderSlice.reducer;