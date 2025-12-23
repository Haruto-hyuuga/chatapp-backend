import { Request, Response } from "express";
import pool from "../models/db";

export const fetchContacts = async (
  req: Request,
  res: Response
): Promise<any> => {
  let userId = null;
  if (req.user) {
    userId = req.user.id;
  }
  try {
    const result = await pool.query(
      `SELECT
    u.id AS contact_id,
    u.username,
    u.email
FROM contacts c
JOIN users u ON u.id = c.contact_id
WHERE c.user_id = $1
ORDER BY u.username ASC;`,
      [userId]
    );
    return res.json(result.rows);
  } catch (err) {
    console.error("❗ contactController.fetchContacts: ", err);
    res.status(500).json({ error: "Failed to fetch Contacts: " });
  }
};

export const addContacts = async (
  req: Request,
  res: Response
): Promise<any> => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const userId = req.user.id;
  const { contactEmail } = req.body;

  try {
    const contactResult = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      [contactEmail]
    );

    if (contactResult.rowCount === 0) {
      return res.status(404).json({ error: "Contact not found" });
    }

    const contactId = contactResult.rows[0].id;

    if (contactId === userId) {
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
      return res.status(409).json({
        error: "Contact already exists",
      });
    }

    return res.status(201).json({
      message: "Contact added successfully",
    });
  } catch (err: any) {
    console.error("❗ contactController.addContacts:", err);
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
