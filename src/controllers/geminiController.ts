import { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { log, error } from "../utils/logger";
import pool from "../models/db";

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY ?? "AIzaSyBX1Azy2tJL98Uq4Un1NhVAAQ8X2TiotRc";
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const handleGeminiChat = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    log("STEP 1");
    const { prompt } = req.body;
    let userId = null;

    if (req.user) {
      userId = req.user.id;
    }

    if (!userId || !prompt) {
      res.status(400).json({ error: "User ID and Prompt are required" });
      return;
    }

    const userRes = await pool.query(
      "SELECT gemini_interaction_id FROM users WHERE id = $1",
      [userId]
    );
    const previousId = userRes.rows[0]?.gemini_interaction_id;

    const interaction = await ai.interactions.create({
      model: "gemini-2.5-flash",
      input: prompt,
      previous_interaction_id: previousId || undefined,
    });

    log(`Gemini response for User ${userId}: ${interaction}`);
    await pool.query(
      "UPDATE users SET gemini_interaction_id = $1 WHERE id = $2",
      [interaction.id, userId]
    );

    const textOutput = interaction.outputs?.find((o) => o.type === "text");

    res.status(200).json({
      success: true,
      message: textOutput?.text ?? null,
    });
  } catch (err: any) {
    error("Gemini Interaction Error:", err);
    res.status(500).json({ error: "Failed to process AI interaction" });
  }
};
