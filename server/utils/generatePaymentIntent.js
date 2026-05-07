import stripe from "./stripe.js";
import Payment from "../models/payment.js";

export const generatePaymentIntent = async (orderId, totalPrice) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100), // cents
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    // Save payment in Mongo
    await Payment.create({
      order_id: orderId,
      payment_type: "Online",
      payment_status: "Pending",
      payment_intent_id: paymentIntent.id, // ✅ IMPORTANT
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error) {
    console.error("Payment Error:", error.message);
    return {
      success: false,
      message: "Payment Failed",
    };
  }
};