// ---------- Weight Log Routes (Progress Graph) ----------
const express = require("express");
const db = require("../../database/db");

const router = express.Router();

router.post("/", (req, res) => {
  const { userId, entry_date, weight } = req.body;
  if (!userId || !entry_date || !weight) {
    return res.status(400).json({ error: "userId, entry_date and weight are required" });
  }
  const result = db.prepare("INSERT INTO weight_logs (user_id, entry_date, weight) VALUES (?, ?, ?)").run(userId, entry_date, weight);
  res.json({ success: true, id: result.lastInsertRowid });
});

router.get("/:userId", (req, res) => {
  const logs = db.prepare("SELECT * FROM weight_logs WHERE user_id = ? ORDER BY entry_date ASC").all(req.params.userId);
  res.json(logs);
});

router.delete("/:id", (req, res) => {
  db.prepare("DELETE FROM weight_logs WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
