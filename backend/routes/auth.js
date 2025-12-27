const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(404).json({ message: "Account not exist" });
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ message: "Login successful", user: userWithoutPassword });
  } catch (error) {
    console.error("Login error:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
    });
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Full name, email, and password are required" });
    }

    const [existingUsers] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      "INSERT INTO users (full_name, email, password, role, company_id) VALUES (?, ?, ?, ?, ?)",
      [full_name, email, hashedPassword, "admin", null]
    );

    res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
    });

    let errorMessage = "Internal server error";
    if (error.code === "ECONNREFUSED") {
      errorMessage =
        "Database connection refused. Please check if MySQL is running.";
    } else if (error.code === "ER_BAD_DB_ERROR") {
      errorMessage = "Database does not exist. Please run the schema.sql file.";
    } else if (error.code === "ER_ACCESS_DENIED_ERROR") {
      errorMessage =
        "Database access denied. Please check your .env credentials.";
    } else if (error.code === "ETIMEDOUT") {
      errorMessage =
        "Database connection timeout. Please check MySQL is running.";
    }

    res.status(500).json({
      message: errorMessage,
      error: error.message,
    });
  }
});

module.exports = router;
