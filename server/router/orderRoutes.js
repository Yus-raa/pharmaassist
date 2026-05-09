import express from "express";
import { placeNewOrder, fetchSingleOrder, fetchMyOrders, fetchAllOrders, updateOrderStatus, deleteOrder, markOrderAsPaid } from "../controllers/orderController.js";
import { isAuthenticated, authorizedRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/new", isAuthenticated, placeNewOrder);
router.get("/:id", isAuthenticated, fetchSingleOrder);
router.get("/orders/me", isAuthenticated, fetchMyOrders);
router.get("/admin/getall", isAuthenticated, authorizedRoles("admin"), fetchAllOrders);
router.put("/admin/update/:id", isAuthenticated, authorizedRoles("admin"), updateOrderStatus);
router.delete("/admin/delete/:id", isAuthenticated, authorizedRoles("admin"), deleteOrder);
router.put("/payment-success/:id", isAuthenticated, markOrderAsPaid );

export default router;