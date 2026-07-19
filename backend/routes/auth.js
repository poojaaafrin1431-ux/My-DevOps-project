// ---------- Auth Routes (Signup / Login) ----------
const express = require("express");
const crypto = require("crypto");
const db = require("../../database/db");

const router = express.Router();

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Signup
router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const hashed = hashPassword(password);
    const stmt = db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    const result = stmt.run(name, email, hashed);
    res.json({ success: true, userId: result.lastInsertRowid, name });
  } catch (err) {
    if (err.message.includes("UNIQUE")) {
      res.status(400).json({ error: "Email already registered" });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  const hashed = hashPassword(password);
  const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, hashed);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  res.json({ success: true, userId: user.id, name: user.name });
});

module.exports = router;
