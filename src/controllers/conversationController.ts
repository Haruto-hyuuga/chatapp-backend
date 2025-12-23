import pool from "../models/db";
import { Request, Response } from "express";

export const fetchAllConversationByuserId = async (
  req: Request,
  res: Response
) => {
  let userId = null;
  if (req.user) {
    userId = req.user.id;
  }

  try {
    const result = await pool.query(
      `
      SELECT
    c.id AS conversation_id,
    CASE
        WHEN u1.id = $1 THEN u2.username
        ELSE u1.username
    END AS participant_name,
    m.content AS last_message,
    m.created_at AS last_message_time
FROM conversations c
JOIN users u1 ON u1.id = c.participant_one
JOIN users u2 ON u2.id = c.participant_two
LEFT JOIN LATERAL (
    SELECT content, created_at
    FROM messages
    WHERE conversation_id = c.id
    ORDER BY created_at DESC
    LIMIT 1
) m ON true
WHERE $1 IN (c.participant_one, c.participant_two)
ORDER BY m.created_at DESC NULLS LAST;
            `,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❗ conversationController.fetchall: ", err);
    res.status(500).json({ error: "Failed to fetch messages: " });
  }
};

export const checkOrCreateConversation = async (
  req: Request,
  res: Response
): Promise<any> => {
  let userId = null;
  if (req.user) {
    userId = req.user.id;
  }
  const { contactId } = req.body;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: No user id" });
  }

  if (!contactId) {
    return res.status(400).json({ error: "contactId is required" });
  }

  if (userId === contactId) {
    return res
      .status(400)
      .json({ error: "Cannot create conversation with yourself" });
  }

  try {
    const existingConversation = await pool.query(
      `
      SELECT id FROM conversations
      WHERE (participant_one = $1 AND participant_two = $2)
      OR (participant_one = $2 AND participant_two = $1)
      LIMIT 1;`,
      [userId, contactId]
    );

    if (
      existingConversation.rowCount != null &&
      existingConversation.rowCount! > 0
    ) {
      return res.json({ conversationId: existingConversation.rows[0].id });
    }

    const newConversation = await pool.query(
      `
      INSERT INTO conversations (participant_one, participant_two)
      VALUES ($1,$2)
      RETURNING id;`,
      [userId, contactId]
    );
    return res.json({ conversationId: newConversation.rows[0].id });
  } catch (err) {
    console.error("❗ conversationController.checkOrCreateConversation: ", err);
    res.status(500).json({
      error: "Failed to check or create conversation between two users",
    });
  }
};
