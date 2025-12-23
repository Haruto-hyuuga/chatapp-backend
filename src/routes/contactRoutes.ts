import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import { addContacts, fetchContacts } from "../controllers/contactscontroller";

const router = Router();

router.get("/", verifyToken, fetchContacts);
router.post("/", verifyToken, addContacts);

export default router;
