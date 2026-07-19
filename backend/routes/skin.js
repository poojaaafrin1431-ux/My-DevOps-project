// ---------- Skin Result Routes ----------
const express = require("express");
const db = require("../../database/db");

const router = express.Router();

router.post("/", (req, res) => {
  const { userId, skin_type } = req.body;
  if (!userId || !skin_type) {
    return res.status(400).json({ error: "userId and skin_type are required" });
  }
  db.prepare("INSERT INTO skin_results (user_id, skin_type) VALUES (?, ?)").run(userId, skin_type);
  res.json({ success: true });
});

router.get("/:userId", (req, res) => {
  const result = db.prepare("SELECT * FROM skin_results WHERE user_id = ? ORDER BY tested_on DESC").get(req.params.userId);
  res.json(result || null);
});

module.exports = router;
