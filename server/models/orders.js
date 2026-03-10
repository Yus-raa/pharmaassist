import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const OrderSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4, // UUID primary key
    },

    buyer_id: {
      type: String,
      ref: "User",
      required: true,
    },

    total_price: {
      type: Number,
      required: true,
      min: 0,
    },

    tax_price: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    shipping_price: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    order_status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },

    paid_at: {
      type: Date,
      default: null,
    },

    // Optional reference to payment (one-to-one)
    payment_id: {
      type: String,
      ref: "Payment",
      default: null,
    },

    // Optional reference to shipping info (one-to-one)
    shipping_info_id: {
      type: String,
      ref: "ShippingInfo",
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt
  }
);

// Index buyer_id for faster lookups
OrderSchema.index({ buyer_id: 1 });

const Order = mongoose.model("Order", OrderSchema);
export default Order;
