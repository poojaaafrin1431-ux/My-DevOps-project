// ---------- Food Log Routes (Calendar Tracker + Protein) ----------
const express = require("express");
const db = require("../../database/db");

const router = express.Router();

router.post("/", (req, res) => {
  const { userId, day_number, meal_slot, food_name, calories, protein } = req.body;
  if (!userId || !day_number || !meal_slot || !food_name) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const stmt = db.prepare(
    "INSERT INTO food_logs (user_id, day_number, meal_slot, food_name, calories, protein) VALUES (?, ?, ?, ?, ?, ?)"
  );
  const result = stmt.run(userId, day_number, meal_slot, food_name, calories || 0, protein || 0);
  res.json({ success: true, id: result.lastInsertRowid });
});

router.get("/:userId", (req, res) => {
  const logs = db.prepare("SELECT * FROM food_logs WHERE user_id = ?").all(req.params.userId);
  res.json(logs);
});

router.delete("/:id", (req, res) => {
  db.prepare("DELETE FROM food_logs WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
