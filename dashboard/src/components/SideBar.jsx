import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ListOrdered,
  Package,
  Users,
  User,
  LogOut,
  MoveLeft,
  Pill,
  ShieldCheck,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import {
  toggleComponent,
  toggleNavbar,
} from "../store/slices/extraSlice";

import { logout } from "../store/slices/authSlice";

const SideBar = () => {
  const dispatch = useDispatch();

  const { isNavbarOpened, openedComponent } = useSelector(
    (state) => state.extra
  );

  const { isAuthenticated, user, loading } = useSelector(
    (state) => state.auth
  );

  const [activeLink, setActiveLink] = useState("Dashboard");

  useEffect(() => {
    setActiveLink(openedComponent);
  }, [openedComponent]);

  const links = [
    {
      icon: <LayoutDashboard size={20} />,
      title: "Dashboard",
    },
    {
      icon: <ListOrdered size={20} />,
      title: "Orders",
    },
    {
      icon: <Package size={20} />,
      title: "Products",
    },
    {
      icon: <Users size={20} />,
      title: "Users",
    },
    {
      icon: <User size={20} />,
      title: "Profile",
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isNavbarOpened && (
        <div
          onClick={() => dispatch(toggleNavbar())}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      <aside
        className={`
  fixed top-0 left-0 z-50
  h-screen w-[280px]
  bg-gradient-to-b from-[#F8FFFF] to-[#EEF9F7]
  border-r border-[#D8ECE8]
  flex flex-col justify-between
  transition-transform duration-300 ease-in-out
  shadow-xl

  ${isNavbarOpened ? "translate-x-0" : "-translate-x-full"}
`}
      >
        {/* TOP */}
        <div>
          {/* LOGO */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-[#DDEFED]">
            <div className="flex items-center gap-3">
              <div className="bg-[#2BB673] p-2 rounded-xl shadow-md">
                <Pill className="text-white w-5 h-5" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#134E4A]">
                  PharmaAssist
                </h2>

                <p className="text-xs text-[#6B8A86]">
                  Admin Dashboard
                </p>
              </div>
            </div>

            {/* MOBILE CLOSE */}
            <button
              onClick={() => dispatch(toggleNavbar())}
              className="lg:hidden text-[#134E4A] hover:bg-[#DFF5EE] p-2 rounded-lg transition"
            >
              <MoveLeft size={20} />
            </button>
          </div>

          {/* ADMIN INFO */}
          <div className="px-6 py-5 border-b border-[#DDEFED]">
            <div className="flex items-center gap-3">
              <img
                src={
                  user?.avatar?.url ||
                  "https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
                }
                alt="Admin"
                className="w-14 h-14 rounded-2xl object-cover border-2 border-[#B8E7D5]"
              />

              <div>
                <h3 className="font-semibold text-[#134E4A]">
                  {user?.name || "Admin"}
                </h3>

                <div className="flex items-center gap-1 text-sm text-[#2BB673] mt-1">
                  <ShieldCheck size={15} />
                  <span>Administrator</span>
                </div>
              </div>
            </div>
          </div>

          {/* NAVIGATION */}
          <nav className="flex flex-col gap-2 p-4">
            {links.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveLink(item.title);
                  dispatch(toggleComponent(item.title));

                  if (window.innerWidth < 1024) {
                    dispatch(toggleNavbar());
                  }
                }}
                className={`
                  flex items-center gap-3
                  px-4 py-3 rounded-2xl
                  text-left transition-all duration-200
                  font-medium

                  ${
                    activeLink === item.title
                      ? "bg-[#2BB673] text-white shadow-lg"
                      : "text-[#295C57] hover:bg-[#DFF5EE]"
                  }
                `}
              >
                {item.icon}
                <span>{item.title}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* BOTTOM */}
        <div className="p-4 border-t border-[#DDEFED]">
          <button
            onClick={handleLogout}
            className="
              w-full flex items-center justify-center gap-2
              bg-red-50 hover:bg-red-100
              text-red-600
              py-3 rounded-2xl
              transition-all duration-200
              font-semibold
            "
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default SideBar;