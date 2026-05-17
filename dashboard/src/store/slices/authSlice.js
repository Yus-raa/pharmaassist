import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

const authSlice = createSlice({
  name: "auth",

  initialState: {
    loading: false,
    user: null,
    isAuthenticated: false,
    error: null,
    message: null,
  },

  reducers: {
    // ---------------- LOGIN ----------------
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },

    loginFailed: (state, action) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.error = action.payload;
    },

    // ---------------- GET USER ----------------
    getUserRequest: (state) => {
      state.loading = true;
    },

    getUserSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },

    getUserFailed: (state, action) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.error = action.payload;
    },

    // ---------------- LOGOUT ----------------
    logoutRequest: (state) => {
      state.loading = true;
    },

    logoutSuccess: (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },

    logoutFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ---------------- FORGOT PASSWORD ----------------
    forgotPasswordRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    forgotPasswordSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },

    forgotPasswordFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ---------------- RESET PASSWORD ----------------
    resetPasswordRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    resetPasswordSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.message = "Password reset successful";
    },

    resetPasswordFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ---------------- UPDATE PASSWORD ----------------
    updatePasswordRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    updatePasswordSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },

    updatePasswordFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ---------------- UPDATE PROFILE ----------------
    updateProfileRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    updateProfileSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.message = "Profile updated successfully";
    },

    updateProfileFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ---------------- CLEAR ----------------
    clearAuthError: (state) => {
      state.error = null;
    },

    clearAuthMessage: (state) => {
      state.message = null;
    },

    resetAuthSlice: (state) => {
  state.loading = false;
  state.error = null;
  state.message = null;
},
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailed,

  getUserRequest,
  getUserSuccess,
  getUserFailed,

  logoutRequest,
  logoutSuccess,
  logoutFailed,

  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFailed,

  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailed,

  updatePasswordRequest,
  updatePasswordSuccess,
  updatePasswordFailed,

  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFailed,

  clearAuthError,
  clearAuthMessage,
  resetAuthSlice
} = authSlice.actions;

export default authSlice.reducer;


// thunks
// LOGIN (ADMIN ONLY)
export const login = (formData) => async (dispatch) => {
  try {
    dispatch(loginRequest());

    const { data } = await axiosInstance.post("/auth/login", formData);

    const user = data?.user;

    if (!user || user.role !== "admin") {
      dispatch(loginFailed("Admin access only"));
      toast.error("Admin access only");
      return;
    }

    dispatch(loginSuccess(user));
    toast.success(data.message);
  } catch (error) {
    const msg = error.response?.data?.message || "Login failed";
    dispatch(loginFailed(msg));
    toast.error(msg);
  }
};

// GET USER
export const getUser = () => async (dispatch) => {
  try {
    dispatch(getUserRequest());

    const { data } = await axiosInstance.get("/auth/me");

    const user = data?.user;

    // must be admin
    if (!user || user.role !== "admin") {
      dispatch(getUserFailed("Not authorized"));
      return;
    }

    dispatch(getUserSuccess(user));
  } catch (error) {
    dispatch(
      getUserFailed(error.response?.data?.message || "Session expired")
    );
  }
};

// LOGOUT
export const logout = () => async (dispatch) => {
  try {
    dispatch(logoutRequest());

    const { data } = await axiosInstance.get("/auth/logout");

    dispatch(logoutSuccess());
    toast.success(data.message);
  } catch (error) {
    dispatch(
      logoutFailed(
        error.response?.data?.message || "Logout failed"
      )
    );
  }
};

// FORGOT PASSWORD
export const forgotPassword =
  (email, frontendUrl) => async (dispatch) => {
    try {
      dispatch(forgotPasswordRequest());

      const { data } = await axiosInstance.post(
        `/auth/password/forgot?frontendUrl=${frontendUrl}`,
        { email }
      );

      dispatch(forgotPasswordSuccess(data.message));
      toast.success(data.message);
    } catch (error) {
      dispatch(
        forgotPasswordFailed(
          error.response?.data?.message || "Failed"
        )
      );
      toast.error(error.response?.data?.message || "Failed");
    }
  };

// RESET PASSWORD
export const resetPassword =
  (token, passwords) => async (dispatch) => {
    try {
      dispatch(resetPasswordRequest());

      const { data } = await axiosInstance.put(
        `/auth/password/reset/${token}`,
        passwords
      );

      dispatch(resetPasswordSuccess(data.user));
      toast.success(data.message);
    } catch (error) {
      dispatch(
        resetPasswordFailed(
          error.response?.data?.message || "Failed to Reset Password."
        )
      );
      toast.error(error.response?.data?.message || "Failed  to Reset Password.");
    }
  };

// UPDATE PASSWORD
export const updatePassword =
  (passwordData) => async (dispatch) => {
    try {
      dispatch(updatePasswordRequest());

      const { data } = await axiosInstance.put(
        "/auth/password/update",
        passwordData
      );

      dispatch(updatePasswordSuccess(data.message));
      toast.success(data.message);
    } catch (error) {
      dispatch(
        updatePasswordFailed(
          error.response?.data?.message || "Failed to Update Password."
        )
      );
      toast.error(error.response?.data?.message || "Failed to Update Password.");
    }
  };

// UPDATE PROFILE
export const updateProfile =
  (formData) => async (dispatch) => {
    try {
      dispatch(updateProfileRequest());

      const { data } = await axiosInstance.put(
        "/auth/profile/update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      dispatch(updateProfileSuccess(data.user));
      toast.success(data.message);
    } catch (error) {
      dispatch(
        updateProfileFailed(
          error.response?.data?.message || "Failed to Update Profile."
        )
      );
      toast.error(error.response?.data?.message || "Failed to Update Profile");
    }
  };