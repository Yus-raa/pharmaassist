import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import {
  removeFromCart,
  updateCartQuantity,
} from "../../store/slices/cartSlice";

import { toggleCart } from "../../store/slices/popupSlice";

const CartSidebar = () => {
  const dispatch = useDispatch();

  const { isCartOpen } = useSelector(
    (state) => state.popup
  );

  const { cart } = useSelector(
    (state) => state.cart
  );

  if (!isCartOpen) return null;

  const updateQuantity = (id, quantity) => {
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

  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  return (
    <>
      {/* OVERLAY */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={() => dispatch(toggleCart())}
      />

      {/* SIDEBAR */}
      <div className="fixed top-0 right-0 z-50 h-screen w-full sm:w-[420px] bg-white dark:bg-gray-950 shadow-2xl flex flex-col animate-slide-in-right">

        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 text-green-600">
              <ShoppingBag size={22} />
              Your Cart
            </h2>

            {/* <p className="text-sm text-muted-foreground mt-1">
              {cart.length} item(s) added
            </p> */}
          </div>

          <button
            onClick={() => dispatch(toggleCart())}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* CART CONTENT */}
        <div className="flex-1 overflow-y-auto px-4 py-4">

          {cart.length > 0 ? (
            <div className="space-y-4">

              {cart.map((item) => (
                <div
                  key={item._id}
                  className="rounded-2xl border border-border bg-card p-4 shadow-sm"
                >

                  <div className="flex gap-4">

                    {/* IMAGE */}
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 flex-shrink-0">
                      <img
                        src={
                          item.images?.[0]?.url ||
                          "/vite.svg"
                        }
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* INFO */}
                    <div className="flex-1">

                      <h3 className="font-semibold text-base line-clamp-2">
                        {item.name}
                      </h3>

                      <p className="text-green-600 font-bold mt-1">
                        Rs. {item.price}
                      </p>

                      {/* QUANTITY */}
                      <div className="flex items-center justify-between mt-4">

                        <div className="flex items-center gap-2">

                          <button
                            onClick={() =>
                              updateQuantity(
                                item._id,
                                item.quantity - 1
                              )
                            }
                            className="p-1.5 rounded-full border hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <Minus size={14} />
                          </button>

                          <span className="font-medium w-6 text-center">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(
                                item._id,
                                item.quantity + 1
                              )
                            }
                            className="p-1.5 rounded-full border hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* REMOVE */}
                        <button
                          onClick={() =>
                            dispatch(
                              removeFromCart(item._id)
                            )
                          }
                          className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950 p-2 rounded-full transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          ) : (

            // EMPTY CART
            <div className="h-full flex flex-col items-center justify-center text-center px-6">

              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <ShoppingBag
                  size={36}
                  className="text-green-600"
                />
              </div>

              <h3 className="text-xl font-semibold mb-2">
                Your cart is empty
              </h3>

              <p className="text-muted-foreground mb-6">
                Add medicines and healthcare products
                to continue.
              </p>

              <Link
                to="/products"
                onClick={() =>
                  dispatch(toggleCart())
                }
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition"
              >
                Browse Products
              </Link>
            </div>
          )}
        </div>

        {/* FOOTER */}
        {cart.length > 0 && (
          <div className="border-t border-border p-5 bg-background">

            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium">
                Total
              </span>

              <span className="text-2xl font-bold text-green-600">
                Rs. {total.toFixed(2)}
              </span>
            </div>

            <Link
              to="/cart"
              onClick={() => dispatch(toggleCart())}
              className="block w-full text-center bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;