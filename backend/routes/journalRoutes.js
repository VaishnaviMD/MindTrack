import express from "express";

import Journal from "../models/Journal.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { mood, note } = req.body;

    if (!mood) {
      return res.status(400).json({ message: "Mood is required" });
    }

    const journal = new Journal({ mood, note });
    await journal.save();

    res.status(201).json(journal);
  } catch (error) {
    console.error("Failed to create journal entry:", error);
    res.status(500).json({ message: "Failed to create journal entry" });
  }
});

router.get("/", async (_req, res) => {
  try {
    const journals = await Journal.find().sort({ createdAt: -1 });
    res.json(journals);
  } catch (error) {
    console.error("Failed to fetch journal entries:", error);
    res.status(500).json({ message: "Failed to fetch journal entries" });
  }
});

export default router;

