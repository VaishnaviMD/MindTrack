import { useEffect, useState } from "react";
import axios from "axios";
import { getMoodInfo } from "../utils/moodHelper";
import { formatDate } from "../utils/formatDate";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api/journals";



export default function MoodList({ refreshKey }) {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEntries = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await axios.get(API_BASE_URL);
        setEntries(response.data);
      } catch (err) {
        console.error("Failed to fetch entries:", err);
        setError("Could not load mood history. Please refresh.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, [refreshKey]);

  // Calculate mood stats
  const moodStats = entries.reduce((acc, entry) => {
    const moodInfo = getMoodInfo(entry.mood);
    const moodType = moodInfo?.color || "unknown";
    acc[moodType] = (acc[moodType] || 0) + 1;
    return acc;
  }, {});

  return (
    <section className="mt-6">
      <header className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Your Mood History 📊
          </h2>
          {entries.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {entries.length} {entries.length === 1 ? "entry" : "entries"} tracked
            </p>
          )}
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading…
          </div>
        )}
      </header>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 mb-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Mood Stats Summary */}
      {entries.length > 0 && Object.keys(moodStats).length > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Mood Overview</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(moodStats).map(([color, count]) => (
              <span
                key={color}
                className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border border-gray-200"
              >
                {color.charAt(0).toUpperCase() + color.slice(1)}: {count}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {entries.length === 0 && !isLoading ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
            <div className="text-4xl mb-3">📔</div>
            <p className="text-gray-600 font-medium mb-1">No entries yet</p>
            <p className="text-sm text-gray-500">
              Share how you feel to start your mood journal journey!
            </p>
          </div>
        ) : (
          entries.map((entry) => {
            const moodInfo = getMoodInfo(entry.mood);
            return (
              <article
                key={entry._id}
                className={`bg-white rounded-xl border-2 ${moodInfo?.borderColor || "border-gray-200"} p-5 shadow-md hover:shadow-lg transition-all transform hover:scale-[1.01]`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="text-4xl">{moodInfo?.emoji || "😐"}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`text-xl font-bold ${moodInfo?.textColor || "text-gray-800"}`}>
                          {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
                        </h3>
                      </div>
                      {moodInfo?.description && (
                        <p className={`text-sm ${moodInfo?.textColor || "text-gray-600"} mb-2 italic`}>
                          {moodInfo.description}
                        </p>
                      )}
                      {entry.note && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {entry.note}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <time className="text-xs text-gray-400 whitespace-nowrap">
                    {formatDate(entry.createdAt || entry.date)}
                  </time>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

