import { useState, useEffect } from "react";
import axios from "axios";

const AI_BASE_URL = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace("/journals", "")
  : "http://localhost:5000/api";

export default function AIAnalysis({ mood, note, onClose }) {
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.post(`${AI_BASE_URL}/ai/analyze-entry`, {
          mood,
          note,
        });
        setAnalysis(data);
      } catch (err) {
        const msg = err.response?.data?.message || "Could not get AI analysis.";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [mood, note]);

  return (
    <div className="relative mt-4 rounded-2xl overflow-hidden shadow-xl border border-purple-200 bg-gradient-to-br from-[#1a0533] via-[#2d0a5e] to-[#1a0533] p-6 text-white">
      {/* Glowing background orbs */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500 opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-base shadow-lg">
            ✨
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">AI Analysis</h3>
            <p className="text-purple-300 text-xs">Powered by Gemini</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-purple-300 hover:text-white transition-colors text-lg leading-none"
          title="Close"
        >
          ×
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center gap-3 py-6 relative z-10">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-purple-400"
                style={{
                  animation: `bounce 1.2s ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
          <p className="text-purple-300 text-sm">Gemini is reflecting on your mood…</p>
          <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }`}</style>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="rounded-xl bg-red-900/40 border border-red-500/30 p-4 text-sm text-red-300 relative z-10">
          {error}
        </div>
      )}

      {/* Analysis Result */}
      {analysis && !isLoading && (
        <div className="space-y-4 relative z-10">
          {/* Empathetic Response */}
          <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 p-4">
            <p className="text-white text-sm leading-relaxed">{analysis.response}</p>
          </div>

          {/* Self-care Tip */}
          <div className="rounded-xl bg-gradient-to-r from-purple-700/40 to-pink-700/40 border border-purple-500/30 p-4">
            <div className="flex items-start gap-2">
              <span className="text-lg mt-0.5">💡</span>
              <div>
                <p className="text-purple-200 text-xs font-semibold uppercase tracking-wider mb-1">Self-care tip</p>
                <p className="text-white text-sm">{analysis.tip}</p>
              </div>
            </div>
          </div>

          {/* Closing thought */}
          <p className="text-purple-300 text-xs italic text-center px-2">{analysis.closing}</p>
        </div>
      )}
    </div>
  );
}
