import { Request, Response } from "express";
import pool from "../models/db";
import { log, warn, error } from "../utils/logger";

export const fetchContacts = async (
  req: Request,
  res: Response
): Promise<any> => {
  let userId = null;

  if (req.user) {
    userId = req.user.id;
  }

  log("fetchContacts called", { userId });

  try {
    const result = await pool.query(
      `
      SELECT
        u.id AS contact_id,
        u.username,
        u.email,
        u.profile_url
      FROM contacts c
      JOIN users u ON u.id = c.contact_id
      WHERE c.user_id = $1
      ORDER BY u.username ASC;
      `,
      [userId]
    );

    log("fetchContacts success", {
      userId,
      count: result.rowCount,
    });

    return res.json(result.rows);
  } catch (err) {
    error("contactController.fetchContacts failed", {
      userId,
      err,
    });

    return res.status(500).json({
      error: "Failed to fetch Contacts",
    });
  }
};

export const addContacts = async (
  req: Request,
  res: Response
): Promise<any> => {
  if (!req.user) {
    warn("addContacts unauthorized access");
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = req.user.id;
  const { contactEmail } = req.body;

  log("addContacts called", { userId, contactEmail });

  try {
    const contactResult = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      [contactEmail]
    );

    if (contactResult.rowCount === 0) {
      warn("addContacts contact not found", {
        userId,
        contactEmail,
      });

      return res.status(404).json({ error: "Contact not found" });
    }

    const contactId = contactResult.rows[0].id;

    if (contactId === userId) {
      warn("addContacts self-add attempt", { userId });

      return res.status(400).json({
        error: "You cannot add yourself as a contact",
      });
    }

    const insertResult = await pool.query(
      `
      INSERT INTO contacts (user_id, contact_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
      RETURNING id
      `,
      [userId, contactId]
    );

    if (insertResult.rowCount === 0) {
      warn("addContacts duplicate contact", {
        userId,
        contactId,
      });

      return res.status(409).json({
        error: "Contact already exists",
      });
    }

    log("addContacts success", {
      userId,
      contactId,
    });

    return res.status(201).json({
      message: "Contact added successfully",
    });
  } catch (err: any) {
    error("contactController.addContacts failed", {
      userId,
      contactEmail,
      err,
    });

    if (err.code === "23514") {
      return res.status(400).json({
        error: "Invalid contact operation",
      });
    }

    return res.status(500).json({
      error: "Failed to add contact",
    });
  }
};
