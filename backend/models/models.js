import { db } from "../db.js";

export const findUserByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT id, full_name, email, password, role, company_id FROM users WHERE email = ?",
    [email]
  );
  return rows[0];
};

export const createAdminUser = async (full_name, email, hashedPassword) => {
  await db.query(
    `
    INSERT INTO users (full_name, email, password, role, company_id)
    VALUES (?, ?, ?, 'admin', NULL)
    `,
    [full_name, email, hashedPassword]
  );
};
