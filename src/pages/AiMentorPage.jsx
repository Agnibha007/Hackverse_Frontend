import React, { useEffect, useRef, useState } from "react";
import { useAiStore, useAuthStore } from "../store/index.js";
import { GlitchText, GridBg, ScanlineOverlay, NeonCard } from "../components/NeonComponents.jsx";
import { Send, Trash2, Bot, User, Loader2, Zap } from "lucide-react";

function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1 ${
        isUser ? "bg-neon-pink/20 border border-neon-pink/40" : "bg-neon-blue/20 border border-neon-blue/40"
      }`}>
        {isUser ? <User size={13} className="text-neon-pink" /> : <Bot size={13} className="text-neon-blue" />}
      </div>
      <div className={`max-w-[80%] px-4 py-3 rounded-xl text-sm font-mono leading-relaxed whitespace-pre-wrap ${
        isUser
          ? "bg-neon-pink/10 border border-neon-pink/20 text-white rounded-tr-none"
          : "bg-neon-dark border border-neon-blue/20 text-gray-200 rounded-tl-none"
      }`}>
        {msg.content}
      </div>
    </div>
  );
}

export function AiMentorPage() {
  const { messages, isLoading, fetchHistory, sendMessage, clearHistory } = useAiStore();
  const { user } = useAuthStore();
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { fetchHistory(); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const msg = input.trim();
    setInput("");
    await sendMessage(msg);
    inputRef.current?.focus();
  };

  const handleClear = async () => {
    if (confirm("Clear all conversation history?")) await clearHistory();
  };

  const suggestions = [
    "Create a study plan for my active missions",
    "How can I improve my focus streak?",
    "Explain the Feynman technique",
    "What should I study today?",
  ];

  return (
    <div className="min-h-screen bg-neon-black text-white relative flex flex-col" style={{ height: "100dvh" }}>
      <GridBg />
      <ScanlineOverlay />

      <div className="relative z-10 max-w-4xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-6 flex flex-col" style={{ height: "calc(100dvh - 48px - 56px)" }}>
        <div className="flex items-end justify-between mb-4 shrink-0">
          <div>
            <p className="text-xs font-mono tracking-[0.3em] text-gray-600 uppercase mb-1">AI Study Companion</p>
            <GlitchText text="aria.ai" className="text-2xl sm:text-3xl md:text-4xl font-black block" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-neon-blue/10 border border-neon-blue/30 rounded">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs font-mono text-neon-blue">ONLINE</span>
            </div>
            {messages.length > 0 && (
              <button onClick={handleClear}
                className="p-2 text-gray-600 hover:text-red-400 border border-gray-700 hover:border-red-500/50 rounded transition-all">
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pb-4 min-h-0">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-neon-blue/10 border border-neon-blue/30 flex items-center justify-center mb-4">
                <Bot size={28} className="text-neon-blue" />
              </div>
              <p className="text-sm font-mono text-gray-400 mb-1">ARIA is ready, Agent {user?.username?.toUpperCase()}</p>
              <p className="text-xs font-mono text-gray-600 mb-6">Ask anything about studying, your missions, or get a personalized plan</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {suggestions.map((s) => (
                  <button key={s} onClick={() => setInput(s)}
                    className="px-3 py-2.5 text-xs font-mono text-gray-400 border border-neon-blue/20 rounded hover:border-neon-blue/50 hover:text-neon-blue text-left transition-all">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center bg-neon-blue/20 border border-neon-blue/40 shrink-0 mt-1">
                    <Bot size={13} className="text-neon-blue" />
                  </div>
                  <div className="px-4 py-3 bg-neon-dark border border-neon-blue/20 rounded-xl rounded-tl-none">
                    <Loader2 size={14} className="animate-spin text-neon-blue" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        <form onSubmit={handleSend} className="flex gap-2 shrink-0 pt-3 border-t border-neon-blue/10">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask ARIA anything..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-neon-dark border border-neon-blue/30 text-white placeholder-gray-700 font-mono text-sm rounded-lg focus:outline-none focus:border-neon-pink transition-all disabled:opacity-50"
          />
          <button type="submit" disabled={!input.trim() || isLoading}
            className="px-4 py-3 bg-neon-pink text-white rounded-lg hover:shadow-[0_0_16px_rgba(255,0,128,0.5)] transition-all disabled:opacity-30">
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
