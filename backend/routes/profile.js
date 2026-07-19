// ---------- Profile Routes (BMI / Calorie Module) ----------
const express = require("express");
const db = require("../../database/db");

const router = express.Router();

router.post("/", (req, res) => {
  const { userId, age, gender, height, weight, activity_level, target_weight, bmi, bmr, tdee } = req.body;
  if (!userId) return res.status(400).json({ error: "userId is required" });

  const existing = db.prepare("SELECT id FROM profile WHERE user_id = ?").get(userId);

  if (existing) {
    db.prepare(`
      UPDATE profile SET age=?, gender=?, height=?, weight=?, activity_level=?, target_weight=?, bmi=?, bmr=?, tdee=?, updated_at=CURRENT_TIMESTAMP
      WHERE user_id=?
    `).run(age, gender, height, weight, activity_level, target_weight, bmi, bmr, tdee, userId);
  } else {
    db.prepare(`
      INSERT INTO profile (user_id, age, gender, height, weight, activity_level, target_weight, bmi, bmr, tdee)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(userId, age, gender, height, weight, activity_level, target_weight, bmi, bmr, tdee);
  }
  res.json({ success: true });
});

router.get("/:userId", (req, res) => {
  const profile = db.prepare("SELECT * FROM profile WHERE user_id = ?").get(req.params.userId);
  res.json(profile || null);
});

module.exports = router;
