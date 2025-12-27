const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/db", async (req, res) => {
  try {
    const [result] = await db.execute("SELECT 1 as test");
    res.json({
      success: true,
      message: "Database connection successful",
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
      code: error.code,
    });
  }
});

router.get("/tables", async (req, res) => {
  try {
    const [tables] = await db.execute("SHOW TABLES");
    res.json({
      success: true,
      tables: tables.map((t) => Object.values(t)[0]),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tables",
      error: error.message,
    });
  }
});

module.exports = router;
