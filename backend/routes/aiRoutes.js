import express from "express";
import Journal from "../models/Journal.js";
import {
  analyzeEntry,
  analyzeMoodHistory,
  chatWithHistory,
} from "../services/geminiService.js";

const router = express.Router();

function handleAIError(error, res) {
  const errMsg = error.message || String(error);
  console.error("AI Error:", errMsg);

  if (errMsg.includes("GEMINI_API_KEY_NOT_SET")) {
    return res.status(503).json({
      message: "🔑 Please add your Gemini API key to backend/.env file to enable AI features.",
    });
  }

  if (errMsg.includes("503") || errMsg.includes("high demand") || errMsg.includes("UNAVAILABLE")) {
    return res.status(503).json({
      message: "⏳ Gemini 3.8 Flash is currently experiencing high demand. Please retry in a few moments.",
      isUnavailable: true,
    });
  }

  if (errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("exceeded")) {
    return res.status(429).json({
      message: "⚠️ Gemini API Quota Exceeded. You have hit the rate limit for this API key. Please try again in a few minutes or use a new key from Google AI Studio (https://aistudio.google.com).",
      isQuotaError: true,
    });
  }

  if (errMsg.includes("API_KEY_INVALID") || errMsg.includes("API key not valid") || errMsg.includes("401") || errMsg.includes("UNAUTHENTICATED")) {
    return res.status(401).json({
      message: "🔑 Invalid Gemini API key. Please update GEMINI_API_KEY in backend/.env with a valid key from Google AI Studio (https://aistudio.google.com).",
      isKeyError: true,
    });
  }

  if (errMsg.includes("400") || errMsg.includes("INVALID_ARGUMENT")) {
    return res.status(400).json({
      message: "Bad request sent to AI service.",
      error: errMsg,
    });
  }

  return res.status(500).json({
    message: "AI service error. Please check your API key and try again.",
    error: errMsg,
  });
}

// POST /api/ai/analyze-entry
router.post("/analyze-entry", async (req, res) => {
  try {
    const { mood, note } = req.body;

    if (!mood) {
      return res.status(400).json({ message: "Mood is required" });
    }

    const analysis = await analyzeEntry(mood, note || "");
    res.json(analysis);
  } catch (error) {
    handleAIError(error, res);
  }
});

// GET /api/ai/analyze-history
router.get("/analyze-history", async (req, res) => {
  try {
    const entries = await Journal.find().sort({ createdAt: -1 }).limit(30);

    if (entries.length === 0) {
      return res.status(400).json({ message: "No mood entries found. Start logging your moods first!" });
    }

    const report = await analyzeMoodHistory(entries);
    res.json(report);
  } catch (error) {
    handleAIError(error, res);
  }
});

// POST /api/ai/chat
router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const entries = await Journal.find().sort({ createdAt: -1 }).limit(15);
    const response = await chatWithHistory(message, entries);
    res.json({ response });
  } catch (error) {
    handleAIError(error, res);
  }
});

export default router;
