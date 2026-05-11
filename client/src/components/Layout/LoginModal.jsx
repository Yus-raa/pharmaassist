import { useState, useEffect } from "react";
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import {
  login,
  register,
  forgotPassword,
  resetPassword,
} from "../../store/slices/authSlice";

import { toggleAuthPopup } from "../../store/slices/popupSlice";

const LoginModal = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const {
    authUser,
    isSigningUp,
    isLoggingIn,
    isRequestingForToken,
  } = useSelector((state) => state.auth);

  const { isAuthPopupOpen } = useSelector(
    (state) => state.popup
  );

  const [mode, setMode] = useState("signin");

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // RESET PASSWORD URL DETECTION
  useEffect(() => {
    if (
      location.pathname.startsWith("/password/reset")
    ) {
      setMode("reset");

      if (!isAuthPopupOpen) {
        dispatch(toggleAuthPopup());
      }
    }
  }, [location.pathname, dispatch]);

  // CLOSE MODAL AFTER LOGIN
  useEffect(() => {
    if (authUser && isAuthPopupOpen) {
      dispatch(toggleAuthPopup());

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [authUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // SIGNUP
    if (mode === "signup") {
      await dispatch(
        register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        })
      );

      return;
    }

    // LOGIN
    if (mode === "signin") {
      await dispatch(
        login({
          email: formData.email,
          password: formData.password,
        })
      );

      return;
    }

    // FORGOT PASSWORD
    if (mode === "forgot") {
      await dispatch(
        forgotPassword({
          email: formData.email,
        })
      );

      setMode("signin");

      return;
    }

    // RESET PASSWORD
    if (mode === "reset") {
      const token =
        location.pathname.split("/").pop();

      await dispatch(
        resetPassword({
          token,
          password: formData.password,
          confirmPassword:
            formData.confirmPassword,
        })
      );

      return;
    }
  };

  if (!isAuthPopupOpen || authUser) return null;

  const isLoading =
    isSigningUp ||
    isLoggingIn ||
    isRequestingForToken;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

      {/* MODAL */}
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-fade-in-up">

        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-green-600">
              {mode === "signin"
                ? "Welcome Back"
                : mode === "signup"
                ? "Create Account"
                : mode === "forgot"
                ? "Forgot Password"
                : "Reset Password"}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              PharmaAssist Secure Portal
            </p>
          </div>

          <button
            onClick={() =>
              dispatch(toggleAuthPopup())
            }
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5"
        >

          {/* NAME */}
          {mode === "signup" && (
            <div className="relative">
              <User
                className="absolute left-4 top-3.5 text-gray-400"
                size={18}
              />

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}

          {/* EMAIL */}
          {mode !== "reset" && (
            <div className="relative">
              <Mail
                className="absolute left-4 top-3.5 text-gray-400"
                size={18}
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}

          {/* PASSWORD */}
          {mode !== "forgot" && (
            <div className="relative">
              <Lock
                className="absolute left-4 top-3.5 text-gray-400"
                size={18}
              />

              <input
                type={
                  showPassword ? "text" : "password"
                }
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent py-3 pl-11 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-3"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          )}

          {/* CONFIRM PASSWORD */}
          {mode === "reset" && (
            <div className="relative">
              <Lock
                className="absolute left-4 top-3.5 text-gray-400"
                size={18}
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}

          {/* FORGOT PASSWORD */}
          {mode === "signin" && (
            <button
              type="button"
              onClick={() => setMode("forgot")}
              className="text-sm text-green-600 hover:underline"
            >
              Forgot Password?
            </button>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold py-3 transition disabled:opacity-70"
          >
            {isLoading
              ? "Processing..."
              : mode === "signin"
              ? "Sign In"
              : mode === "signup"
              ? "Create Account"
              : mode === "forgot"
              ? "Send Reset Email"
              : "Reset Password"}
          </button>
        </form>

        {/* FOOTER */}
        {(mode === "signin" ||
          mode === "signup") && (
          <div className="pb-6 text-center text-sm">

            {mode === "signin" ? (
              <>
                Don’t have an account?{" "}
                <button
                  onClick={() =>
                    setMode("signup")
                  }
                  className="text-green-600 font-medium hover:underline"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() =>
                    setMode("signin")
                  }
                  className="text-green-600 font-medium hover:underline"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;