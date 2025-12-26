import { Router } from "express";
import {
  register,
  login,
  validateLoginToken,
} from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/validate", validateLoginToken);

export default router;
