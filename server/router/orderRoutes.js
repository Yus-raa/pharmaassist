import express from "express";
import { placeNewOrder } from "../controllers/orderController.js";
import { isAuthenticated, authorizedRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/new", isAuthenticated, placeNewOrder);

export default router;