import { useEffect, useState } from "react";

import {
  X,
  Search,
  Pill,
  HeartPulse,
  Stethoscope,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import { toggleSearchBar } from "../../store/slices/popupSlice";

const SearchOverlay = () => {

  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { isSearchBarOpen } = useSelector(
    (state) => state.popup
  );

  


  // HANDLE SEARCH
  const handleSearch = () => {

    if (searchQuery.trim() === "") return;

    dispatch(toggleSearchBar());

    navigate(
      `/products?search=${encodeURIComponent(
        searchQuery
      )}`
    );
  };


  // ESC KEY CLOSE
  useEffect(() => {

    const handleEsc = (e) => {

      if (e.key === "Escape") {
        dispatch(toggleSearchBar());
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () =>
      window.removeEventListener(
        "keydown",
        handleEsc
      );

  }, [dispatch]);

  useEffect(() => {

  if (isSearchBarOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };

}, [isSearchBarOpen]);

  // CLOSE IF NOT OPEN
  if (!isSearchBarOpen) return null;

  // QUICK SEARCH TAGS
  const quickSearches = [
    "Paracetamol",
    "Cough Syrup",
    "Vitamin C",
    "Diabetes Care",
    "Blood Pressure",
    "Pain Relief",
  ];


  return (
    <div className="fixed inset-0 z-[100]">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => dispatch(toggleSearchBar())}
      />


      {/* SEARCH MODAL */}
      <div className="relative z-10 h-full overflow-y-auto px-4 py-10 flex justify-center">

        <div className="w-full max-w-2xl my-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">

          {/* HEADER */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-800">

            <div>
              <h2 className="text-2xl font-bold text-green-600">
                Search Medicines
              </h2>

              <p className="text-sm text-muted-foreground mt-1">
                Find medicines, health products, and wellness essentials.
              </p>
            </div>

            <button
              onClick={() =>
                dispatch(toggleSearchBar())
              }
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>


          {/* SEARCH INPUT */}
          <div className="p-6">

            <div className="relative">

              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

              <input
                type="text"

                autoFocus

                value={searchQuery}

                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }

                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  handleSearch()
                }

                placeholder="Search medicines, symptoms, vitamins..."

                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-foreground"
              />
            </div>


            {/* QUICK SEARCHES */}
            <div className="mt-6">

              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                Popular Searches
              </h3>

              <div className="flex flex-wrap gap-3">

                {quickSearches.map((item) => (

                  <button
                    key={item}

                    onClick={() => {
                      setSearchQuery(item);

                      navigate(
                        `/products?search=${encodeURIComponent(
                          item
                        )}`
                      );

                      dispatch(toggleSearchBar());
                    }}

                    className="px-4 py-2 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:scale-105 transition"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>


            {/* HEALTH TIPS */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">

              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">

                <Pill className="text-green-600 mb-2" />

                <h4 className="font-semibold">
                  Medicines
                </h4>

                <p className="text-sm text-muted-foreground">
                  Search prescription and OTC medicines.
                </p>
              </div>


              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">

                <HeartPulse className="text-green-600 mb-2" />

                <h4 className="font-semibold">
                  Wellness
                </h4>

                <p className="text-sm text-muted-foreground">
                  Explore vitamins and daily care products.
                </p>
              </div>


              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">

                <Stethoscope className="text-green-600 mb-2" />

                <h4 className="font-semibold">
                  Health Support
                </h4>

                <p className="text-sm text-muted-foreground">
                  Search by symptoms and healthcare needs.
                </p>
              </div>
            </div>


            {/* SEARCH BUTTON */}
            <button
              onClick={handleSearch}
              className="w-full mt-8 py-4 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-semibold transition"
            >
              Search Now
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;