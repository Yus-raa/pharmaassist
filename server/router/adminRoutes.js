import express from 'express';
import {getAllUsers} from "../controllers/adminController.js";
import {isAuthenticated, authorizedRoles} from "../middlewares/authMiddleware.js";


const router = express.Router();

// Dashboard - Get All Users (Admin Only)
router.get("/getallusers", isAuthenticated, authorizedRoles("admin"), getAllUsers);


export default router;