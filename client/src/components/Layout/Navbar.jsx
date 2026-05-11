import {
  Menu,
  User,
  ShoppingCart,
  Sun,
  Moon,
  Search,
  Pill,
} from "lucide-react";

import { useTheme } from "../../contexts/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { toggleSidebar, toggleCart, toggleSearchBar, toggleProfilePanel, toggleAuthPopup } from "../../store/slices/popupSlice";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const { authUser } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const cartItemCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <nav className="w-full sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      
      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LEFT - LOGO */}
        <div className="flex items-center gap-2">
          <Pill className="text-green-600" />
          <h1 className="text-xl font-bold text-green-600">
            PharmaAssist
          </h1>
        </div>

        {/* CENTER - SEARCH (DESKTOP) */}
        <div className="hidden lg:flex flex-1 mx-6">
          <div
            onClick={() => dispatch(toggleSearchBar())}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 cursor-pointer"
          >
            <Search size={18} className="text-gray-500" />
            <span className="text-sm text-gray-500">
              Search medicines, symptoms...
            </span>
          </div>
        </div>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-4">

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100  dark:hover:bg-gray-800"
          >
            {theme === "dark" ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </button>

          {/* MOBILE/TABLET SEARCH */}
<button
  onClick={() => dispatch(toggleSearchBar())}
  className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
>
  <Search size={20} />
</button>

          {/* CART */}
          <button
            onClick={() => dispatch(toggleCart())}
            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ShoppingCart size={20} />

            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* USER */}
<button
  onClick={() => {
    if (authUser) {
      dispatch(toggleProfilePanel());
    } else {
      dispatch(toggleAuthPopup());
    }
  }}
  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
>
  <User size={20} />
</button>

          {/* SIDEBAR MENU */}
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* MOBILE SEARCH BAR */}
      {/* <div className="md:hidden px-4 pb-3">
        <div
          onClick={() => dispatch(toggleSearchBar())}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800"
        >
          <Search size={18} className="text-gray-500" />
          <span className="text-sm text-gray-500">
            Search medicines...
          </span>
        </div>
      </div> */}
    </nav>
  );
};

export default Navbar;