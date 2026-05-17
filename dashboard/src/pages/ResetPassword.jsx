import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, Navigate } from "react-router-dom";
import { resetPassword } from "../store/slices/authSlice";
import { Lock, Loader2, ShieldCheck } from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams();
  const dispatch = useDispatch();

  const { loading, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // frontend validation
    if (formData.password.length < 8) {
      return setError("Password must be at least 8 characters");
    }

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    dispatch(resetPassword(token, formData));
  };

  // if already logged in as admin → redirect dashboard
  if (isAuthenticated && user?.role === "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EAF4F4] via-white to-[#DFF6FF] px-4">

      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100">

        {/* HEADER */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <div className="bg-purple-100 p-3 rounded-full">
              <ShieldCheck className="text-purple-600 w-6 h-6" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-800">
            Reset Password
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            PharmaAssist Admin Secure Reset
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NEW PASSWORD */}
          <div>
            <label className="text-sm text-gray-600">
              New Password
            </label>

            <div className="relative mt-1">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password"
                className="w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="text-sm text-gray-600">
              Confirm Password
            </label>

            <div className="relative mt-1">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className="w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <p className="text-sm text-red-500 bg-red-50 p-2 rounded">
              {error}
            </p>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        {/* BACK TO LOGIN */}
        <p className="text-sm text-center text-gray-500 mt-6">
          Back to{" "}
          <Link
            to="/login"
            className="text-purple-600 hover:underline"
          >
            Login
          </Link>
        </p>

        {/* FOOTER */}
        <p className="text-xs text-center text-gray-400 mt-4">
          Secure Healthcare Reset System • PharmaAssist
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;