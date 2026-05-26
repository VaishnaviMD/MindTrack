import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import journalRoutes from "./routes/journalRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const DEFAULT_MONGO_URI = "mongodb://127.0.0.1:27017/mindtrack";
const MONGO_URI = process.env.MONGO_URI || DEFAULT_MONGO_URI;

if (!process.env.MONGO_URI) {
  console.log(`MONGO_URI not set. Falling back to ${DEFAULT_MONGO_URI}`);
}

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("MindTrack API running");
});

app.use("/api/journals", journalRoutes);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

