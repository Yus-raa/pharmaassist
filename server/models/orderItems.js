import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const OrderItemSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4, // UUID primary key
    },

    order_id: {
      type: String,
      ref: "Order",
      required: true,
    },

    product_id: {
      type: String,
      ref: "Product",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true, // URL to product image
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0, // price per unit
    },

    total_price: {
      type: Number,
      required: true,
      min: 0, // price * quantity
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt
  }
);

// Indexes for faster queries
OrderItemSchema.index({ order_id: 1 });
OrderItemSchema.index({ product_id: 1 });

const OrderItem = mongoose.model("OrderItem", OrderItemSchema);
export default OrderItem;
