import { useEffect, useState } from "react";
import {
  X,
  LogOut,
  Upload,
  User,
  Lock,
} from "lucide-react";
import defaultAvatar from "../../assets/default-avatar.png";
import { useDispatch, useSelector } from "react-redux";

import {
  logout,
  updateProfile,
  updatePassword,
} from "../../store/slices/authSlice";

import { toggleProfilePanel } from "../../store/slices/popupSlice";

const ProfilePanel = () => {
  const dispatch = useDispatch();

  const { isProfilePanelOpen } = useSelector(
    (state) => state.popup
  );
  const { isUpdatingProfile } = useSelector((state) => state.auth);

  const { authUser } = useSelector(
    (state) => state.auth
  );

  const [tab, setTab] = useState("profile");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);

  const [preview, setPreview] = useState(
  authUser?.avatar?.url || defaultAvatar
);

  const [currentPassword, setCurrentPassword] =
    useState("");
  const [newPassword, setNewPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  useEffect(() => {
    if (authUser) {
      setName(authUser.name || "");
      setEmail(authUser.email || "");
      setPreview(
      authUser?.avatar?.url || defaultAvatar
    );
    }
  }, [authUser]);

  useEffect(() => {
    if (avatar) {
      setPreview(URL.createObjectURL(avatar));
    }
  }, [avatar]);

  if (!isProfilePanelOpen || !authUser)
    return null;

  const handleUpdateProfile = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);

    if (avatar) {
      formData.append("avatar", avatar);
    }

    dispatch(updateProfile(formData));
  };

  const handleUpdatePassword = () => {
    dispatch(
      updatePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      })
    );

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <>
      {/* OVERLAY */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={() =>
          dispatch(toggleProfilePanel())
        }
      />

      {/* PANEL */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[420px] z-50 bg-white dark:bg-gray-950 shadow-2xl flex flex-col animate-slide-in-right">

        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-bold text-green-600 flex items-center gap-2">
            <User size={20} />
            My Profile
          </h2>

          <button
            onClick={() =>
              dispatch(toggleProfilePanel())
            }
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* TABS */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setTab("profile")}
            className={`flex-1 py-3 text-sm font-medium ${
              tab === "profile"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500"
            }`}
          >
            Profile
          </button>

          <button
            onClick={() => setTab("security")}
            className={`flex-1 py-3 text-sm font-medium ${
              tab === "security"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500"
            }`}
          >
            Security
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">

          {/* PROFILE TAB */}
          {tab === "profile" && (
            <>
              {/* AVATAR */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden ">
                  <img
                    src={preview || defaultAvatar}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-2 border-green-500"
                    onError={(e) => {
                      e.target.src = defaultAvatar;
                    }}
                  />
                </div>

                <label className="mt-3 flex items-center gap-2 text-sm text-green-600 cursor-pointer">
                  <Upload size={16} />
                  Change Avatar
                  <input
                    type="file"
                    hidden
                    onChange={(e) =>
                      setAvatar(
                        e.target.files[0]
                      )
                    }
                  />
                </label>
              </div>

              {/* FORM */}
              <div className="space-y-3">

                <input
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="w-full p-3 rounded-xl border border-border bg-background"
                  placeholder="Full Name"
                />

                <input
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full p-3 rounded-xl border border-border bg-background"
                  placeholder="Email"
                />

                <button
  onClick={handleUpdateProfile}
  disabled={isUpdatingProfile}
  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
>
  {isUpdatingProfile ? (
    <>
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      Updating...
    </>
  ) : (
    "Update Profile"
  )}
</button>
              </div>
            </>
          )}

          {/* SECURITY TAB */}
          {tab === "security" && (
            <div className="space-y-3">

              <input
                type="password"
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(
                    e.target.value
                  )
                }
                className="w-full p-3 rounded-xl border border-border"
                placeholder="Current Password"
              />

              <input
                type="password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
                className="w-full p-3 rounded-xl border border-border"
                placeholder="New Password"
              />

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                className="w-full p-3 rounded-xl border border-border"
                placeholder="Confirm Password"
              />

              <button
                onClick={handleUpdatePassword}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl transition flex items-center justify-center gap-2"
              >
                <Lock size={16} />
                Update Password
              </button>
            </div>
          )}
        </div>

        {/* LOGOUT */}
        <div className="p-5 border-t border-border">
          <button
            onClick={() => dispatch(logout())}
            className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 py-3 rounded-xl transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfilePanel;