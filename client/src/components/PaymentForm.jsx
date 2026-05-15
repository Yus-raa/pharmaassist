import { useState } from "react";

import {
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import {
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  CreditCard,
  Lock,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import { toast } from "react-toastify";

import {
  markOrderAsPaid,
} from "../store/slices/orderSlice";

import {
  clearCart,
} from "../store/slices/cartSlice";

const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#1F2937",

      "::placeholder": {
        color: "#9CA3AF",
      },
    },

    invalid: {
      color: "#EF4444",
    },
  },
};

const PaymentForm = ({
  amount,
  orderId,
}) => {

  const stripe = useStripe();

  const elements =
    useElements();

  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();

  const {
    clientSecret,
    paymentLoading,
  } = useSelector(
    (state) => state.order
  );

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  // =========================
  // REAL STRIPE PAYMENT
  // =========================
  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    setErrorMessage("");

    if (
      !stripe ||
      !elements
    ) {
      return;
    }

    const cardElement =
      elements.getElement(
        CardElement
      );

    if (!cardElement) {
      return;
    }

    try {

      // CONFIRM PAYMENT
      const {
        error,
        paymentIntent,
      } =
        await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: {
              card: cardElement,
            },
          }
        );

      // STRIPE ERROR
      if (error) {

        setErrorMessage(
          error.message
        );

        toast.error(
          error.message
        );

        return;
      }

      // PAYMENT SUCCESS
      if (
        paymentIntent?.status ===
        "succeeded"
      ) {

        await dispatch(
          markOrderAsPaid({
            orderId,

            payment_id:
              paymentIntent.id,
          })
        ).unwrap();

        dispatch(
          clearCart()
        );

        toast.success(
          "Payment completed successfully."
        );

        navigate(
          "/orders"
        );
      }

    } catch (error) {

      setErrorMessage(
        error.message ||
          "Payment failed."
      );

      toast.error(
        error.message ||
          "Payment failed."
      );
    }
  };

  // =========================
  // DEMO PAYMENT
  // =========================
  const handleDemoPayment =
    async () => {
      try {

        await dispatch(
          markOrderAsPaid({
            orderId,

            payment_id:
              "DEMO_PAYMENT_SUCCESS",
          })
        ).unwrap();

        dispatch(
          clearCart()
        );

        toast.success(
          "Demo payment successful."
        );

        navigate(
          "/orders"
        );

      } catch (error) {

        toast.error(
          "Demo payment failed."
        );
      }
    };

  return (
    <div className="space-y-6">

      {/* PAYMENT FORM */}
      <form
        onSubmit={
          handleSubmit
        }

        className="bg-white rounded-3xl border border-green-100 shadow-sm p-8"
      >

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">

          <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">

            <CreditCard className="w-7 h-7 text-green-600" />
          </div>

          <div>

            <h2 className="text-2xl font-bold text-gray-800">
              Card Payment
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Secure checkout
              powered by Stripe
            </p>
          </div>
        </div>

        {/* AMOUNT */}
        <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-5">

          <p className="text-sm text-gray-500 mb-1">
            Total Amount
          </p>

          <h3 className="text-4xl font-bold text-green-600">
            Rs.{" "}
            {amount?.toFixed(
              2
            )}
          </h3>
        </div>

        {/* CARD INPUT */}
        <div className="mb-6">

          <label className="block text-sm font-semibold text-gray-700 mb-3">

            Card Details
          </label>

          <div className="border border-green-100 rounded-2xl px-5 py-5 bg-[#FAFEFE] focus-within:ring-2 focus-within:ring-green-500 transition">

            <CardElement
              options={
                cardElementOptions
              }
            />
          </div>
        </div>

        {/* SECURITY */}
        <div className="flex items-start gap-3 mb-8 bg-green-50 border border-green-100 rounded-2xl p-4">

          <ShieldCheck
            className="text-green-600 mt-0.5"
            size={20}
          />

          <div>

            <p className="font-semibold text-gray-800">
              Secure Encrypted Payment
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Your payment
              information is
              encrypted and
              protected by
              Stripe.
            </p>
          </div>
        </div>

        {/* PAY BUTTON */}
        <button
          type="submit"

          disabled={
            !stripe ||
            paymentLoading
          }

          className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-semibold text-lg transition-all duration-300 disabled:opacity-70 shadow-md hover:shadow-xl"
        >

          {paymentLoading ? (
            <>

              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />

              Processing Payment...
            </>
          ) : (
            <>

              <Lock size={20} />

              Complete Payment
            </>
          )}
        </button>

        {/* ERROR */}
        {errorMessage && (

          <div className="mt-5 bg-red-50 border border-red-100 text-red-600 rounded-2xl p-4 text-sm">

            {errorMessage}
          </div>
        )}
      </form>

      {/* DEMO PAYMENT */}
      <div className="bg-white rounded-3xl border border-blue-100 shadow-sm p-6">

        <div className="flex items-center gap-3 mb-4">

          <CheckCircle2 className="text-blue-600" />

          <h3 className="text-xl font-bold text-gray-800">
            Demo Payment
          </h3>
        </div>

        <p className="text-gray-500 mb-5 leading-relaxed">

          Use demo mode for
          testing without a real
          card. This will mark
          the order as paid and
          reduce stock just like
          a successful payment.
        </p>

        <button
          onClick={
            handleDemoPayment
          }

          disabled={
            paymentLoading
          }

          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold transition-all duration-300 disabled:opacity-70"
        >
          Pay with Demo Mode
        </button>
      </div>

      {/* TEST CARDS */}
      <div className="bg-white rounded-3xl border border-yellow-100 shadow-sm p-6">

        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Stripe Test Cards
        </h3>

        <div className="space-y-4 text-sm">

          <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4">

            <p className="font-semibold text-gray-800 mb-2">
              Successful Payment
            </p>

            <p className="font-mono text-green-700">
              4242 4242 4242 4242
            </p>

            <p className="text-gray-500 mt-1">
              Any future expiry
              date, any CVV,
              any ZIP.
            </p>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-2xl p-4">

            <p className="font-semibold text-gray-800 mb-2">
              Declined Payment
            </p>

            <p className="font-mono text-red-600">
              4000 0000 0000 0002
            </p>

            <p className="text-gray-500 mt-1">
              Simulates failed
              payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;