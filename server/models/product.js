import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const ProductSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4, // UUID primary key
    },

    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },

    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    images: [
      {
        public_id: String,
        url: String
      }
    ],

    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    created_by: {
      type: String, // UUID of admin/creator
      ref: "User",
      required: true,
    },

    // AI features
    embeddings: {
      type: [Number], // for semantic search / AI recommendations
      default: null,
    },
  },
  {
    timestamps: true, // createdAt + updatedAt
  }
);

// Indexes
ProductSchema.index({ category: 1 });
ProductSchema.index({ name: "text", description: "text" }); // for text search

const Product = mongoose.model("Product", ProductSchema);
export default Product;
