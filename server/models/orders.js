import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const orderItemSchema = new mongoose.Schema({
  product_id: {
    type: String,
    ref: "Product",
    required: true,
  },
  name: {
    type: String, // snapshot (important)
    required: true,
  },
  price: {
    type: Number, // snapshot price at time of order
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const OrderSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },

    buyer_id: {
      type: String,
      ref: "User",
      required: true,
    },

    // CORE: items inside order
    order_items: [orderItemSchema],

    total_price: {
      type: Number,
      required: true,
      min: 0,
    },

    tax_price: {
      type: Number,
      default: 0,
    },

    shipping_price: {
      type: Number,
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

    payment_id: {
      type: String,
      ref: "Payment",
      default: null,
    },

    shipping_info_id: {
      type: String,
      ref: "ShippingInfo",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
OrderSchema.index({ buyer_id: 1 });
OrderSchema.index({ createdAt: 1 });
OrderSchema.index({ paid_at: 1 });

const Order = mongoose.model("Order", OrderSchema);

export default Order;