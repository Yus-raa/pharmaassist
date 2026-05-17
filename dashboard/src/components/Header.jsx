import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Menu } from "lucide-react";

import avatar from "../assets/avatar.jpg";

import { toggleNavbar } from "../store/slices/extraSlice";

const Header = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const { openedComponent } = useSelector(
    (state) => state.extra
  );

  return (
    <header className="w-full bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between shadow-sm">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => dispatch(toggleNavbar())}
          className=" bg-[#EAF4F4] hover:bg-[#d8efef] p-2 rounded-lg transition"
        >
          <Menu className="w-5 h-5 text-[#0F766E]" />
        </button>

        {/* PAGE TITLE */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            {openedComponent}
          </h1>

          <p className="text-sm text-gray-500">
            PharmaAssist Admin Dashboard
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3">

        {/* USER INFO */}
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-sm font-semibold text-gray-700">
            {user?.name || "Admin"}
          </span>

          <span className="text-xs text-green-600 font-medium">
            Administrator
          </span>
        </div>

        {/* AVATAR */}
        <img
          src={user?.avatar?.url || avatar}
          alt="admin-avatar"
          className="w-11 h-11 rounded-full object-cover border-2 border-[#A6D6D6] shadow-sm"
        />
      </div>
    </header>
  );
};

export default Header;