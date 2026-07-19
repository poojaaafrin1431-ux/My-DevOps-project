// ---------- Database Setup (SQLite) ----------
const path = require("path");
const Database = require("better-sqlite3");
const db = new Database(path.join(__dirname, "wellness.db"));

db.pragma("journal_mode = WAL");

// 1. Users table (Login/Signup)
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 2. Profile table (BMI/Calorie Module)
db.exec(`
  CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    age INTEGER, gender TEXT, height REAL, weight REAL,
    activity_level REAL, target_weight REAL,
    bmi REAL, bmr REAL, tdee REAL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

// 3. Weight logs table (Progress Graph)
db.exec(`
  CREATE TABLE IF NOT EXISTS weight_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    entry_date TEXT NOT NULL,
    weight REAL NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

// 4. Food logs table (Calendar Tracker) -- includes protein tracking
db.exec(`
  CREATE TABLE IF NOT EXISTS food_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    day_number INTEGER NOT NULL,
    meal_slot TEXT NOT NULL,
    food_name TEXT NOT NULL,
    calories INTEGER NOT NULL,
    protein REAL NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

// 5. Skin results table (Skin Type Quiz)
db.exec(`
  CREATE TABLE IF NOT EXISTS skin_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    skin_type TEXT NOT NULL,
    tested_on DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

module.exports = db;
