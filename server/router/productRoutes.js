import express from "express";
import { createProduct, fetchAllProducts, updateProduct, deleteProduct, fetchSingleProduct, postProductReview, deleteReview, fetchAIFilteredProducts } from "../controllers/productController.js";
import { authorizedRoles, isAuthenticated} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create Product (Admin Only)
router.post("/admin/create", isAuthenticated, authorizedRoles("admin"), createProduct);

// Fetch All Products (Public)
router.get("/", fetchAllProducts);

// Update Product (Admin Only)
router.put("/admin/update/:productId", isAuthenticated, authorizedRoles("admin"), updateProduct);

// Delete Product (Admin Only)
router.delete("/admin/delete/:productId", isAuthenticated, authorizedRoles("admin"), deleteProduct);

// Fetch Single Product (Public)
router.get("/singleProduct/:productId", fetchSingleProduct);

// Post Product Review (Authenticated Users)
router.put("/post-new/review/:productId", isAuthenticated, postProductReview);

// Delete Product Review (Authenticated Users)
router.delete("/delete/review/:productId", isAuthenticated, deleteReview);

// AI Filtered Product
router.post("/ai-search", isAuthenticated, fetchAIFilteredProducts);

export default router;