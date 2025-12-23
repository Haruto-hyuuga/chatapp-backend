import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import {
  checkOrCreateConversation,
  fetchAllConversationByuserId,
} from "../controllers/conversationController";

const router = Router();

router.get("/", verifyToken, fetchAllConversationByuserId);
router.post("/check-or-create", verifyToken, checkOrCreateConversation);

export default router;
