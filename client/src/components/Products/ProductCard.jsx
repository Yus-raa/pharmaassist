import { Star, ShoppingCart, Pill } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

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
      `${product.name} added to your healthcare cart`
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
        text: "Limited",
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

  const stockBadge = getStockBadge(
    product?.stock
  );

  // NEW PRODUCT
  const isNew =
    new Date(product?.createdAt) >
    new Date(
      Date.now() -
        14 * 24 * 60 * 60 * 1000
    );

  // TOP RATED
  const isTopRated =
    product?.ratings >= 4.5;

  return (
    <Link
      to={`/product/${product?._id}`}
      className="group bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
    >

      {/* IMAGE SECTION */}
      <div className="relative h-60 overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-800 dark:to-gray-900">

        <img
          src={
            product?.images?.[0]?.url ||
            "/vite.svg"
          }
          alt={product?.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />

        {/* HEALTHCARE OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

        {/* LEFT BADGES */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">

          {isNew && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm">
              New Arrival
            </span>
          )}

          {isTopRated && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 shadow-sm">
              Top Rated
            </span>
          )}
        </div>

        {/* RIGHT BADGE */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${stockBadge.style}`}
          >
            {stockBadge.text}
          </span>
        </div>

        {/* QUICK ADD BUTTON */}
        <button
          onClick={(e) =>
            handleAddToCart(product, e)
          }
          disabled={product?.stock === 0}
          className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 disabled:bg-gray-400 disabled:hover:scale-100"
        >
          <ShoppingCart size={18} />
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-5">

        {/* CATEGORY */}
        <div className="flex items-center gap-2 mb-3">
          <Pill
            size={14}
            className="text-green-600"
          />

          <p className="text-xs uppercase tracking-wider text-green-600 font-semibold">
            {product?.category || "Healthcare"}
          </p>
        </div>

        {/* PRODUCT NAME */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 min-h-[56px] leading-snug">
          {product?.name}
        </h3>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 min-h-[42px]">
          {product?.description}
        </p>

        {/* RATING */}
        <div className="flex items-center justify-between mt-5">

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star
                size={16}
                fill="currentColor"
              />

              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {product?.ratings || 0}
              </span>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            {product?.stock > 0
              ? `${product.stock} available`
              : "Unavailable"}
          </div>
        </div>

        {/* PRICE */}
        <div className="mt-5 flex items-center justify-between">

          <div>
            <p className="text-2xl font-extrabold text-green-600">
              Rs. {product?.price}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Trusted healthcare product
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;