import React, { useState } from "react";
import { Clock, Zap, Trash2, CheckCircle, Play, Target } from "lucide-react";
import { NeonCard, Badge, CircleProgress } from "./NeonComponents.jsx";
import { useSubjectStore, useFocusStore } from "../store/index.js";

const PRIORITY_STYLES = {
  critical: { border: "border-red-500/70",   badge: "red",    label: "CRITICAL" },
  high:     { border: "border-neon-pink/70",  badge: "pink",   label: "HIGH" },
  medium:   { border: "border-neon-blue/70",  badge: "blue",   label: "MEDIUM" },
  low:      { border: "border-neon-purple/70",badge: "purple", label: "LOW" },
};

const STATUS_STYLES = {
  pending:   { badge: "gray",  glow: "" },
  active:    { badge: "blue",  glow: "shadow-[0_0_16px_rgba(0,234,255,0.2)]" },
  completed: { badge: "green", glow: "" },
  cancelled: { badge: "red",   glow: "" },
};

export function MissionCard({ mission, onUpdate, onDelete, onActivate, onOpenWorkspace }) {
  const p = PRIORITY_STYLES[mission.priority] || PRIORITY_STYLES.medium;
  const s = STATUS_STYLES[mission.status] || STATUS_STYLES.pending;
  const isCompleted = mission.status === "completed";
  const isActive = mission.status === "active";

  const deadlineDate = mission.deadline ? new Date(mission.deadline) : null;
  const isOverdue = deadlineDate && deadlineDate < new Date() && !isCompleted;

  return (
    <div
      className={`
        relative bg-neon-dark/90 border-l-4 ${p.border} border border-neon-blue/10 rounded-lg p-4
        transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]
        ${s.glow} ${isCompleted ? "opacity-50" : ""}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className={`font-cyber font-bold text-sm uppercase tracking-wide truncate ${isCompleted ? "line-through text-gray-500" : "text-white"}`}>
            {mission.title}
          </h3>
          {mission.description && (
            <p className="text-gray-500 text-xs mt-1 font-mono line-clamp-2">{mission.description}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <Badge variant={s.badge}>{mission.status}</Badge>
          <Badge variant={p.badge}>{p.label}</Badge>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between text-xs font-mono mb-4">
        <div className="flex items-center gap-1 text-neon-pink">
          <Zap size={11} />
          <span className="font-bold">{mission.xp_reward || 50} XP</span>
        </div>
        {deadlineDate && (
          <div className={`flex items-center gap-1 ${isOverdue ? "text-red-400" : "text-gray-500"}`}>
            <Clock size={11} />
            <span>{isOverdue ? "OVERDUE · " : ""}{deadlineDate.toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      {!isCompleted && (
        <div className="flex gap-2">
          {!isActive && (
            <button
              onClick={() => onActivate?.(mission)}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-neon-pink/10 border border-neon-pink/50 text-neon-pink text-xs font-bold rounded hover:bg-neon-pink hover:text-white transition-all duration-200"
            >
              <Play size={10} /> ACTIVATE
            </button>
          )}
          {isActive && (
            <button
              onClick={() => onOpenWorkspace?.(mission)}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-neon-blue/10 border border-neon-blue/50 text-neon-blue text-xs font-bold rounded hover:bg-neon-blue hover:text-neon-black transition-all duration-200"
            >
              <Target size={10} /> WORKSPACE
            </button>
          )}
          <button
            onClick={() => onUpdate?.(mission.id, { status: "completed" })}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-neon-blue/10 border border-neon-blue/50 text-neon-blue text-xs font-bold rounded hover:bg-neon-blue hover:text-neon-black transition-all duration-200"
          >
            <CheckCircle size={10} /> COMPLETE
          </button>
          <button
            onClick={() => onDelete?.(mission.id)}
            className="px-3 py-1.5 bg-red-500/10 border border-red-500/40 text-red-400 text-xs rounded hover:bg-red-600 hover:text-white transition-all duration-200"
          >
            <Trash2 size={10} />
          </button>
        </div>
      )}
      {isCompleted && (
        <button
          onClick={() => onDelete?.(mission.id)}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400/60 text-xs rounded hover:bg-red-600/20 transition-all duration-200"
        >
          <Trash2 size={10} /> REMOVE
        </button>
      )}
    </div>
  );
}

export function StatBox({ icon: Icon, label, value, unit = "", glowing = false, color = "blue" }) {
  const colors = {
    blue:   "text-neon-blue",
    pink:   "text-neon-pink",
    purple: "text-neon-purple",
    green:  "text-green-400",
  };

  return (
    <NeonCard glowing={glowing} className="text-center group hover:border-neon-pink/50 transition-all duration-300">
      <div className={`flex justify-center mb-3 ${colors[color]}`}>
        <Icon size={22} />
      </div>
      <p className="text-xs text-gray-600 font-mono uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-3xl font-cyber font-black ${colors[color]}`}>
        {value}
        {unit && <span className="text-sm text-gray-500 ml-1 font-mono">{unit}</span>}
      </p>
    </NeonCard>
  );
}

