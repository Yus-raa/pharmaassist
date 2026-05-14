import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  Check,
  CreditCard,
  MapPin,
  ShieldCheck,
  Truck,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  Elements,
} from "@stripe/react-stripe-js";

import {
  loadStripe,
} from "@stripe/stripe-js";

import PaymentForm from "../components/PaymentForm";

import {
  placeOrder,
  setOrderStep,
} from "../store/slices/orderSlice";

const stripePromise = loadStripe(
  "pk_test_51TU7rlDSJD8wpX4rZVnvg7tQUWqkawqfcnAyrA3KmjxFiPcEBN54lNbYUiV3dKCoJuQZzz0ovzWVeyE73aS8eT7k000xqZ9pVX"
);

const pakistanStates = [
  "Sindh",
  "Punjab",
  "Balochistan",
  "Khyber Pakhtunkhwa",
  "Gilgit-Baltistan",
  "Azad Kashmir",
  "Islamabad",
];

const Payment = () => {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { authUser } = useSelector(
    (state) => state.auth
  );

  const { cart } = useSelector(
    (state) => state.cart
  );

  const {
    orderStep,
    clientSecret,
    placingOrder,
    finalPrice,
    orderId,
  } = useSelector(
    (state) => state.order
  );

  // REDIRECTS
  useEffect(() => {
    if (!authUser) {
      navigate("/login");
    }
  }, [authUser, navigate]);

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/cart");
    }
  }, [cart, navigate]);

  // SHIPPING DETAILS
  const [
    shippingDetails,
    setShippingDetails,
  ] = useState({
    full_name:
      authUser?.name || "",

    state: "",

    city: "",

    address: "",

    pincode: "",

    country: "Pakistan",

    phone: "",
  });

  // CALCULATIONS
  const subtotal = useMemo(() => {
    return cart.reduce(
      (acc, item) =>
        acc +
        item.price *
          item.quantity,
      0
    );
  }, [cart]);

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

  // HANDLE CHANGE
  const handleChange = (
    e
  ) => {
    setShippingDetails({
      ...shippingDetails,

      [e.target.name]:
        e.target.value,
    });
  };

  // PLACE ORDER
  const handlePlaceOrder = (
    e
  ) => {
    e.preventDefault();

    const orderedItems =
      cart.map((item) => ({
        product_id:
          item._id,

        quantity:
          item.quantity,
      }));

    const orderData = {
      ...shippingDetails,

      orderedItems,
    };

    dispatch(
      placeOrder(orderData)
    );
  };

  // EMPTY CART
  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F8FFFE] to-[#EEF8F7] px-4">

        <div className="bg-white rounded-3xl border border-green-100 shadow-lg p-10 max-w-md w-full text-center">

          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">

            <Truck
              size={40}
              className="text-green-600"
            />
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            No Items Found
          </h2>

          <p className="text-gray-500 mb-8">
            Add medicines to your
            cart before proceeding
            to checkout.
          </p>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-7 py-3 rounded-2xl font-semibold transition"
          >
            Browse Products
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

          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-medium mb-5"
          >
            <ArrowLeft size={18} />
            Back to Cart
          </Link>

          <h1 className="text-4xl font-bold text-gray-800">
            Secure Checkout
          </h1>

          <p className="text-gray-500 mt-2">
            Complete your order
            securely with
            PharmaAssist.
          </p>
        </div>

        {/* STEPS */}
        <div className="flex items-center gap-5 mb-10">

          {/* STEP 1 */}
          <div className="flex items-center gap-3">

            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold

                ${
                  orderStep >= 1
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }
              `}
            >
              {orderStep > 1 ? (
                <Check size={20} />
              ) : (
                "1"
              )}
            </div>

            <div>
              <p className="font-semibold text-gray-800">
                Shipping
              </p>

              <p className="text-sm text-gray-500">
                Delivery details
              </p>
            </div>
          </div>

          <div className="h-1 flex-1 bg-green-200 rounded-full" />

          {/* STEP 2 */}
          <div className="flex items-center gap-3">

            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold

                ${
                  orderStep >= 2
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }
              `}
            >
              2
            </div>

            <div>
              <p className="font-semibold text-gray-800">
                Payment
              </p>

              <p className="text-sm text-gray-500">
                Secure payment
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2">

            {/* STEP 1 */}
            {orderStep === 1 && (

              <form
                onSubmit={
                  handlePlaceOrder
                }

                className="bg-white rounded-3xl border border-green-100 shadow-sm p-8"
              >

                <div className="flex items-center gap-3 mb-8">

                  <MapPin className="text-green-600" />

                  <h2 className="text-2xl font-bold text-gray-800">
                    Shipping Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* FULL NAME */}
                  <div className="md:col-span-2">

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="full_name"
                      required
                      value={
                        shippingDetails.full_name
                      }

                      onChange={
                        handleChange
                      }

                      className="w-full border border-green-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  {/* PHONE */}
                  <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      required
                      value={
                        shippingDetails.phone
                      }

                      onChange={
                        handleChange
                      }

                      placeholder="03XXXXXXXXX"
                      className="w-full border border-green-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  {/* CITY */}
                  <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      required
                      value={
                        shippingDetails.city
                      }

                      onChange={
                        handleChange
                      }

                      className="w-full border border-green-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  {/* STATE */}
                  <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>

                    <select
                      name="state"
                      required
                      value={
                        shippingDetails.state
                      }

                      onChange={
                        handleChange
                      }

                      className="w-full border border-green-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >

                      <option value="">
                        Select State
                      </option>

                      {pakistanStates.map(
                        (state) => (
                          <option
                            key={state}
                            value={state}
                          >
                            {state}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* PINCODE */}
                  <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode
                    </label>

                    <input
                      type="text"
                      name="pincode"
                      required
                      value={
                        shippingDetails.pincode
                      }

                      onChange={
                        handleChange
                      }

                      className="w-full border border-green-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  {/* ADDRESS */}
                  <div className="md:col-span-2">

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>

                    <textarea
                      rows={4}
                      name="address"
                      required
                      value={
                        shippingDetails.address
                      }

                      onChange={
                        handleChange
                      }

                      className="w-full border border-green-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    />
                  </div>
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={
                    placingOrder
                  }

                  className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-semibold text-lg transition disabled:opacity-70"
                >
                  {placingOrder
                    ? "Processing..."
                    : "Continue to Payment"}
                </button>
              </form>
            )}

            {/* STEP 2 */}
            {orderStep === 2 &&
              clientSecret && (

                <div className="bg-white rounded-3xl border border-green-100 shadow-sm p-8">

                  <div className="flex items-center gap-3 mb-8">

                    <CreditCard className="text-green-600" />

                    <h2 className="text-2xl font-bold text-gray-800">
                      Payment Details
                    </h2>
                  </div>

                  <Elements
                    stripe={
                      stripePromise
                    }

                    options={{
                      clientSecret,
                    }}
                  >
                    <PaymentForm
                      amount={
                        finalPrice
                      }

                      orderId={
                        orderId
                      }
                    />
                  </Elements>

                  <button
                    onClick={() =>
                      dispatch(
                        setOrderStep(
                          1
                        )
                      )
                    }

                    className="mt-6 text-green-700 hover:text-green-800 font-medium"
                  >
                    ← Back to Shipping
                  </button>
                </div>
              )}
          </div>

          {/* RIGHT SIDE */}
          <div>

            <div className="bg-white rounded-3xl border border-green-100 shadow-lg p-7 sticky top-24">

              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Order Summary
              </h2>

              {/* ITEMS */}
              <div className="space-y-4 mb-6">

                {cart.map((item) => (

                  <div
                    key={item._id}
                    className="flex items-center gap-4"
                  >

                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">

                      <img
                        src={
                          item.images?.[0]
                            ?.url ||
                          "/vite.svg"
                        }

                        alt={
                          item.name
                        }

                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">

                      <h3 className="font-medium text-gray-800 line-clamp-1">
                        {item.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Qty:{" "}
                        {
                          item.quantity
                        }
                      </p>
                    </div>

                    <p className="font-semibold text-green-600">
                      Rs.{" "}
                      {(
                        item.price *
                        item.quantity
                      ).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* PRICING */}
              <div className="space-y-4 border-t border-green-100 pt-5">

                <div className="flex justify-between text-gray-600">

                  <span>
                    Subtotal
                  </span>

                  <span>
                    Rs.{" "}
                    {subtotal.toFixed(
                      2
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">

                  <span>
                    Shipping
                  </span>

                  <span>
                    {shippingPrice ===
                    0
                      ? "Free"
                      : `Rs. ${shippingPrice}`}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">

                  <span>
                    Tax (18%)
                  </span>

                  <span>
                    Rs.{" "}
                    {taxPrice.toFixed(
                      2
                    )}
                  </span>
                </div>

                <div className="flex justify-between border-t border-green-100 pt-4">

                  <span className="text-xl font-bold text-gray-800">
                    Total
                  </span>

                  <span className="text-3xl font-bold text-green-600">
                    Rs.{" "}
                    {totalPrice.toFixed(
                      2
                    )}
                  </span>
                </div>
              </div>

              {/* SECURITY */}
              <div className="mt-6 bg-green-50 border border-green-100 rounded-2xl p-4 flex items-start gap-3">

                <ShieldCheck
                  className="text-green-600 mt-0.5"
                  size={20}
                />

                <div>
                  <p className="font-semibold text-gray-800">
                    Secure Payment
                  </p>

                  <p className="text-sm text-gray-500">
                    Stripe encrypted
                    checkout for safe
                    transactions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;