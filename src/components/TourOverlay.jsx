import React, { useState } from "react";
import { useAuthStore } from "../store/index.js";
import { LayoutDashboard, Crosshair, BookOpen, BarChart3, Bot, Target, Zap, X, ChevronRight, ChevronLeft } from "lucide-react";

const STEPS = [
  {
    icon: Zap,
    color: "text-neon-pink",
    border: "border-neon-pink/40",
    bg: "bg-neon-pink/10",
    title: "Welcome to Phi",
    body: (callsign, goal) =>
      `Good to have you, ${callsign || "Agent"}. Your main objective is set to "${goal || "your studies"}". Everything in this app is built around helping you hit that goal — through missions, focus sessions, and real analytics.`,
  },
  {
    icon: Target,
    color: "text-neon-pink",
    border: "border-neon-pink/40",
    bg: "bg-neon-pink/10",
    title: "Missions",
    body: () =>
      "Missions are your study tasks. Create one with a title, priority level, deadline, and XP reward. Activate a mission to open its workspace — where you can add todos, jot down thoughts, and build checklists. Complete it to earn the XP.",
  },
  {
    icon: Crosshair,
    color: "text-neon-blue",
    border: "border-neon-blue/40",
    bg: "bg-neon-blue/10",
    title: "Focus Sessions",
    body: () =>
      "The Focus page has a Pomodoro-style timer. Pick a duration, rate your focus quality, and hit start. Every session you log updates your streak, daily goal progress, and analytics in real time. You can also log sessions manually if you forgot to start the timer.",
  },
  {
    icon: BookOpen,
    color: "text-neon-purple",
    border: "border-neon-purple/40",
    bg: "bg-neon-purple/10",
    title: "Subjects",
    body: () =>
      "Create color-coded subjects like Math, Physics, or whatever you're studying. Tag your missions and focus sessions to a subject. Each subject card tracks total minutes studied and missions completed — so you always know where your time is actually going.",
  },
  {
    icon: BarChart3,
    color: "text-green-400",
    border: "border-green-400/40",
    bg: "bg-green-400/10",
    title: "Stats",
    body: () =>
      "The Stats page shows your full picture — today's productivity score, your XP and level, focus streak, all-time records, and a weekly focus distribution chart. Everything is calculated from your real session data, not estimates.",
  },
  {
    icon: Bot,
    color: "text-neon-blue",
    border: "border-neon-blue/40",
    bg: "bg-neon-blue/10",
    title: "aria.ai — Your AI Mentor",
    body: () =>
      "aria.ai already knows your stats, active missions, and subjects when you open it. Ask it to build a study plan, explain a concept, or tell you what to work on today. It gives specific advice based on your actual data — not generic tips. Your conversation history is saved between sessions.",
  },
  {
    icon: Zap,
    color: "text-neon-pink",
    border: "border-neon-pink/40",
    bg: "bg-neon-pink/10",
    title: "XP and Levels",
    body: () =>
      "You earn XP by completing missions. Every 100 XP moves you up a level. Activating a mission gives a small bonus too. Your daily goal progress bar tracks focus minutes against your target for the day. Keep your streak alive by logging at least one session every day.",
  },
];

export function TourOverlay({ onDone }) {
  const { onboarding } = useAuthStore();
  const [step, setStep] = useState(0);

  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-neon-darker border border-neon-blue/30 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.8)]">

        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-neon-blue/10">
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-300 ${
                i === step ? "w-6 bg-neon-pink" : i < step ? "w-3 bg-neon-pink/40" : "w-3 bg-gray-800"
              }`} />
            ))}
          </div>
          <button onClick={onDone} className="text-gray-600 hover:text-gray-400 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-6">
          <div className={`w-12 h-12 rounded-xl ${current.bg} border ${current.border} flex items-center justify-center mb-4`}>
            <Icon size={22} className={current.color} />
          </div>
          <h2 className="text-lg font-cyber font-black text-white mb-3">{current.title}</h2>
          <p className="text-sm font-mono text-gray-400 leading-relaxed">
            {current.body(onboarding.callsign, onboarding.mainGoal)}
          </p>
        </div>

        <div className="flex items-center justify-between px-6 pb-6 gap-3">
          <button onClick={() => step > 0 ? setStep(step - 1) : onDone()}
            className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-700 text-gray-500 font-mono text-xs rounded-lg hover:border-gray-500 hover:text-gray-400 transition-all">
            <ChevronLeft size={14} />
            {step === 0 ? "SKIP" : "BACK"}
          </button>
          <button onClick={() => isLast ? onDone() : setStep(step + 1)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-neon-pink text-white font-cyber font-bold uppercase tracking-widest text-sm rounded-lg hover:shadow-[0_0_16px_rgba(255,0,128,0.4)] transition-all">
            {isLast ? "START" : <><span>NEXT</span><ChevronRight size={14} /></>}
          </button>
        </div>
      </div>
    </div>
  );
}
