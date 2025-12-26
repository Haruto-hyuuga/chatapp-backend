import { Request, Response } from "express";
import pool from "../models/db";
import { log, warn, error } from "../utils/logger";

export const fetchAllMessagesByConversationId = async (
  req: Request,
  res: Response
) => {
  const { conversationId } = req.params;

  log("fetchAllMessagesByConversationId called", { conversationId });

  try {
    const result = await pool.query(
      `
      SELECT m.id, m.content, m.sender_id, m.conversation_id, m.created_at
      FROM messages m
      WHERE m.conversation_id = $1
      ORDER BY m.created_at ASC;
      `,
      [conversationId]
    );

    log("fetchAllMessagesByConversationId success", {
      conversationId,
      count: result.rowCount,
    });

    return res.status(200).json(result.rows);
  } catch (err) {
    error("messagesController.fetchAllMessagesByConversationId failed", {
      conversationId,
      err,
    });

    return res.status(500).json({
      error: "MessagController: Failed to fetch messages in conversations.",
    });
  }
};

export const saveMessage = async (
  conversationId: string,
  senderId: string,
  content: string
) => {
  log("saveMessage called", {
    conversationId,
    senderId,
    contentLength: content?.length,
  });

  try {
    const result = await pool.query(
      `
      INSERT INTO messages (conversation_id, sender_id, content)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [conversationId, senderId, content]
    );

    log("saveMessage success", {
      messageId: result.rows[0]?.id,
      conversationId,
      senderId,
    });

    return result.rows[0];
  } catch (err) {
    error("messagesController.saveMessage failed", {
      conversationId,
      senderId,
      err,
    });

    throw new Error("MessagController: Failed to insert messages.");
  }
};
