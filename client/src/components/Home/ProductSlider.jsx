import { useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ShoppingCart,
  Pill,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import { toast } from "react-toastify";

const ProductSlider = ({ title, products = [] }) => {
  const scrollRef = useRef(null);
  const dispatch = useDispatch();

  // SCROLL FUNCTION
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 340;

      scrollRef.current.scrollBy({
        left:
          direction === "left"
            ? -scrollAmount
            : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // ADD TO CART
  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
  addToCart({
    product,
    quantity: 1,
  })
);

    toast.success(
      `${product.name} added to cart`
    );
  };

  // STOCK BADGE
  const getStockBadge = (stock) => {
    if (stock > 5) {
      return {
        text: "In Stock",
        style:
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      };
    }

    if (stock > 0) {
      return {
        text: "Limited Stock",
        style:
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      };
    }

    return {
      text: "Out of Stock",
      style:
        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
  };

  return (
    <section className="py-10">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Pill className="w-6 h-6 text-green-600" />
            {title}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Trusted healthcare and pharmacy products
          </p>
        </div>

        {/* SCROLL BUTTONS */}
        <div className="flex items-center gap-2">

          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-green-600 hover:text-white transition"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-green-600 hover:text-white transition"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* PRODUCTS */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
      >

        {products?.map((product) => {
          const stockBadge = getStockBadge(
            product.stock
          );

          const isNew =
            new Date(product.createdAt) >
            new Date(
              Date.now() -
                14 * 24 * 60 * 60 * 1000
            );

          const isTopRated =
            product.ratings >= 4.5;

          return (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="min-w-[280px] max-w-[280px] bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >

              {/* IMAGE */}
              <div className="relative h-56 bg-gray-100 dark:bg-gray-800 overflow-hidden">

                <img
                  src={product.images?.[0]?.url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />

                {/* BADGES */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">

                  {isNew && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      New
                    </span>
                  )}

                  {isTopRated && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                      Top Rated
                    </span>
                  )}
                </div>

                {/* STOCK BADGE */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${stockBadge.style}`}
                  >
                    {stockBadge.text}
                  </span>
                </div>

                {/* QUICK ADD */}
                <button
                  onClick={(e) =>
                    handleAddToCart(product, e)
                  }
                  disabled={product.stock === 0}
                  className="absolute bottom-3 right-3 w-11 h-11 rounded-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center shadow-lg transition disabled:bg-gray-400"
                >
                  <ShoppingCart size={18} />
                </button>
              </div>

              {/* CONTENT */}
              <div className="p-4">

                {/* CATEGORY */}
                <p className="text-xs uppercase tracking-wide text-green-600 font-medium mb-2">
                  {product.category}
                </p>

                {/* NAME */}
                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 min-h-[48px]">
                  {product.name}
                </h3>

                {/* DESCRIPTION */}
                <p className="text-sm text-gray-500 mt-2 line-clamp-2 min-h-[40px]">
                  {product.description}
                </p>

                {/* RATING */}
                <div className="flex items-center gap-2 mt-4">

                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star
                      size={16}
                      fill="currentColor"
                    />

                    <span className="text-sm font-medium">
                      {product.ratings || 0}
                    </span>
                  </div>

                  <span className="text-xs text-gray-400">
                    ({product.numOfReviews || 0} reviews)
                  </span>
                </div>

                {/* PRICE */}
                <div className="mt-4 flex items-center justify-between">

                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      Rs. {product.price}
                    </p>
                  </div>

                  <div className="text-xs text-gray-500">
                    {product.stock > 0
                      ? `${product.stock} available`
                      : "Unavailable"}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default ProductSlider;