import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Camera,
  KeyRound,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";

import Header from "./Header";

import defaultAvatar from "../assets/avatar.jpg";

import {
  updateProfile,
  updatePassword,
  resetAuthSlice,
} from "../store/slices/authSlice";

const Profile = () => {
  const dispatch = useDispatch();

  const { user, loading } = useSelector((state) => state.auth);

  // =========================
  // PROFILE STATE
  // =========================
  const [editData, setEditData] = useState({
    name: "",
    email: "",
  });

  // =========================
  // PASSWORD STATE
  // =========================
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // =========================
  // AVATAR
  // =========================
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar?.url || defaultAvatar
  );

  const [avatarFile, setAvatarFile] = useState(null);

  // =========================
  // LOAD USER DATA
  // =========================
  useEffect(() => {
    if (user) {
      setEditData({
        name: user?.name || "",
        email: user?.email || "",
      });

      setAvatarPreview(user?.avatar?.url || defaultAvatar);
    }
  }, [user]);

  // =========================
  // HANDLE PROFILE CHANGE
  // =========================
  const handleProfileChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // HANDLE PASSWORD CHANGE
  // =========================
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // HANDLE AVATAR CHANGE
  // =========================
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setAvatarFile(file);

      const reader = new FileReader();

      reader.onload = () => {
        setAvatarPreview(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  // =========================
  // UPDATE PROFILE
  // =========================
  const handleProfileUpdate = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", editData.name);
    formData.append("email", editData.email);

    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    dispatch(updateProfile(formData));
  };

  // =========================
  // UPDATE PASSWORD
  // =========================
  const handlePasswordUpdate = (e) => {
    e.preventDefault();

    const formData = {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
      confirmPassword: passwordData.confirmPassword,
    };

    dispatch(updatePassword(formData));

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  useEffect(() => {
    return () => {
      dispatch(resetAuthSlice());
    };
  }, [dispatch]);

  return (
    <main className="flex-1 bg-[#F8FCFC] min-h-screen overflow-y-auto">
      <Header />

      <div className="p-4 md:p-6">
        {/* PAGE TITLE */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Admin Profile
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your PharmaAssist account settings
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* LEFT PROFILE CARD */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 h-fit">

            <div className="flex flex-col items-center text-center">

              {/* AVATAR */}
              <div className="relative">
                <img
                  src={avatarPreview}
                  alt="admin-avatar"
                  className="w-32 h-32 rounded-full object-cover border-4 border-[#A6D6D6]"
                />

                <label className="absolute bottom-1 right-1 bg-[#0F766E] hover:bg-[#115E59] transition cursor-pointer p-2 rounded-full shadow-lg">
                  <Camera className="w-4 h-4 text-white" />

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>

              {/* USER INFO */}
              <h2 className="mt-4 text-xl font-bold text-gray-800">
                {user?.name || "Admin"}
              </h2>

              <p className="text-gray-500 text-sm">
                {user?.email}
              </p>

              <div className="mt-4 flex items-center gap-2 bg-[#ECFDF5] text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                <ShieldCheck className="w-4 h-4" />
                Administrator Access
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="xl:col-span-2 flex flex-col gap-6">

            {/* UPDATE PROFILE */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">

              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Update Profile
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Edit your personal information
                </p>
              </div>

              <form
                onSubmit={handleProfileUpdate}
                className="space-y-5"
              >

                {/* NAME */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Full Name
                  </label>

                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0F766E]" />

                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleProfileChange}
                      placeholder="Enter your name"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#A6D6D6]"
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0F766E]" />

                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleProfileChange}
                      placeholder="Enter your email"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#A6D6D6]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#0F766E] hover:bg-[#115E59] transition text-white font-semibold px-6 py-3 rounded-xl shadow-sm disabled:opacity-70"
                >
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </form>
            </div>

            {/* UPDATE PASSWORD */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">

              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Change Password
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Keep your PharmaAssist dashboard secure
                </p>
              </div>

              <form
                onSubmit={handlePasswordUpdate}
                className="space-y-5"
              >

                {/* CURRENT PASSWORD */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Current Password
                  </label>

                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0F766E]" />

                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Current password"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#A6D6D6]"
                    />
                  </div>
                </div>

                {/* NEW PASSWORD */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    New Password
                  </label>

                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0F766E]" />

                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="New password"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#A6D6D6]"
                    />
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Confirm Password
                  </label>

                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0F766E]" />

                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm password"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#A6D6D6]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#0F766E] hover:bg-[#115E59] transition text-white font-semibold px-6 py-3 rounded-xl shadow-sm disabled:opacity-70"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;