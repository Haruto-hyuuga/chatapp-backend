import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import { fetchAllConversationByuserId } from "../controllers/conversationController";

const router = Router();

router.get("/", verifyToken, fetchAllConversationByuserId);

export default router;
