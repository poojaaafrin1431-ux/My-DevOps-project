# Smart Calorie Tracking & Wellness

College mini project — Node.js + Express backend, SQLite database, plain HTML/CSS/JS frontend.

## Folder Structure

```
mini-project/
├── frontend/          → HTML pages, css/, js/
├── backend/            → server.js, routes/
├── database/            → db.js (creates wellness.db automatically)
├── package.json
├── Dockerfile
└── docker-compose.yml
```

## Modules

- Login / Signup (session-based — always opens on Login first)
- BMI + Calorie Calculator (BMR/TDEE, safe deficit)
- Food Tracker — day-wise calendar, calories **and protein**, auto-fill preview
- Weight Progress Graph + Crash Diet Red Alert
- Skin Type Quiz + Care Tips
- Exercise Recommendation by body area

## Run Locally (without Docker)

```
npm install
npm start
```

Then open: **http://localhost:3000**

First visit always lands on the Login page. Click "Sign Up" to create an account, then log in.
(Login uses `sessionStorage`, so closing the browser/tab logs you out automatically —
the app always asks to log in again on the next visit, as required.)

## Run With Docker (one command)

Make sure Docker Desktop is installed and running, then from the project folder:

```
docker compose up --build
```

Open **http://localhost:3000**. The SQLite database file is stored in the `database/` folder
on your machine (mounted as a volume), so your data survives container restarts.

To stop:
```
docker compose down
```

## Notes

- Passwords are hashed (SHA-256) before being stored — never stored in plain text.
- The database file `database/wellness.db` is created automatically on first run — do not create it manually.
- Protein values in the Food Tracker are approximate per typical serving, same as calories.
