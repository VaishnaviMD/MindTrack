import { useState } from "react";
import axios from "axios";
import { quickMoods, getMoodInfo } from "../utils/moodHelper";
import AIAnalysis from "./AIAnalysis";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api/journals";

export default function MoodForm({ onAdded }) {
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submittedEntry, setSubmittedEntry] = useState(null);

  const moodInfo = getMoodInfo(mood);

  const resetForm = () => {
    setMood("");
    setNote("");
    setError("");
  };

  const handleQuickMoodClick = (moodValue) => {
    setMood(moodValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!mood.trim()) {
      setError("Please describe your mood.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await axios.post(
        API_BASE_URL,
        {
          mood: mood.trim(),
          note: note.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Store the submitted mood/note for AI analysis before resetting
      setSubmittedEntry({ mood: mood.trim(), note: note.trim() });
      resetForm();
      onAdded?.();
    } catch (err) {
      console.error("Failed to save mood entry:", err);
      setError("Could not save your entry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-6 space-y-5"
      >
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            How are you feeling? 💭
          </label>
          
          {/* Quick Mood Buttons */}
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-2">Quick select:</p>
            <div className="flex flex-wrap gap-2">
              {quickMoods.map((quickMood) => (
                <button
                  key={quickMood.value}
                  type="button"
                  onClick={() => handleQuickMoodClick(quickMood.value)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                    mood.toLowerCase() === quickMood.value
                      ? "bg-blue-100 border-blue-400 text-blue-700 font-semibold"
                      : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {quickMood.label}
                </button>
              ))}
            </div>
          </div>

          <input
            type="text"
            value={mood}
            onChange={(event) => setMood(event.target.value)}
            placeholder="Or type your mood here (e.g., happy, anxious, excited...)"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />

          {/* Mood Description Preview */}
          {moodInfo && mood.trim() && (
            <div className={`mt-3 p-3 rounded-lg border ${moodInfo.bgColor} ${moodInfo.borderColor}`}>
              <div className="flex items-start gap-2">
                <span className="text-2xl">{moodInfo.emoji}</span>
                <div>
                  <p className={`text-sm font-medium ${moodInfo.textColor}`}>
                    {moodInfo.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Add a note (optional) 📝
          </label>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="What's on your mind? Share more details about how you're feeling..."
            rows={4}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
          />
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !mood.trim()}
          className="w-full inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-semibold text-white shadow-md hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-400 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <span className="mr-2">✨</span>
              Save Mood Entry
            </>
          )}
        </button>
      </form>

      {/* AI Analysis appears after submission */}
      {submittedEntry && (
        <AIAnalysis
          mood={submittedEntry.mood}
          note={submittedEntry.note}
          onClose={() => setSubmittedEntry(null)}
        />
      )}
    </div>
  );
}
