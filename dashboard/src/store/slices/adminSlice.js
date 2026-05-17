import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

const initialState = {
  loading: false,

  // users
  users: [],
  totalUsers: 0,
  currentPage: 1,
  totalPages: 1,

  // dashboard stats
  totalRevenue: 0,
  todayRevenue: 0,
  yesterdayRevenue: 0,
  totalUsersCount: 0,
  monthlySales: [],
  orderStatusCounts: {},
  topSellingProducts: [],
  lowStockProducts: [],
  revenueGrowth: "0%",
  newUsersThisMonth: 0,
  currentMonthSales: 0,

  error: null,
  message: null,
};

export const adminSlice = createSlice({
  name: "admin",
  initialState,

  reducers: {
    // ================= USERS =================
    getAllUsersRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    getAllUsersSuccess: (state, action) => {
      state.loading = false;

      state.users = action.payload.users;
      state.totalUsers = action.payload.totalUsers;
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
    },

    getAllUsersFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ================= DELETE USER =================
    deleteUserRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    deleteUserSuccess: (state, action) => {
      state.loading = false;

      state.users = state.users.filter(
        (user) => user._id !== action.payload
      );

      state.totalUsers = Math.max(0, state.totalUsers - 1);

      state.message = "User deleted successfully";
    },

    deleteUserFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ================= DASHBOARD STATS =================
    getDashboardStatsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    getDashboardStatsSuccess: (state, action) => {
      state.loading = false;

      state.totalRevenue = action.payload.totalRevenue;
      state.todayRevenue = action.payload.todayRevenue;
      state.yesterdayRevenue = action.payload.yesterdayRevenue;

      state.totalUsersCount = action.payload.totalUsers;

      state.monthlySales = action.payload.monthlySales || [];

      state.orderStatusCounts =
        action.payload.orderStatusCounts || {};

      state.topSellingProducts =
        action.payload.topProducts || [];

      state.lowStockProducts =
        action.payload.lowStockProducts || [];

      state.currentMonthSales =
        action.payload.currentMonthSales;

      state.revenueGrowth = action.payload.growth;

      state.newUsersThisMonth =
        action.payload.newUsers;
    },

    getDashboardStatsFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ================= CLEAR =================
    clearAdminError: (state) => {
      state.error = null;
    },

    clearAdminMessage: (state) => {
      state.message = null;
    },
  },
});

// ================= EXPORT ACTIONS =================

export const {
  getAllUsersRequest,
  getAllUsersSuccess,
  getAllUsersFailed,

  deleteUserRequest,
  deleteUserSuccess,
  deleteUserFailed,

  getDashboardStatsRequest,
  getDashboardStatsSuccess,
  getDashboardStatsFailed,

  clearAdminError,
  clearAdminMessage,
} = adminSlice.actions;

// ======================================================
// FETCH ALL USERS
// ======================================================

export const fetchAllUsers =
  (page = 1) =>
  async (dispatch) => {
    try {
      dispatch(getAllUsersRequest());

      const { data } = await axiosInstance.get(
        `/admin/getallusers?page=${page}`
      );

      dispatch(getAllUsersSuccess(data));
    } catch (error) {
      dispatch(
        getAllUsersFailed(
          error.response?.data?.message ||
            "Failed to fetch users"
        )
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch users"
      );
    }
  };

// ======================================================
// DELETE USER
// ======================================================

export const deleteUser =
  (id, page = 1) =>
  async (dispatch, getState) => {
    try {
      dispatch(deleteUserRequest());

      const { data } = await axiosInstance.delete(
        `/admin/delete/${id}`
      );

      dispatch(deleteUserSuccess(id));

      toast.success(
        data.message || "User deleted successfully"
      );

      // refetch users after delete
      const updatedTotal =
        getState().admin.totalUsers - 1;

      const updatedPages =
        Math.ceil(updatedTotal / 10) || 1;

      const validPage = Math.min(
        page,
        updatedPages
      );

      dispatch(fetchAllUsers(validPage));
    } catch (error) {
      dispatch(
        deleteUserFailed(
          error.response?.data?.message ||
            "Failed to delete user"
        )
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to delete user"
      );
    }
  };

// ======================================================
// FETCH DASHBOARD STATS
// ======================================================

export const fetchDashboardStats =
  () => async (dispatch) => {
    try {
      dispatch(getDashboardStatsRequest());

      const { data } = await axiosInstance.get(
        "/admin/fetch/dashboard-stats"
      );

      dispatch(getDashboardStatsSuccess(data));
    } catch (error) {
      dispatch(
        getDashboardStatsFailed(
          error.response?.data?.message ||
            "Failed to fetch dashboard stats"
        )
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch dashboard stats"
      );
    }
  };

export default adminSlice.reducer;