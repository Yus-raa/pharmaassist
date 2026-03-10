// server/models/shippingInfo.js
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const shippingInfoSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },

    // Order ID (UUID)
    order_id: {
      type: String,
      ref: "Order",
      required: true,
      unique: true, // 1 order = 1 shipping info
    },

    full_name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },

    state: {
      type: String,
      required: [true, "State is required"],
    },

    city: {
      type: String,
      required: [true, "City is required"],
    },

    country: {
      type: String,
      required: [true, "Country is required"],
    },

    address: {
      type: String,
      required: [true, "Address is required"],
    },

    pincode: {
      type: String,
      required: [true, "Pincode is required"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
  },
  {
    timestamps: true,
  }
);

const ShippingInfo = mongoose.model("ShippingInfo", shippingInfoSchema);
export default ShippingInfo;
