import express from "express";
import {config} from "dotenv";
config({ path: "./config/config.env" });
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { error } from "console";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import authRouter from "./router/authRoutes.js";
import productRoutes from "./router/productRoutes.js";
import adminRouter from "./router/adminRoutes.js";
import Stripe from "stripe";
import Payment from "./models/payment.js";
import Order from "./models/orders.js";
import Product from "./models/product.js";
import orderRouter from "./router/orderRoutes.js";
import stripe from "./utils/stripe.js";
const app = express();

app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    })
);

// stripe webhook
app.post(
  "/api/v1/payment/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // PAYMENT SUCCESS
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;

      try {
        // Update Payment
        const payment = await Payment.findOneAndUpdate(
          { payment_intent_id: paymentIntent.id },
          { payment_status: "Paid" },
          { new: true }
        );

        if (!payment) {
          return res.status(404).send("Payment not found");
        }

        // Update Order
        const order = await Order.findByIdAndUpdate(
          payment.order_id,
          { paid_at: new Date() },
          { new: true }
        );

        if (!order) {
          return res.status(404).send("Order not found");
        }

        // Reduce stock
        for (const item of order.order_items) {
          await Product.findByIdAndUpdate(item.product_id, {
            $inc: { stock: -item.quantity },
          });
        }

      } catch (error) {
        console.error("Webhook Error:", error.message);
        return res.status(500).send("Webhook processing failed");
      }
    }

    res.status(200).json({ received: true });
  }
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
    fileUpload({
        tempFileDir: "./uploads",
        useTempFiles: true,
    })
);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/order", orderRouter);

app.use(errorMiddleware);

export default app;