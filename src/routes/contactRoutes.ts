import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import {
  addContacts,
  fetchContacts,
  recentContacts,
} from "../controllers/contactscontroller";

const router = Router();

router.get("/", verifyToken, fetchContacts);
router.post("/", verifyToken, addContacts);
router.get("/recent", verifyToken, recentContacts);

export default router;
