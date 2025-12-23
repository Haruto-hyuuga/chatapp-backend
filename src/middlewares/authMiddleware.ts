import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { log, warn, error } from "../utils/logger";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];

  log("verifyToken called");

  if (!token) {
    warn("verifyToken failed: no token provided");
    res.status(403).json({ error: "No token Provided" });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_TOKEN || "DSP-chatapp-secretkey"
    );

    req.user = decoded as { id: string };

    log("verifyToken success", {
      userId: (decoded as any)?.id,
    });

    next();
  } catch (err) {
    error("authMiddleware.verifyToken failed", {
      err,
    });

    res.status(500).json({ error: "Invalid token." });
  }
};
