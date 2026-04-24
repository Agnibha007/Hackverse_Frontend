import React, { useEffect, useRef, useState } from "react";
import { useChatStore, useSocialStore, useAuthStore } from "../../store/index.js";
import { X, Send, Loader2 } from "lucide-react";

export function ChatWindow() {
  const { activeChat, closeChat, conversations, fetchConversation, sendMessage } = useChatStore();
  const { friends } = useSocialStore();
  const { user } = useAuthStore();
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const friend = friends.find(f => f.id === activeChat);
  const msgs = conversations[activeChat] || [];

  useEffect(() => {
    if (!activeChat) return;
    fetchConversation(activeChat);
    const t = setInterval(() => fetchConversation(activeChat), 5000);
    return () => clearInterval(t);
  }, [activeChat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  if (!activeChat) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    const txt = input.trim();
    setInput("");
    setSending(true);
    await sendMessage(activeChat, txt);
    setSending(false);
  };

  return (
    <div className="fixed bottom-20 md:bottom-4 right-4 z-[90] w-72 sm:w-80 bg-neon-darker border border-neon-blue/30 rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden"
      style={{ height: "420px" }}>

      <div className="flex items-center justify-between px-3 py-2.5 border-b border-neon-blue/10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-neon-dark border border-neon-pink/40 flex items-center justify-center text-[10px] font-cyber font-bold text-neon-pink overflow-hidden">
            {friend?.profile_image_url
              ? <img src={friend.profile_image_url} alt="" className="w-full h-full object-cover" />
              : (friend?.callsign || friend?.username || "?")[0].toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-mono font-bold text-white">{friend?.callsign || friend?.username || "Chat"}</p>
            <p className="text-[10px] font-mono text-gray-600 capitalize">{friend?.presence_status || "offline"}</p>
          </div>
        </div>
        <button onClick={closeChat} className="text-gray-600 hover:text-gray-400 transition-colors">
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
        {msgs.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs font-mono text-gray-700">No messages yet. Say hi!</p>
          </div>
        ) : (
          msgs.map((msg, i) => {
            const isMe = msg.sender_id === user?.id;
            return (
              <div key={msg.id || i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] px-3 py-2 rounded-xl text-xs font-mono leading-relaxed ${
                  isMe
                    ? "bg-neon-pink/20 border border-neon-pink/30 text-white rounded-br-none"
                    : "bg-neon-dark border border-neon-blue/20 text-gray-300 rounded-bl-none"
                }`}>
                  <p>{msg.content}</p>
                  <p className={`text-[9px] mt-1 ${isMe ? "text-neon-pink/50" : "text-gray-700"}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2 p-2 border-t border-neon-blue/10 shrink-0">
        <input value={input} onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={sending}
          className="flex-1 px-3 py-2 bg-neon-dark border border-neon-blue/20 text-white placeholder-gray-700 font-mono text-xs rounded-lg focus:outline-none focus:border-neon-pink transition-all disabled:opacity-50" />
        <button type="submit" disabled={!input.trim() || sending}
          className="p-2 bg-neon-pink text-white rounded-lg hover:shadow-[0_0_12px_rgba(255,0,128,0.4)] transition-all disabled:opacity-30">
          {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
        </button>
      </form>
    </div>
  );
}
