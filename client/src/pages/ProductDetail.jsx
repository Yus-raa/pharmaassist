import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Plus,
  Minus,
  Loader2,
  Pill,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import ReviewsContainer from "../components/Products/ReviewsContainer";

import { addToCart } from "../store/slices/cartSlice";

import {
  fetchProductDetails
} from "../store/slices/productSlice";

import { toast } from "react-toastify";

const ProductDetail = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const {
    productDetails: product,
    productReviews,
    loading,
  } = useSelector((state) => state.product);

  const [selectedImage, setSelectedImage] = useState(0);

  const [quantity, setQuantity] = useState(1);

  const [activeTab, setActiveTab] =
    useState("description");

  // FETCH PRODUCT
  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  // RESET IMAGE WHEN PRODUCT CHANGES
  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
  }, [product]);

  // MAIN IMAGE
  const mainImage = useMemo(() => {
    if (!product?.images?.length) {
      return "https://placehold.co/600x600?text=PharmaAssist";
    }

    return (
      product.images[selectedImage]?.url ||
      product.images[0]?.url
    );
  }, [product, selectedImage]);

  // ADD TO CART
  const handleAddToCart = () => {
    if (!product) return;

    dispatch(
      addToCart({
        product,
        quantity,
      })
    );

    toast.success(
      `${product.name} added to cart`
    );
  };

  // handle copy url
  const handleCopyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard
    .writeText(currentURL)
    .then(() => {
      toast.success("URL Copied", currentURL)
    })
    .catch((err) => {
      console.error("Failed to Copy:", err)
    })
  }

  // LOADING UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFEFE]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full border-4 border-[#A6D6D6] border-t-[#0F766E] animate-spin" />

          <p className="text-gray-600 font-medium">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  // PRODUCT NOT FOUND
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#FAFEFE]">
        <div className="max-w-md w-full bg-white border border-[#D6EEEE] rounded-3xl p-8 text-center shadow-sm">
          <div className="w-20 h-20 rounded-full bg-[#EAF8F8] flex items-center justify-center mx-auto mb-5">
            <Pill className="w-10 h-10 text-[#0F766E]" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800">
            Product Not Found
          </h2>

          <p className="text-gray-500 mt-3">
            The product you are looking for
            does not exist or may have been
            removed.
          </p>
        </div>
      </div>
    );
  }

  // STOCK STATUS
  const inStock = product.stock > 0;

  return (
    <div className="min-h-screen bg-[#FAFEFE] py-8">
      <div className="container mx-auto px-4">
        
        {/* MAIN SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white border border-[#D6EEEE] rounded-3xl p-5 md:p-8 shadow-sm">
          
          {/* LEFT SIDE */}
          <div>
            
            {/* MAIN IMAGE */}
            <div className="relative rounded-3xl overflow-hidden bg-[#F4FBFB] border border-[#D6EEEE]">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-[320px] sm:h-[450px] object-cover"
              />

              {/* BADGES */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                
                {product.ratings >= 4.5 && (
                  <span className="px-4 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                    Top Rated
                  </span>
                )}

                {inStock ? (
                  <span className="px-4 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                    In Stock
                  </span>
                ) : (
                  <span className="px-4 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                    Out Of Stock
                  </span>
                )}
              </div>
            </div>

            {/* THUMBNAILS */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {product.images.map(
                  (image, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        setSelectedImage(index)
                      }
                      className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                        selectedImage === index
                          ? "border-[#0F766E]"
                          : "border-[#D6EEEE]"
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col">
            
            {/* CATEGORY */}
            <div className="mb-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#EAF8F8] px-4 py-2 text-sm font-medium text-[#0F766E]">
                <Pill className="w-4 h-4" />
                {product.category}
              </span>
            </div>

            {/* TITLE */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* RATING */}
            <div className="flex flex-wrap items-center gap-4 mt-5">
              
              <div className="flex items-center gap-1 text-yellow-500">
                <Star
                  size={20}
                  fill="currentColor"
                />

                <span className="font-semibold text-gray-800">
                  {product.ratings || 0}
                </span>
              </div>

              <span className="text-gray-500 text-sm">
                ({productReviews?.length || 0})
              </span>

              <span className="text-sm text-gray-500">
                {product.stock} items available
              </span>
            </div>

            {/* PRICE */}
            <div className="mt-6">
              <h2 className="text-4xl font-bold text-[#0F766E]">
                Rs. {product.price}
              </h2>
            </div>

            {/* DESCRIPTION */}
            <div className="mt-6">
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* FEATURES */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              
              <div className="rounded-2xl bg-[#F7FCFC] border border-[#D6EEEE] p-4">
                <ShieldCheck className="w-6 h-6 text-[#0F766E]" />

                <h4 className="font-semibold text-gray-800 mt-3">
                  Genuine Product
                </h4>

                <p className="text-sm text-gray-500 mt-1">
                  Verified healthcare quality
                </p>
              </div>

              <div className="rounded-2xl bg-[#F7FCFC] border border-[#D6EEEE] p-4">
                <Truck className="w-6 h-6 text-[#0F766E]" />

                <h4 className="font-semibold text-gray-800 mt-3">
                  Fast Delivery
                </h4>

                <p className="text-sm text-gray-500 mt-1">
                  Quick pharmacy shipping
                </p>
              </div>

              <div className="rounded-2xl bg-[#F7FCFC] border border-[#D6EEEE] p-4">
                <Heart className="w-6 h-6 text-[#0F766E]" />

                <h4 className="font-semibold text-gray-800 mt-3">
                  Healthcare Focused
                </h4>

                <p className="text-sm text-gray-500 mt-1">
                  Trusted wellness products
                </p>
              </div>
            </div>

            {/* QUANTITY */}
            <div className="mt-8">
              <p className="font-semibold text-gray-800 mb-3">
                Quantity
              </p>

              <div className="flex items-center gap-4">
                
                <div className="flex items-center border border-[#D6EEEE] rounded-2xl overflow-hidden">
                  <button
                    onClick={() =>
                      setQuantity((prev) =>
                        prev > 1
                          ? prev - 1
                          : 1
                      )
                    }
                    className="w-12 h-12 flex items-center justify-center hover:bg-[#F3FBFB]"
                  >
                    <Minus size={18} />
                  </button>

                  <div className="w-14 text-center font-semibold">
                    {quantity}
                  </div>

                  <button
                    onClick={() =>
                      setQuantity((prev) =>
                        prev < product.stock
                          ? prev + 1
                          : prev
                      )
                    }
                    className="w-12 h-12 flex items-center justify-center hover:bg-[#F3FBFB]"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex-1 rounded-2xl bg-[#0F766E] hover:bg-[#115E59] disabled:bg-gray-400 text-white py-4 font-semibold transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />

                Add To Cart
              </button>

              <button className="rounded-2xl border border-[#D6EEEE] px-5 py-4 hover:bg-[#F7FCFC] transition">
                <Heart className="w-5 h-5 text-gray-700" />
              </button>

              <button onClick={handleCopyURL} className="rounded-2xl border border-[#D6EEEE] px-5 py-4 hover:bg-[#F7FCFC] transition">
                <Share2 className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="mt-10 bg-white border border-[#D6EEEE] rounded-3xl overflow-hidden">
          
          {/* TAB BUTTONS */}
          <div className="flex flex-wrap border-b border-[#D6EEEE]">
            
            <button
              onClick={() =>
                setActiveTab("description")
              }
              className={`px-6 py-4 font-medium transition ${
                activeTab === "description"
                  ? "text-[#0F766E] border-b-2 border-[#0F766E] bg-[#F7FCFC]"
                  : "text-gray-500"
              }`}
            >
              Description
            </button>

            <button
              onClick={() =>
                setActiveTab("reviews")
              }
              className={`px-6 py-4 font-medium transition ${
                activeTab === "reviews"
                  ? "text-[#0F766E] border-b-2 border-[#0F766E] bg-[#F7FCFC]"
                  : "text-gray-500"
              }`}
            >
              Reviews (
              {productReviews?.length || 0})
            </button>
          </div>

          {/* TAB CONTENT */}
          <div className="p-6 md:p-8">
            
            {activeTab === "description" && (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Product Information
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-10">
                {/* REVIEWS */}
                <ReviewsContainer
                  product={product}
                  productReviews={productReviews}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;