import {
  X,
  Home,
  Package,
  Info,
  HelpCircle,
  ShoppingCart,
  List,
  Phone,
  Pill,
  HeartPulse,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { toggleSidebar } from "../../store/slices/popupSlice";

const Sidebar = () => {

  const dispatch = useDispatch();

  const location = useLocation();

  const { authUser } = useSelector(
    (state) => state.auth
  );

  const { isSidebarOpen } = useSelector(
    (state) => state.popup
  );

  if (!isSidebarOpen) return null;


  // MENU ITEMS
  const menuItems = [
    {
      name: "Home",
      icon: Home,
      path: "/",
    },

    {
      name: "Medicines",
      icon: Pill,
      path: "/products",
    },

    {
      name: "Health Categories",
      icon: HeartPulse,
      path: "/categories",
    },

    {
      name: "About",
      icon: Info,
      path: "/about",
    },

    {
      name: "FAQ",
      icon: HelpCircle,
      path: "/faq",
    },

    {
      name: "Contact",
      icon: Phone,
      path: "/contact",
    },

    {
      name: "Cart",
      icon: ShoppingCart,
      path: "/cart",
    },

    authUser && {
      name: "My Orders",
      icon: List,
      path: "/orders",
    },
  ];


  return (
    <>
      {/* OVERLAY */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={() => dispatch(toggleSidebar())}
      />

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 h-screen w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-2xl z-50 animate-in slide-in-from-left duration-300 flex flex-col overflow-hidden">

  {/* HEADER */}
  <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">

    <div className="flex items-center gap-2">
      <Pill className="text-green-600" />

      <h2 className="text-xl font-bold text-green-600">
        PharmaAssist
      </h2>
    </div>

    <button
      onClick={() => dispatch(toggleSidebar())}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
    >
      <X className="w-5 h-5" />
    </button>
  </div>

  {/* NAVIGATION */}
  <nav className="flex-1 overflow-y-auto p-4">

    <ul className="space-y-2">

      {menuItems.filter(Boolean).map((item) => {

        const isActive =
          location.pathname === item.path;

        return (
          <li key={item.name}>

            <Link
              to={item.path}
              onClick={() =>
                dispatch(toggleSidebar())
              }

              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group

              ${
                isActive
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-foreground"
              }
            `}
            >

              <item.icon
                className={`w-5 h-5

                ${
                  isActive
                    ? "text-green-600"
                    : "text-gray-500 group-hover:text-green-600"
                }
              `}
              />

              <span className="font-medium">
                {item.name}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  </nav>

  {/* FOOTER */}
  <div className="p-5 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">

    <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4">

      <h3 className="font-semibold text-green-700 dark:text-green-400 mb-1">
        Your Health Partner
      </h3>

      <p className="text-sm text-muted-foreground leading-relaxed">
        Manage medicines, orders, and health support easily with PharmaAssist.
      </p>
    </div>
  </div>
</aside>
    </>
  );
};

export default Sidebar;