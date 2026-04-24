import React, { useEffect, useRef, useState } from "react";
import { useChatStore, useReminderStore } from "../store/index.js";
import { MessageSquare, X, Bell, Plus, Trash2, Clock } from "lucide-react";

// ── Chat incoming toast ──────────────────────────────────────────────────────

export function ChatToast() {
  const { incomingToast, clearToast, openChat } = useChatStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (incomingToast) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [incomingToast?.ts]);

  if (!incomingToast) return null;

  const handleOpen = () => {
    openChat(incomingToast.friendId);
    clearToast();
  };

  return (
    <div
      className="fixed bottom-20 md:bottom-6 left-4 z-[100] w-72 cursor-pointer"
      style={{
        animation: visible
          ? "slideInLeft 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards"
          : "slideOutLeft 0.25s ease-in forwards",
      }}
      onClick={handleOpen}
    >
      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-110%); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
        @keyframes slideOutLeft {
          from { transform: translateX(0);     opacity: 1; }
          to   { transform: translateX(-110%); opacity: 0; }
        }
      `}</style>
      <div className="bg-neon-darker border border-neon-blue/40 rounded-xl px-4 py-3 shadow-[0_0_30px_rgba(0,234,255,0.15)] flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-neon-blue/10 border border-neon-blue/30 flex items-center justify-center shrink-0 mt-0.5">
          <MessageSquare size={14} className="text-neon-blue" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-mono font-bold text-neon-blue truncate">
            {incomingToast.senderName}
          </p>
          <p className="text-xs font-mono text-gray-400 truncate mt-0.5">
            {incomingToast.content}
          </p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); clearToast(); }}
          className="text-gray-600 hover:text-gray-400 transition-colors shrink-0"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
}

// ── Study session reminder ───────────────────────────────────────────────────

function requestNotifPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
}

function fireNotification(label) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("⏰ Study Reminder — Phi", {
      body: label,
      icon: "/logo.png",
    });
  }
}

export function ReminderManager() {
  const { reminders, addReminder, removeReminder, markFired } = useReminderStore();
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [time, setTime] = useState("");
  const intervalRef = useRef(null);

  // Request permission on mount
  useEffect(() => { requestNotifPermission(); }, []);

  // Poll every 30s to check if any reminder should fire
  useEffect(() => {
    const check = () => {
      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      reminders.forEach(r => {
        if (!r.fired && r.time === hhmm) {
          fireNotification(r.label);
          markFired(r.id);
        }
      });
    };
    check();
    intervalRef.current = setInterval(check, 30000);
    return () => clearInterval(intervalRef.current);
  }, [reminders]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!label.trim() || !time) return;
    addReminder(label.trim(), time);
    setLabel("");
    setTime("");
  };

  const activeReminders = reminders.filter(r => !r.fired);

  return (
    <>
      {/* Bell button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-20 md:bottom-6 right-4 z-[95] w-10 h-10 bg-neon-darker border border-neon-purple/40 rounded-full flex items-center justify-center hover:border-neon-purple transition-all shadow-[0_0_16px_rgba(138,43,226,0.2)]"
        title="Study Reminders"
      >
        <Bell size={16} className="text-neon-purple" />
        {activeReminders.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-neon-pink rounded-full text-[9px] font-bold text-white flex items-center justify-center">
            {activeReminders.length}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-32 md:bottom-20 right-4 z-[95] w-72 bg-neon-darker border border-neon-purple/30 rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.6)] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-neon-purple/10">
            <p className="text-xs font-mono font-bold text-neon-purple uppercase tracking-widest">
              Study Reminders
            </p>
            <button onClick={() => setOpen(false)} className="text-gray-600 hover:text-gray-400">
              <X size={13} />
            </button>
          </div>

          {/* Add form */}
          <form onSubmit={handleAdd} className="p-3 border-b border-neon-purple/10 space-y-2">
            <input
              value={label}
              onChange={e => setLabel(e.target.value)}
              placeholder="e.g. Study Physics Chapter 3"
              className="w-full px-3 py-2 bg-neon-dark border border-neon-purple/20 text-white placeholder-gray-700 font-mono text-xs rounded focus:outline-none focus:border-neon-purple transition-all"
            />
            <div className="flex gap-2">
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                required
                className="flex-1 px-3 py-2 bg-neon-dark border border-neon-purple/20 text-white font-mono text-xs rounded focus:outline-none focus:border-neon-purple transition-all"
              />
              <button
                type="submit"
                disabled={!label.trim() || !time}
                className="px-3 py-2 bg-neon-purple/20 border border-neon-purple/40 text-neon-purple rounded hover:bg-neon-purple/30 transition-all disabled:opacity-30"
              >
                <Plus size={14} />
              </button>
            </div>
          </form>

          {/* List */}
          <div className="max-h-48 overflow-y-auto">
            {activeReminders.length === 0 ? (
              <p className="text-xs font-mono text-gray-700 text-center py-4">No reminders set</p>
            ) : (
              activeReminders.map(r => (
                <div key={r.id} className="flex items-center gap-2 px-3 py-2.5 border-b border-neon-purple/5 last:border-0">
                  <Clock size={11} className="text-neon-purple/60 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono text-white truncate">{r.label}</p>
                    <p className="text-[10px] font-mono text-neon-purple/60">{r.time}</p>
                  </div>
                  <button onClick={() => removeReminder(r.id)} className="text-gray-700 hover:text-red-400 transition-colors">
                    <Trash2 size={11} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
