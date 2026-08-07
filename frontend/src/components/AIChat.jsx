import { useState, useRef, useEffect } from "react";
import axios from "axios";

const AI_BASE_URL = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace("/journals", "")
  : "http://localhost:5000/api";

const SUGGESTED_QUESTIONS = [
  "Why do I keep feeling anxious?",
  "What can I do to feel better today?",
  "How has my mood been this week?",
  "Tips to improve my sleep and mood",
  "How do I handle stress better?",
];

export default function AIChat() {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi! 👋 I'm your MindTrack AI companion, powered by Gemini. I have access to your mood history and I'm here to help you understand your emotions better. What's on your mind?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || isLoading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setIsLoading(true);

    try {
      const { data } = await axios.post(`${AI_BASE_URL}/ai/chat`, {
        message: userText,
      });
      setMessages((prev) => [...prev, { role: "ai", text: data.response }]);
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        "Sorry, I couldn't respond right now. Please try again.";
      setMessages((prev) => [...prev, { role: "ai", text: errMsg, isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[600px] rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] shadow-2xl">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/10 bg-black/20 backdrop-blur-sm flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-base shadow-lg shadow-purple-500/30">
          🤖
        </div>
        <div>
          <h3 className="text-white font-bold text-sm">MindTrack AI</h3>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-emerald-400 text-xs">Online • Knows your mood history</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "ai" && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs mr-2 shrink-0 mt-0.5 shadow">
                ✨
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-br-sm shadow-lg"
                  : msg.isError
                  ? "bg-red-900/40 border border-red-500/30 text-red-300 rounded-bl-sm"
                  : "bg-white/10 backdrop-blur-sm text-gray-200 border border-white/10 rounded-bl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs shadow">
              ✨
            </div>
            <div className="bg-white/10 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-purple-400"
                  style={{ animation: `bounce 1.2s ${i * 0.2}s infinite` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
        <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }`}</style>
      </div>

      {/* Suggested Questions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <p className="text-gray-500 text-xs mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-gray-300 text-xs hover:bg-white/20 transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4 pt-2 border-t border-white/10 bg-black/10">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your moods, patterns, or how to feel better…"
            rows={1}
            className="flex-1 resize-none bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 leading-relaxed"
            style={{ maxHeight: "100px" }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
        <p className="text-gray-600 text-xs mt-2 text-center">
          AI companion — Not a substitute for professional medical advice
        </p>
      </div>
    </div>
  );
}
