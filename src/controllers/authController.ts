import { Request, Response } from "express";
import bcrypt from "bcrypt";
import pool from "../models/db";
import jwt from "jsonwebtoken";
import { log, warn, error } from "../utils/logger";
import { getRandomDefaultPfp } from "../services/imgbb";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "DSP-chatapp-secretkey";

export const register = async (req: Request, res: Response) => {
  log(" Register request received");

  if (!req.body) {
    warn("⚠️ Register failed: missing request body");
    return res.status(400).json({
      error: "Request body missing\nBackend failed to fetch requet body.",
    });
  }

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    warn("⚠️ Register failed: Missing fields", {
      usernamePresent: !!username,
      emailPresent: !!email,
      passwordPresent: !!password,
    });
    return res.status(400).json({
      error:
        "All fields are required\nMissing fields username || email || password",
    });
  }

  try {
    log("Hashing password");
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const profileUrl = getRandomDefaultPfp();

    log("Inserting user into database", { email });
    const result = await pool.query(
      `INSERT INTO users (username, email, password, profile_url)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [username, email, hashedPassword, profileUrl]
    );

    log("✅ User registered successfully", {
      userId: result.rows[0].id,
    });

    return res.status(200).json({
      message: "Account Created.",
    });
  } catch (err: any) {
    // PostgreSQL unique violation
    if (err.code === "23505") {
      warn("⚠️ Register failed: email already exists", { email });
      return res.status(409).json({
        error:
          "Email already registered for different account, try another email.",
      });
    }

    error("❌ authController.register: unexpected error", err);
    return res.status(500).json({
      error: "Failed to register user",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  log("Login request received");

  const { email, password } = req.body;

  if (!email || !password) {
    warn("⚠️ Login failed: missing credentials");
    return res.status(400).json({
      error:
        "Email and password required\nBackend Failed to fetch email and password.",
    });
  }

  try {
    log("Fetching user by email", { email });
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    const user = result.rows[0];

    if (!user) {
      warn("⚠️ Login failed: user not found", { email });
      return res.status(404).json({
        error:
          "USER_NOT_FOUND [DB]\nMake sure user has created account by registration page.",
      });
    }

    log("Comparing passwords", { userId: user.id });
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      warn("Login failed: invalid password", { userId: user.id });
      return res.status(401).json({
        error:
          "INVALID CREDENTIALS\nPassword and email do not match, check email and password again.",
      });
    }

    log("Generating JWT", { userId: user.id });
    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "10h",
    });

    log("✅ Login successful", { userId: user.id });

    return res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        profile_url: user.profile_url,
        email: user.email,
        token,
      },
    });
  } catch (err) {
    error("❌ authController.login: unexpected error", err);
    return res.status(500).json({ error: "Failed to log in" });
  }
};
