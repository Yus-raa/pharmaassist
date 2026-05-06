import express from 'express';
import {getAllUsers, deleteUser, dashboardStats} from "../controllers/adminController.js";
import {isAuthenticated, authorizedRoles} from "../middlewares/authMiddleware.js";


const router = express.Router();

// Dashboard - Get All Users (Admin Only)
router.get("/getallusers", isAuthenticated, authorizedRoles("admin"), getAllUsers);
router.delete("/delete/:id", isAuthenticated, authorizedRoles("admin"), deleteUser);
router.get("/fetch/dashboard-stats", isAuthenticated, authorizedRoles("admin"), dashboardStats);
export default router;