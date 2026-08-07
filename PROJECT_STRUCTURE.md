# MindTrack Project Structure

## 📁 Complete File Structure

```
MindTrack/
│
├── backend/                          # Backend API Server
│   ├── models/
│   │   └── Journal.js                # MongoDB schema for mood entries
│   ├── routes/
│   │   └── journalRoutes.js          # API routes (GET, POST)
│   ├── server.js                     # Express server & MongoDB connection
│   ├── seed.js                       # Optional: Seed data script
│   ├── package.json                  # Backend dependencies
│   └── .env                          # Environment variables (create this)
│
├── frontend/                         # React Frontend Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── MoodForm.jsx          # Form to add mood entries
│   │   │   └── MoodList.jsx          # Display mood history
│   │   ├── utils/
│   │   │   └── moodHelper.js         # Mood descriptions & emojis
│   │   ├── App.js                    # Main app component
│   │   ├── index.js                  # React entry point
│   │   └── index.css                 # TailwindCSS styles
│   ├── public/                       # Static files
│   ├── tailwind.config.js            # TailwindCSS configuration
│   ├── postcss.config.js             # PostCSS configuration
│   └── package.json                  # Frontend dependencies
│
├── SETUP_INSTRUCTIONS.md             # Setup guide
├── START_MONGODB.bat                 # MongoDB startup helper (Windows)
└── PROJECT_STRUCTURE.md              # This file

```

## ✅ File Verification Checklist

### Backend Files
- ✅ `backend/server.js` - Express server
- ✅ `backend/models/Journal.js` - MongoDB model
- ✅ `backend/routes/journalRoutes.js` - API routes
- ✅ `backend/seed.js` - Seed data script
- ✅ `backend/package.json` - Dependencies

### Frontend Files
- ✅ `frontend/src/App.js` - Main component
- ✅ `frontend/src/components/MoodForm.jsx` - Mood input form
- ✅ `frontend/src/components/MoodList.jsx` - Mood history display
- ✅ `frontend/src/utils/moodHelper.js` - Mood helper utilities
- ✅ `frontend/src/index.js` - React entry point
- ✅ `frontend/src/index.css` - TailwindCSS styles
- ✅ `frontend/tailwind.config.js` - Tailwind config
- ✅ `frontend/package.json` - Dependencies

### Configuration Files
- ✅ `SETUP_INSTRUCTIONS.md` - Setup guide
- ✅ `START_MONGODB.bat` - MongoDB helper script

### ⚠️ Files You Need to Create

1. **`backend/.env`** - Create this file with:
   ```
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/mindtrack
   ```

## 📦 Key Features by File

### Backend
- **server.js**: Connects to MongoDB, sets up Express routes
- **Journal.js**: Defines mood entry schema (mood, note, date)
- **journalRoutes.js**: Handles GET (all entries) and POST (new entry)

### Frontend
- **MoodForm.jsx**: Interactive form with quick mood buttons and live preview
- **MoodList.jsx**: Displays entries with emojis, descriptions, and stats
- **moodHelper.js**: Provides mood descriptions, emojis, and color coding
- **App.js**: Main container with gradient background

## 🚀 All Files Are Saved and Ready!

All project files are properly organized and saved in their correct locations.







