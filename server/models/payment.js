import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const PaymentSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4, // consistent UUID primary key
    },

    order_id: {
      type: String,      // keeping UUID style instead of ObjectId
      required: true,
      unique: true,      // one payment per order
    },

    payment_type: {
      type: String,
      enum: ["Online"],  // SQL constraint
      required: true,
    },

    payment_status: {
      type: String,
      enum: ["Paid", "Pending", "Failed"],
      required: true,
      default: "Pending",
    },

    payment_intent_id: {
      type: String,
      unique: true,
      sparse: true, // allows null
    },
  },
  {
    timestamps: true, // createdAt + updatedAt
  }
);

const Payment = mongoose.model("Payment", PaymentSchema);

export default Payment;
