import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

import { toggleAuthPopup } from "./popupSlice";
import { act } from "react";


// ================= REGISTER =================
export const register = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post(
        "/auth/register",
        data
      );

      toast.success("Account created successfully");

      thunkAPI.dispatch(toggleAuthPopup());

      return res.data.user;

    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Something went wrong, please try again later.";

      toast.error(message);

      return thunkAPI.rejectWithValue(
        message
      );
    }
  }
);


// ================= LOGIN =================
export const login = createAsyncThunk(
  "auth/login",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post(
        "/auth/login",
        data
      );

      toast.success("Login successful");

      thunkAPI.dispatch(toggleAuthPopup());

      return res.data.user;

    } catch (error) {
      const message =
  error.response?.data?.message ||
  "Something went wrong, please try again later.";

toast.error(message);

      return thunkAPI.rejectWithValue(
        message
      );
    }
  }
);


// ================= GET USER =================
export const getUser = createAsyncThunk(
  "auth/getUser",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get(
        "/auth/me"
      );

      return res.data.user;

    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data
      );
    }
  }
);


// ================= LOGOUT =================
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await axiosInstance.post(
        "/auth/logout"
      );

      toast.success("Logged out");

      return null;

    } catch (error) {
      toast.error("Logout failed");

      return thunkAPI.rejectWithValue(
        error.response?.data
      );
    }
  }
);


// ================= FORGOT PASSWORD =================
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, thunkAPI) => {
    try {
      const res = await axiosInstance.post(
        "/auth/password/forgot",
        { email }
      );

      toast.success(res.data.message);

      return res.data;

    } catch (error) {
      const message =
  error.response?.data?.message ||
  "Something went wrong, please try again.";

toast.error(message);

      return thunkAPI.rejectWithValue(
        message
      );
    }
  }
);


// ================= RESET PASSWORD =================
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    { token, password },
    thunkAPI
  ) => {
    try {
      const res = await axiosInstance.put(
        `/auth/password/reset/${token}`,
        { password }
      );

      toast.success("Password reset successful");

      thunkAPI.dispatch(toggleAuthPopup());

      return res.data;

    } catch (error) {
      const message =
  error.response?.data?.message ||
  "Something went wrong, please try again.";

toast.error(message);

      return thunkAPI.rejectWithValue(
        message
      );
    }
  }
);


// ================= UPDATE PASSWORD =================
export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.put(
        "/auth/password/update",
        data
      );

      toast.success("Password updated");

      return res.data;

    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Something went wrong, please try again later.";

      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);


// ================= UPDATE PROFILE =================
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.put(
        "/auth/profile/update",
        data
      );

      toast.success("Profile updated");

      return res.data.user;

    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Something went wrong, please try again later.";

      return thunkAPI.rejectWithValue(
        message
      );
    }
  }
);


// ================= SLICE =================
const authSlice = createSlice({
  name: "auth",

  initialState: {
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isUpdatingPassword: false,
    isRequestingForToken: false,
    isCheckingAuth: true,
  },

  reducers: {},

  extraReducers: (builder) => {

  // ================= REGISTER =================
  builder
    .addCase(register.pending, (state) => {
      state.isSigningUp = true;
    })

    .addCase(register.fulfilled, (state, action) => {
      state.isSigningUp = false;
      state.authUser = action.payload;
    })

    .addCase(register.rejected, (state) => {
      state.isSigningUp = false;
    });


  // ================= LOGIN =================
  builder
    .addCase(login.pending, (state) => {
      state.isLoggingIn = true;
    })

    .addCase(login.fulfilled, (state, action) => {
      state.isLoggingIn = false;
      state.authUser = action.payload;
    })

    .addCase(login.rejected, (state) => {
      state.isLoggingIn = false;
    });


  // ================= GET USER =================
  builder
    .addCase(getUser.pending, (state) => {
      state.isCheckingAuth = true;
    })

    .addCase(getUser.fulfilled, (state, action) => {
      state.isCheckingAuth = false;
      state.authUser = action.payload;
    })

    .addCase(getUser.rejected, (state) => {
      state.isCheckingAuth = false;
      state.authUser = null;
    });


  // ================= LOGOUT =================
  builder
    .addCase(logout.fulfilled, (state) => {
      state.authUser = null;
    });


  // ================= UPDATE PROFILE =================
  builder
    .addCase(updateProfile.pending, (state) => {
      state.isUpdatingProfile = true;
    })

    .addCase(updateProfile.fulfilled, (state, action) => {
      state.isUpdatingProfile = false;
      state.authUser = action.payload;
    })

    .addCase(updateProfile.rejected, (state) => {
      state.isUpdatingProfile = false;
    });

  // ================= RESET PASSWORD =================
  builder
    .addCase(resetPassword.pending, (state) => {
      state.isUpdatingPassword = true;
    })

    .addCase(resetPassword.fulfilled, (state) => {
      state.isUpdatingPassword = false;
      // state.authUser = action.payload;
    })

    .addCase(resetPassword.rejected, (state) => {
      state.isUpdatingPassword = false;
    });


  // ================= UPDATE PASSWORD =================
  builder
    .addCase(updatePassword.pending, (state) => {
      state.isUpdatingPassword = true;
    })

    .addCase(updatePassword.fulfilled, (state) => {
      state.isUpdatingPassword = false;
    })

    .addCase(updatePassword.rejected, (state) => {
      state.isUpdatingPassword = false;
    });


  // ================= FORGOT PASSWORD =================
  builder
    .addCase(forgotPassword.pending, (state) => {
      state.isRequestingForToken = true;
    })

    .addCase(forgotPassword.fulfilled, (state) => {
      state.isRequestingForToken = false;
    })

    .addCase(forgotPassword.rejected, (state) => {
      state.isRequestingForToken = false;
    });

}
});

export default authSlice.reducer;