export function FocusSessionForm({ onSubmit, isLoading }) {
  const { subjects } = useSubjectStore();
  const [duration, setDuration] = useState(25);
  const [focusQuality, setFocusQuality] = useState("normal");
  const [notes, setNotes] = useState("");
  const [subjectId, setSubjectId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      duration_minutes: parseInt(duration),
      focus_quality: focusQuality,
      notes: notes || undefined,
      subject_id: subjectId || undefined,
    });
    setDuration(25);
    setNotes("");
    setSubjectId("");
  };

  const qualityColors = { distracted: "text-red-400", normal: "text-gray-400", focused: "text-neon-blue", deep: "text-neon-pink" };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {subjects.length > 0 && (
        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-neon-pink mb-2">Subject (Optional)</label>
          <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)}
            className="w-full px-3 py-2 bg-neon-darker border border-neon-blue/40 rounded text-white text-xs font-mono focus:outline-none focus:border-neon-pink">
            <option value="">None</option>
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      )}
      <div>
        <label className="block text-xs font-mono uppercase tracking-widest text-neon-pink mb-2">Duration (min)</label>
        <div className="flex items-center gap-3">
          {[15, 25, 45, 60, 90].map((d) => (
            <button key={d} type="button" onClick={() => setDuration(d)}
              className={`flex-1 py-2 text-xs font-bold rounded border transition-all duration-200 ${
                duration === d
                  ? "bg-neon-pink border-neon-pink text-white shadow-[0_0_10px_rgba(255,0,128,0.5)]"
                  : "border-neon-blue/30 text-gray-500 hover:border-neon-blue hover:text-neon-blue"
              }`}>
              {d}
            </button>
          ))}
          <input type="number" min="1" max="480" value={duration} onChange={(e) => setDuration(e.target.value)}
            className="w-16 px-2 py-2 bg-neon-darker border border-neon-blue/40 rounded text-white text-xs font-mono text-center focus:outline-none focus:border-neon-pink" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-mono uppercase tracking-widest text-neon-pink mb-2">Focus Quality</label>
        <div className="grid grid-cols-4 gap-2">
          {["distracted", "normal", "focused", "deep"].map((q) => (
            <button key={q} type="button" onClick={() => setFocusQuality(q)}
              className={`py-2 text-xs font-bold rounded border transition-all duration-200 ${
                focusQuality === q
                  ? `border-neon-pink bg-neon-pink/10 ${qualityColors[q]}`
                  : "border-neon-blue/20 text-gray-600 hover:border-neon-blue/50"
              }`}>
              {q.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-mono uppercase tracking-widest text-neon-pink mb-2">Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What did you work on?"
          className="w-full px-3 py-2 bg-neon-darker border border-neon-blue/40 rounded text-white font-mono text-xs focus:outline-none focus:border-neon-pink resize-none"
          rows="2" />
      </div>
      <button type="submit" disabled={isLoading}
        className="w-full py-3 bg-neon-pink text-white font-bold uppercase tracking-widest rounded hover:shadow-[0_0_20px_rgba(255,0,128,0.6)] transition-all duration-200 disabled:opacity-40">
        {isLoading ? "RECORDING..." : "LOG SESSION"}
      </button>
    </form>
  );
}

export function StreakCounter({ streak, targetStreak = 7 }) {
  const pct = Math.min((streak / targetStreak) * 100, 100);
  const isOnFire = streak >= targetStreak;

  return (
    <NeonCard glowing={isOnFire} className={`text-center ${isOnFire ? "border-neon-pink/70" : "border-neon-blue/30"}`}>
      <p className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Focus Streak</p>
      <div className={`text-5xl font-cyber font-black mb-1 ${isOnFire ? "text-neon-pink animate-glow" : "text-neon-blue"}`}>
        {streak}
      </div>
      <p className="text-xs font-mono text-gray-600 mb-4">
        {isOnFire ? "ON FIRE" : `${targetStreak - streak} days to goal`}
      </p>
      <div className="w-full bg-neon-darker rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-neon-pink to-neon-blue transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs font-mono text-gray-700 mt-1">
        <span>0</span>
        <span>{targetStreak} days</span>
      </div>
    </NeonCard>
  );
}

export function XPBar({ xp, level }) {
  const xpInLevel = xp % 100;
  const xpToNext = 100 - xpInLevel;

  return (
    <NeonCard className="border-neon-purple/40">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-gray-500">Power Level</p>
          <p className="text-2xl font-cyber font-black text-neon-purple">{level}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-mono text-gray-600">{xpInLevel} / 100 XP</p>
          <p className="text-xs font-mono text-neon-purple">{xpToNext} to next</p>
        </div>
      </div>
      <div className="w-full bg-neon-darker rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-pink transition-all duration-700 shadow-[0_0_8px_rgba(138,43,226,0.6)]"
          style={{ width: `${xpInLevel}%` }}
        />
      </div>
    </NeonCard>
  );
}
