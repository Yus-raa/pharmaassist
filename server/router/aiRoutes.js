import express from "express";
import { pharmaChatAI } from "../controllers/aiController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/chat", isAuthenticated, pharmaChatAI);

export default router;