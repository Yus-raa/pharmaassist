import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const ReviewSchema = new mongoose.Schema(
  {
    id: {
        type: String,
        default: uuidv4,
    },

    product_id: {
      type: String,
      ref: "Product",
      required: true,
    },

    user_id: {
      type: String,
      ref: "User",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional: For AI pharmacy assistant semantic search
    embeddings: {
      type: [Number],
      default: null,
    },
  },
  {
    timestamps: true, // createdAt + updatedAt
  }
);

// Ensures one user cannot review the same product twice
ReviewSchema.index({ product_id: 1, user_id: 1 }, { unique: true });

const Review = mongoose.model("Review", ReviewSchema);

export default Review;
