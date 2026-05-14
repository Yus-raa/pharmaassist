import {
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShoppingCart,
  ShieldCheck,
  Truck,
  BadgePercent,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import {
  removeFromCart,
  updateCartQuantity,
} from "../store/slices/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { cart } = useSelector(
    (state) => state.cart
  );

  const { authUser } = useSelector(
    (state) => state.auth
  );

  // UPDATE QUANTITY
  const handleQuantityChange = (
    id,
    quantity
  ) => {
    if (quantity <= 0) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(
        updateCartQuantity({
          id,
          quantity,
        })
      );
    }
  };

  // CALCULATIONS
  const subtotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const totalItems = cart.reduce(
    (count, item) =>
      count + item.quantity,
    0
  );

  const taxPrice = Number(
    (subtotal * 0.18).toFixed(2)
  );

  const shippingPrice =
    subtotal >= 5000 ? 0 : 250;

  const totalPrice = Number(
    (
      subtotal +
      taxPrice +
      shippingPrice
    ).toFixed(2)
  );

  // CHECKOUT HANDLER
  const handleCheckout = () => {
  if (!authUser) {
    navigate("/login?redirect=/payment");
  } else {
    navigate("/payment");
  }
};

  // EMPTY CART
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8FFFE] to-[#EEF8F7] flex items-center justify-center px-4">

        <div className="max-w-md w-full text-center bg-white rounded-3xl shadow-lg border border-green-100 p-10">

          <div className="w-24 h-24 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
            <ShoppingCart
              size={42}
              className="text-green-600"
            />
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Your cart is empty
          </h2>

          <p className="text-gray-500 mb-8">
            Add medicines and healthcare
            essentials to continue shopping.
          </p>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-7 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-md hover:shadow-xl"
          >
            Browse Products
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FFFE] to-[#EEF8F7] py-10 px-4">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">

          <h1 className="text-4xl font-bold text-gray-800">
            Shopping Cart
          </h1>

          <p className="text-gray-500 mt-2">
            {totalItems} item(s) added to
            your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-5">

            {cart.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-3xl border border-green-100 shadow-sm hover:shadow-lg transition-all duration-300 p-5"
              >

                <div className="flex flex-col sm:flex-row gap-5">

                  {/* IMAGE */}
                  <Link
                    to={`/product/${item._id}`}
                    className="w-full sm:w-36 h-36 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0"
                  >
                    <img
                      src={
                        item.images?.[0]?.url ||
                        "/vite.svg"
                      }
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* DETAILS */}
                  <div className="flex-1 flex flex-col justify-between">

                    <div>

                      <Link
                        to={`/product/${item._id}`}
                        className="text-xl font-semibold text-gray-800 hover:text-green-600 transition line-clamp-2"
                      >
                        {item.name}
                      </Link>

                      {item.category && (
                        <p className="text-sm text-gray-500 mt-2">
                          Category:{" "}
                          {item.category}
                        </p>
                      )}

                      <p className="text-2xl font-bold text-green-600 mt-4">
                        Rs. {item.price}
                      </p>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mt-6">

                      {/* QUANTITY */}
                      <div className="flex items-center bg-[#F4FBFA] border border-green-100 rounded-2xl px-3 py-2">

                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item._id,
                              item.quantity - 1
                            )
                          }
                          className="p-2 rounded-full hover:bg-white transition"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="w-10 text-center font-semibold text-lg">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item._id,
                              item.quantity + 1
                            )
                          }
                          className="p-2 rounded-full hover:bg-white transition"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* SUBTOTAL */}
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          Subtotal
                        </p>

                        <p className="text-xl font-bold text-gray-800">
                          Rs.{" "}
                          {(
                            item.price *
                            item.quantity
                          ).toFixed(2)}
                        </p>
                      </div>

                      {/* REMOVE */}
                      <button
                        onClick={() =>
                          dispatch(
                            removeFromCart(
                              item._id
                            )
                          )
                        }
                        className="p-3 rounded-full bg-red-50 hover:bg-red-100 text-red-500 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* CONTINUE SHOPPING */}
            <div>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold"
              >
                <ArrowRight
                  size={18}
                  className="rotate-180"
                />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div>

            <div className="bg-white rounded-3xl border border-green-100 shadow-lg p-7 sticky top-24">

              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Order Summary
              </h2>

              {/* SUMMARY */}
              <div className="space-y-4">

                <div className="flex items-center justify-between text-gray-600">
                  <span>
                    Subtotal ({totalItems} items)
                  </span>

                  <span className="font-semibold">
                    Rs.{" "}
                    {subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-600">
                  <span className="flex items-center gap-2">
                    <Truck size={16} />
                    Shipping
                  </span>

                  <span className="font-semibold">
                    {shippingPrice === 0
                      ? "Free"
                      : `Rs. ${shippingPrice}`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-600">
                  <span className="flex items-center gap-2">
                    <BadgePercent size={16} />
                    Tax (18%)
                  </span>

                  <span className="font-semibold">
                    Rs.{" "}
                    {taxPrice.toFixed(2)}
                  </span>
                </div>

                <div className="border-t pt-4 flex items-center justify-between">

                  <span className="text-xl font-bold text-gray-800">
                    Total
                  </span>

                  <span className="text-3xl font-bold text-green-600">
                    Rs.{" "}
                    {totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* FREE SHIPPING NOTICE */}
              {subtotal < 5000 && (
                <div className="mt-5 bg-green-50 border border-green-100 rounded-2xl p-4">

                  <p className="text-sm text-green-700 font-medium">
                    Add Rs.{" "}
                    {(
                      5000 - subtotal
                    ).toFixed(2)}{" "}
                    more to unlock FREE
                    shipping.
                  </p>
                </div>
              )}

              {/* SECURITY */}
              <div className="mt-6 flex items-start gap-3 bg-[#F7FCFB] rounded-2xl p-4 border border-green-100">

                <ShieldCheck
                  className="text-green-600 mt-0.5"
                  size={20}
                />

                <div>
                  <p className="font-semibold text-gray-800">
                    Secure Checkout
                  </p>

                  <p className="text-sm text-gray-500">
                    Your medicines and
                    payment information are
                    protected.
                  </p>
                </div>
              </div>

              {/* CHECKOUT BUTTON */}
              <button
                onClick={handleCheckout}
                className="w-full mt-7 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-md hover:shadow-xl"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;