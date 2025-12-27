const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const [companies] = await db.execute(
      "SELECT id, name FROM companies ORDER BY name"
    );
    res.json(companies);
  } catch (error) {
    console.error("Get companies error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

