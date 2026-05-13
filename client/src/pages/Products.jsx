import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  Sparkles,
  Filter,
  X,
} from "lucide-react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import ProductCard from "../components/Products/ProductCard";
import Pagination from "../components/Products/Pagination";
import AISearchModal from "../components/Products/AISearchModal";

import { categories } from "../data/products";

import {
  fetchAllProducts,
} from "../store/slices/productSlice";

import {
  toggleAIModal,
} from "../store/slices/popupSlice";

const Products = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const location = useLocation();

  const query = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const initialSearch = query.get("search") || "";
  const initialCategory = query.get("category") || "";

  const [searchQuery, setSearchQuery] =
    useState(initialSearch);

  const [selectedCategory, setSelectedCategory] =
    useState(initialCategory);

  const [priceRange, setPriceRange] =
    useState("0-10000");

  const [selectedRating, setSelectedRating] =
    useState("");

  const [availability, setAvailability] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [isMobileFilterOpen, setIsMobileFilterOpen] =
    useState(false);

  const {
    products,
    totalProducts,
    loading,
  } = useSelector((state) => state.product);

  // Fetch Products
  useEffect(() => {
    dispatch(
      fetchAllProducts({
        search: searchQuery,
        category: selectedCategory,
        price: priceRange,
        ratings: selectedRating,
        availability,
        page: currentPage,
      })
    );

    // Sync URL
    const params = new URLSearchParams();

    if (searchQuery)
      params.set("search", searchQuery);

    if (selectedCategory)
      params.set("category", selectedCategory);

    navigate(
      {
        search: params.toString(),
      },
      { replace: true }
    );
  }, [
    dispatch,
    searchQuery,
    selectedCategory,
    priceRange,
    selectedRating,
    availability,
    currentPage,
    navigate,
  ]);

  const totalPages = Math.ceil(totalProducts / 10);

  const clearFilters = () => {
    setSelectedCategory("");
    setPriceRange("0-10000");
    setSelectedRating("");
    setAvailability("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#FAFEFE]">
      {/* AI SEARCH MODAL */}
      <AISearchModal />

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Top Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Healthcare Products
          </h1>

          <p className="text-gray-500 mt-2">
            Explore medicines, wellness essentials,
            and healthcare products with PharmaAssist.
          </p>
        </div>

        {/* Mobile Filter Button */}
        <button
          onClick={() =>
            setIsMobileFilterOpen(true)
          }
          className="lg:hidden flex items-center gap-2 px-5 py-3 rounded-2xl border border-[#D6EEEE] bg-white shadow-sm mb-6"
        >
          <Filter className="w-5 h-5 text-[#0F766E]" />
          Filters
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          
          {/* SIDEBAR */}
          <aside
            className={`fixed lg:sticky top-0 left-0 h-screen lg:h-fit w-[85%] sm:w-[350px] lg:w-full bg-white z-50 lg:z-auto border-r lg:border border-[#D6EEEE] lg:rounded-3xl p-6 shadow-xl lg:shadow-sm transition-transform duration-300
              
              ${
                isMobileFilterOpen
                  ? "translate-x-0"
                  : "-translate-x-full lg:translate-x-0"
              }`}
          >
            {/* Mobile Close */}
            <div className="flex items-center justify-between lg:hidden mb-6">
              <h2 className="text-xl font-bold">
                Filters
              </h2>

              <button
                onClick={() =>
                  setIsMobileFilterOpen(false)
                }
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-800 mb-4">
                Categories
              </h3>

              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-2xl transition-all
                      
                      ${
                        selectedCategory === cat.name
                          ? "bg-[#0F766E] text-white"
                          : "hover:bg-[#F0FAFA] text-gray-700"
                      }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="mb-8">
              <h3 className="font-semibold mb-4">
                Availability
              </h3>

              <div className="space-y-3">
                {[
                  "in-stock",
                  "limited-stock",
                  "out-of-stock",
                ].map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-3 text-gray-700"
                  >
                    <input
                      type="radio"
                      name="availability"
                      checked={
                        availability === status
                      }
                      onChange={() =>
                        setAvailability(status)
                      }
                    />

                    {status.replace("-", " ")}
                  </label>
                ))}
              </div>
            </div>

            {/* Ratings */}
            <div className="mb-8">
              <h3 className="font-semibold mb-4">
                Ratings
              </h3>

              <select
                value={selectedRating}
                onChange={(e) =>
                  setSelectedRating(
                    e.target.value
                  )
                }
                className="w-full rounded-2xl border border-[#D6EEEE] px-4 py-3 outline-none"
              >
                <option value="">
                  All Ratings
                </option>

                <option value="4">
                  4★ & above
                </option>

                <option value="3">
                  3★ & above
                </option>

                <option value="2">
                  2★ & above
                </option>
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-8">
              <h3 className="font-semibold mb-4">
                Price Range
              </h3>

              <select
                value={priceRange}
                onChange={(e) =>
                  setPriceRange(
                    e.target.value
                  )
                }
                className="w-full rounded-2xl border border-[#D6EEEE] px-4 py-3 outline-none"
              >
                <option value="0-10000">
                  All Prices
                </option>

                <option value="0-500">
                  Rs. 0 - 500
                </option>

                <option value="500-2000">
                  Rs. 500 - 2000
                </option>

                <option value="2000-10000">
                  Rs. 2000+
                </option>
              </select>
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="w-full py-3 rounded-2xl border border-red-200 text-red-600 hover:bg-red-50 transition-all"
            >
              Clear Filters
            </button>
          </aside>

          {/* MAIN CONTENT */}
          <main>
            
            {/* Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="text"
                  placeholder="Search medicines or healthcare products..."
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(
                      e.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-[#D6EEEE] bg-white py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-[#14B8A6]/10"
                />
              </div>

              {/* AI Search */}
              <button
                onClick={() =>
                  dispatch(toggleAIModal())
                }
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#0F766E] px-6 py-4 text-white font-semibold hover:bg-[#115E59] transition-all"
              >
                <Sparkles className="w-5 h-5" />

                Smart Search
              </button>
            </div>

            {/* Products Count */}
            <div className="mb-6">
              <p className="text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-700">
                  {products?.length || 0}
                </span>{" "}
                healthcare products
              </p>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-[380px] rounded-3xl bg-white animate-pulse border border-[#D6EEEE]"
                  />
                ))}
              </div>
            ) : products?.length > 0 ? (
              
              <>
                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={
                    setCurrentPage
                  }
                />
              </>
            ) : (
              
              /* Empty State */
              <div className="bg-white border border-dashed border-[#C7E8E8] rounded-3xl p-14 text-center">
                <div className="w-20 h-20 rounded-full bg-[#F0FAFA] flex items-center justify-center mx-auto mb-5">
                  <Search className="w-10 h-10 text-[#0F766E]" />
                </div>

                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  No Products Found
                </h3>

                <p className="text-gray-500 max-w-lg mx-auto mb-6">
                  Try changing filters, adjusting your
                  search terms, or use Smart Search for
                  better healthcare product discovery.
                </p>

                <button
                  onClick={clearFilters}
                  className="px-6 py-3 rounded-2xl bg-[#0F766E] text-white font-semibold hover:bg-[#115E59]"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;