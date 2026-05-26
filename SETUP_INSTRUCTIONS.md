# MindTrack Setup Instructions

## Step 1: Install and Start MongoDB

### Quick Install (Recommended)

1. **Download MongoDB Community Server:**
   - Visit: https://www.mongodb.com/try/download/community
   - Select: **Windows** → **MSI** → Download
   - Run the installer

2. **During Installation:**
   - Choose "Complete" installation
   - ✅ Check "Install MongoDB as a Service" (this auto-starts MongoDB)
   - Use default settings (port 27017)

3. **Verify MongoDB is Running:**
   - Press `Win + R`, type `services.msc`, press Enter
   - Look for "MongoDB" service
   - Status should be "Running"
   - If not running, right-click → Start

### Alternative: MongoDB Compass (GUI)

1. Download: https://www.mongodb.com/try/download/compass
2. Install and open Compass
3. Connect to: `mongodb://127.0.0.1:27017`
4. If connection works, MongoDB is running!

### Manual Start (if not installed as service)

If MongoDB is installed but not running as a service:

1. Create data directory: `C:\data\db` (or any path you prefer)
2. Open Command Prompt as Administrator
3. Navigate to MongoDB bin folder (usually `C:\Program Files\MongoDB\Server\[version]\bin`)
4. Run: `mongod --dbpath C:\data\db`

---

## Step 2: Start Backend Server

```bash
cd backend
npm install
npm run dev
```

You should see: `MongoDB connected` and `Server running on port 5000`

---

## Step 3: Start Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm start
```

Browser will open at `http://localhost:3000`

---

## Troubleshooting

**"MongoDB connection error"**
- Make sure MongoDB service is running (check Services)
- Verify MongoDB is installed correctly

**"Port 5000 already in use"**
- Change `PORT` in `backend/server.js` or use a different port

**"Cannot connect to MongoDB"**
- Default connection: `mongodb://127.0.0.1:27017/mindtrack`
- Make sure MongoDB is listening on port 27017

---

## No Manual Data Entry Needed!

- No API keys required
- No external services needed
- Everything runs locally
- Just install MongoDB and start both servers!

