import { useState } from "react";

import MoodForm from "./components/MoodForm";
import MoodList from "./components/MoodList";
import MentalHealthReport from "./components/MentalHealthReport";
import AIChat from "./components/AIChat";

const TABS = [
  { id: "journal", label: "Journal", icon: "📔" },
  { id: "insights", label: "AI Insights", icon: "🧠" },
  { id: "chat", label: "AI Chat", icon: "💬" },
];

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState("journal");

  const handleEntryAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="mx-auto max-w-4xl px-4 py-10">
        {/* Header */}
        <header className="text-center mb-8 space-y-3">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            MindTrack 🧠
          </h1>
          <p className="text-gray-600 text-lg">
            Track your daily moods, understand your feelings, and reflect on your emotional journey.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <span>✨ Interactive</span>
            <span>•</span>
            <span>📊 AI Insights</span>
            <span>•</span>
            <span>💬 AI Chat</span>
            <span>•</span>
            <span>💭 Personal</span>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-200 scale-[1.02]"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-purple-300 hover:text-purple-600"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "journal" && (
          <div>
            <MoodForm onAdded={handleEntryAdded} />
            <MoodList refreshKey={refreshKey} />
          </div>
        )}

        {activeTab === "insights" && (
          <MentalHealthReport />
        )}

        {activeTab === "chat" && (
          <AIChat />
        )}
      </div>
    </main>
  );
}

export default App;
