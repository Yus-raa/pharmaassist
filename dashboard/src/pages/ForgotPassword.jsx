import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { forgotPassword } from "../store/slices/authSlice";
import { Mail, Loader2, ShieldCheck } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();

  const { user, isAuthenticated, loading } = useSelector(
    (state) => state.auth
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      forgotPassword(
        email,
        window.location.origin
      )
    );

    setEmail("");
  };

  // ADMIN REDIRECT SAFETY
  if (isAuthenticated && user?.role === "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EAF4F4] via-white to-[#DFF6FF] px-4">

      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100">

        {/* HEADER */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <div className="bg-blue-100 p-3 rounded-full">
              <ShieldCheck className="text-blue-600 w-6 h-6" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-800">
            Forgot Password
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            PharmaAssist Admin Recovery
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-600">
              Admin Email
            </label>

            <div className="relative mt-1">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pharmaassist.com"
                className="w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending reset link...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        {/* BACK TO LOGIN */}
        <p className="text-sm text-center text-gray-500 mt-6">
          Remember password?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline"
          >
            Sign in
          </Link>
        </p>

        {/* FOOTER */}
        <p className="text-xs text-center text-gray-400 mt-4">
          Secure Healthcare System • PharmaAssist Admin
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;