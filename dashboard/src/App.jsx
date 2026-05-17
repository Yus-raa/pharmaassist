import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import SideBar from "./components/SideBar";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Dashboard from "./components/Dashboard";
import Orders from "./components/Orders";
import Users from "./components/Users";
import Profile from "./components/Profile";
import Products from "./components/Products";

import { ToastContainer } from "react-toastify";
import { getUser } from "./store/slices/authSlice";

function App() {
  const dispatch = useDispatch();

  const { openedComponent } = useSelector((state) => state.extra);
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  // 🔥 AUTO LOGIN RESTORE ON REFRESH
  useEffect(() => {
    if (!user) {
      dispatch(getUser());
    }
  }, [dispatch, user]);

  const renderDashboardContent = () => {
  switch (openedComponent) {
    case "Dashboard":
      return <Dashboard />;

    case "Orders":
      return <Orders />;

    case "Users":
      return <Users />;

    case "Profile":
      return <Profile />;

    case "Products":
      return <Products />;

    default:
      return <Dashboard />;
  }
};

if (loading && !user) {
  return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading PharmaAssist...</p>
    </div>
  );
}

  return (
    <Router>
      <Routes>
        {/* AUTH ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />

        {/* PROTECTED ADMIN ROUTE */}
        <Route
  path="/"
  element={
    !loading && isAuthenticated && user?.role === "admin" ? (
      <div className="flex min-h-screen">
        <SideBar />
        {renderDashboardContent()}
      </div>
    ) : (
      <Navigate to="/login" replace />
    )
  }
/>
      </Routes>

      <ToastContainer theme="dark" />
    </Router>
  );
}

export default App;