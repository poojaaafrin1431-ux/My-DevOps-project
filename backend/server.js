// ---------- Backend Server (Express + SQLite) ----------
const path = require("path");
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const weightRoutes = require("./routes/weight");
const foodRoutes = require("./routes/food");
const skinRoutes = require("./routes/skin");

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend (html/css/js) from the frontend folder
const FRONTEND_DIR = path.join(__dirname, "..", "frontend");
app.use(express.static(FRONTEND_DIR));

// API routes
app.use("/api", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/weight", weightRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/skin", skinRoutes);

// Fallback: serve login page for the root
app.get("/", (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "login.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
