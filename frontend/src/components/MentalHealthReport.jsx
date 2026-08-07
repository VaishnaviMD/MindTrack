import { useState } from "react";
import axios from "axios";

const AI_BASE_URL = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace("/journals", "")
  : "http://localhost:5000/api";

const RISK_CONFIG = {
  green: {
    label: "Good",
    icon: "💚",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
    borderColor: "border-emerald-500/30",
    barColor: "bg-emerald-500",
    glow: "shadow-emerald-500/30",
  },
  yellow: {
    label: "Moderate",
    icon: "💛",
    color: "text-amber-400",
    bgColor: "bg-amber-500/20",
    borderColor: "border-amber-500/30",
    barColor: "bg-amber-500",
    glow: "shadow-amber-500/30",
  },
  red: {
    label: "Needs Attention",
    icon: "❤️",
    color: "text-rose-400",
    bgColor: "bg-rose-500/20",
    borderColor: "border-rose-500/30",
    barColor: "bg-rose-500",
    glow: "shadow-rose-500/30",
  },
};

export default function MentalHealthReport() {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchReport = async () => {
    setIsLoading(true);
    setError("");
    try {
      const { data } = await axios.get(`${AI_BASE_URL}/ai/analyze-history`);
      setReport(data);
      setHasLoaded(true);
    } catch (err) {
      const msg = err.response?.data?.message || "Could not generate report.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const risk = report ? RISK_CONFIG[report.riskLevel] || RISK_CONFIG.green : null;

  return (
    <div className="space-y-6">
      {/* Header + Generate Button */}
      <div className="rounded-2xl bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-6 shadow-xl border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">🧠 Mental Health Report</h2>
            <p className="text-purple-300 text-sm mt-1">
              AI-powered analysis of your mood patterns
            </p>
          </div>
          <button
            onClick={fetchReport}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing…
              </>
            ) : (
              <>✨ {hasLoaded ? "Refresh" : "Generate"} Analysis</>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-red-900/40 border border-red-500/30 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Initial state - no report yet */}
      {!report && !isLoading && !error && (
        <div className="rounded-2xl border-2 border-dashed border-purple-700/40 p-10 text-center">
          <div className="text-5xl mb-4">🔮</div>
          <p className="text-gray-400 font-medium">Click "Generate Analysis" to get your personalized mental health report</p>
          <p className="text-gray-500 text-sm mt-2">Powered by Google Gemini AI based on your mood history</p>
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl bg-white/5 border border-white/10 p-6 h-28" />
          ))}
        </div>
      )}

      {/* Report Content */}
      {report && !isLoading && (
        <div className="space-y-5">
          {/* Risk Level Badge */}
          <div className={`rounded-2xl border ${risk.borderColor} ${risk.bgColor} p-5 flex items-center gap-4 shadow-lg ${risk.glow}`}>
            <div className="text-4xl">{risk.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-bold text-lg ${risk.color}`}>Mental Wellness: {risk.label}</span>
              </div>
              <p className="text-gray-300 text-sm">{report.riskReason}</p>
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-2xl bg-gradient-to-br from-[#1a1040] to-[#0d0820] border border-purple-800/40 p-6 shadow-lg">
            <h3 className="text-purple-300 text-xs font-bold uppercase tracking-widest mb-3">📋 Overall Summary</h3>
            <p className="text-gray-200 text-sm leading-relaxed">{report.summary}</p>
            {report.weeklyMoodSummary && (
              <div className="mt-3 pt-3 border-t border-purple-800/40">
                <p className="text-purple-400 text-xs italic">{report.weeklyMoodSummary}</p>
              </div>
            )}
          </div>

          {/* Patterns & Positives — Side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Patterns */}
            {report.patterns?.length > 0 && (
              <div className="rounded-2xl bg-gradient-to-br from-[#1a0533] to-[#0d0820] border border-purple-800/40 p-5 shadow-lg">
                <h3 className="text-purple-300 text-xs font-bold uppercase tracking-widest mb-3">🔍 Detected Patterns</h3>
                <ul className="space-y-2">
                  {report.patterns.map((pattern, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-purple-400 mt-0.5">▸</span>
                      {pattern}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Positives */}
            {report.positives?.length > 0 && (
              <div className="rounded-2xl bg-gradient-to-br from-[#001a0d] to-[#0d0820] border border-emerald-800/40 p-5 shadow-lg">
                <h3 className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-3">🌱 What's Going Well</h3>
                <ul className="space-y-2">
                  {report.positives.map((pos, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-emerald-400 mt-0.5">✓</span>
                      {pos}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Suggestions */}
          {report.suggestions?.length > 0 && (
            <div className="rounded-2xl bg-gradient-to-br from-[#1a1040] to-[#0d0820] border border-purple-800/40 p-6 shadow-lg">
              <h3 className="text-purple-300 text-xs font-bold uppercase tracking-widest mb-4">💡 Personalized Suggestions</h3>
              <div className="space-y-4">
                {report.suggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5 shadow">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{s.title}</p>
                      <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{s.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Doctor Recommendation */}
          {report.doctorRecommendation && (
            <div className="rounded-2xl bg-gradient-to-br from-[#1a0010] to-[#0d0820] border border-rose-800/50 p-6 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="text-3xl">🩺</div>
                <div>
                  <h3 className="text-rose-400 font-bold text-sm mb-1">Consider Speaking with a Professional</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{report.doctorReason}</p>
                  <div className="mt-4 space-y-2">
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Resources in India:</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: "iCall (TISS)", href: "https://icallhelpline.org" },
                        { label: "Vandrevala Foundation", href: "https://www.vandrevalafoundation.com" },
                        { label: "NIMHANS", href: "https://nimhans.ac.in" },
                      ].map((r) => (
                        <a
                          key={r.label}
                          href={r.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 rounded-full bg-rose-900/40 border border-rose-700/40 text-rose-300 text-xs hover:bg-rose-800/40 transition-colors"
                        >
                          {r.label} ↗
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
