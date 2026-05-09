import express from "express";
import { placeNewOrder, fetchSingleOrder } from "../controllers/orderController.js";
import { isAuthenticated, authorizedRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/new", isAuthenticated, placeNewOrder);
router.get("/:id", isAuthenticated, fetchSingleOrder);


export default router;