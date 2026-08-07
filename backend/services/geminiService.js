import { GoogleGenAI } from "@google/genai";

const SYSTEM_CONTEXT = `You are a compassionate and thoughtful mental health companion integrated into MindTrack, a mood journaling app. 
Your role is to:
- Provide warm, empathetic responses to how users are feeling
- Identify mood patterns and potential mental health insights from their history
- Offer practical, evidence-based self-care suggestions
- Recommend professional help (therapist/doctor) when patterns suggest it would be beneficial
- NEVER diagnose conditions, only observe patterns and offer gentle suggestions
- Always maintain a supportive, non-judgmental tone
- Keep responses concise but meaningful`;

function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    throw new Error("GEMINI_API_KEY_NOT_SET");
  }
  return new GoogleGenAI({ apiKey });
}

/**
 * Analyzes a single mood entry and returns immediate feedback
 */
export async function analyzeEntry(mood, note) {
  const ai = getAIClient();

  const prompt = `${SYSTEM_CONTEXT}

A user just logged that they are feeling: "${mood}"
${note ? `They added this note: "${note}"` : "They did not add a note."}

Please provide:
1. A warm, empathetic 2-3 sentence response acknowledging their feeling
2. One specific, actionable self-care tip for right now (1 sentence)
3. A brief encouraging closing thought (1 sentence)

Format your response as a JSON object with these exact keys:
{
  "response": "your empathetic response here",
  "tip": "your self-care tip here",
  "closing": "your closing thought here"
}

Only return valid JSON, no markdown, no extra text.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    const text = response.text.trim();
    const cleaned = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Gemini analyzeEntry error:", error);
    throw new Error(error.message || String(error));
  }
}

/**
 * Analyzes mood history and returns a comprehensive mental health report
 */
export async function analyzeMoodHistory(entries) {
  const ai = getAIClient();

  const formattedEntries = entries
    .slice(0, 30)
    .map((e) => {
      const date = new Date(e.createdAt || e.date).toLocaleDateString("en-IN", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      return `${date}: Mood="${e.mood}"${e.note ? `, Note="${e.note.substring(0, 100)}"` : ""}`;
    })
    .join("\n");

  const prompt = `${SYSTEM_CONTEXT}

Here is a user's mood history (most recent first):
${formattedEntries}

Based on this mood history, please provide a comprehensive mental health analysis.

Format your response as a JSON object with these exact keys:
{
  "summary": "A warm 3-4 sentence overall mental health summary based on their mood patterns",
  "patterns": ["pattern 1 (e.g. 'You tend to feel anxious on weekdays')", "pattern 2", "pattern 3"],
  "positives": ["positive thing noticed 1", "positive thing noticed 2"],
  "suggestions": [
    { "title": "Suggestion title", "description": "Detailed description of the suggestion" },
    { "title": "Suggestion title", "description": "Detailed description" },
    { "title": "Suggestion title", "description": "Detailed description" }
  ],
  "riskLevel": "green|yellow|red",
  "riskReason": "Brief explanation of the risk level",
  "doctorRecommendation": true|false,
  "doctorReason": "If doctorRecommendation is true, explain why gently and non-alarmingly. If false, empty string.",
  "weeklyMoodSummary": "One sentence summary of the most recent week's moods"
}

Risk level guide:
- green: Generally positive or stable mood patterns, no concerning trends
- yellow: Some concerning patterns (repeated negative moods, stress indicators) but not severe
- red: Persistent severe negative moods (5+ consecutive days of very low mood, hopelessness, etc.)

Only return valid JSON, no markdown, no extra text.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    const text = response.text.trim();
    const cleaned = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Gemini analyzeMoodHistory error:", error);
    throw new Error(error.message || String(error));
  }
}

/**
 * Context-aware chat using the user's mood history
 */
export async function chatWithHistory(userMessage, entries) {
  const ai = getAIClient();

  const recentMoods = entries
    .slice(0, 15)
    .map((e) => {
      const date = new Date(e.createdAt || e.date).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      });
      return `${date}: ${e.mood}${e.note ? ` (${e.note.substring(0, 60)})` : ""}`;
    })
    .join("; ");

  const prompt = `${SYSTEM_CONTEXT}

This user's recent mood history: ${recentMoods || "No entries yet."}

The user is asking you: "${userMessage}"

Please respond in a warm, conversational, and helpful way. Use their mood history to personalize your response where relevant. Keep your response to 3-5 sentences max. If they ask something outside of mental wellness, gently redirect them to mental health topics.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini chat error:", error);
    throw new Error(error.message || String(error));
  }
}
