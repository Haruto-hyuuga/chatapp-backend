import { Router } from "express";
import { handleGeminiChat } from "../controllers/geminiController";
import { verifyToken } from "../middlewares/authMiddleware";
const router = Router();

// Endpoint: POST /api/chat
router.post("/", verifyToken, handleGeminiChat);

export default router;
