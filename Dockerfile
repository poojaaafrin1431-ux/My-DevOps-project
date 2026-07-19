# ---------- Smart Calorie Tracking & Wellness — Dockerfile ----------
FROM node:20-slim

# better-sqlite3 needs build tools to compile its native addon
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json ./
RUN npm install --omit=dev

# Copy the rest of the project
COPY backend ./backend
COPY frontend ./frontend
COPY database ./database

# The SQLite database file will be created inside /app/database/wellness.db
EXPOSE 3000

CMD ["node", "backend/server.js"]
