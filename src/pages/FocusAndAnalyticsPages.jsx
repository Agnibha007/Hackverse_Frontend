import React, { useEffect, useState, useRef } from "react";
import { useFocusStore, useAnalyticsStore } from "../store/index.js";
import { NeonCard, GlitchText, CircleProgress, GridBg, ScanlineOverlay, Badge } from "../components/NeonComponents.jsx";
import { Play, Pause, Square, Zap, Target, Clock, TrendingUp, Award, Activity } from "lucide-react";

export function FocusModePage() {
  const { recordSession, fetchStreak, fetchWeeklyMetrics } = useFocusStore();
  const { fetchDashboardStats } = useAnalyticsStore();

  const [duration, setDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [focusQuality, setFocusQuality] = useState("normal");
  const [sessionDone, setSessionDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const totalTime = useRef(25 * 60);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(interval); handleSessionEnd(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => {
    totalTime.current = duration * 60;
    setTimeLeft(duration * 60);
    setIsRunning(true);
    setSessionDone(false);
  };

  const handlePause = () => setIsRunning(false);
  const handleResume = () => setIsRunning(true);

  const handleSessionEnd = async () => {
    setIsRunning(false);
    setIsLoading(true);
    const elapsed = Math.round((totalTime.current - timeLeft) / 60) || duration;
    await recordSession({ duration_minutes: elapsed, focus_quality: focusQuality });
    setIsLoading(false);
    setSessionDone(true);
    setTimeLeft(duration * 60);
    // Refresh all stats from DB
    fetchDashboardStats();
    fetchStreak();
    fetchWeeklyMetrics();
    setTimeout(() => setSessionDone(false), 5000);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = totalTime.current > 0 ? ((totalTime.current - timeLeft) / totalTime.current) * 100 : 0;
  const hasStarted = timeLeft < totalTime.current || isRunning;

  const qualityConfig = {
    distracted: { color: "text-red-400",    border: "border-red-500/50",    label: "DISTRACTED" },
    normal:     { color: "text-gray-400",   border: "border-gray-500/50",   label: "NORMAL" },
    focused:    { color: "text-neon-blue",  border: "border-neon-blue/50",  label: "FOCUSED" },
    deep:       { color: "text-neon-pink",  border: "border-neon-pink/50",  label: "DEEP FOCUS" },
  };

  const presets = [15, 25, 45, 60, 90];

  return (
    <div className="min-h-screen bg-neon-black text-white relative flex items-center justify-center p-3 sm:p-4 pb-20 md:pb-4">
      <GridBg />
      <ScanlineOverlay />

      {/* Pulsing ambient glow when running */}
      {isRunning && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-pink/5 rounded-full blur-[120px] animate-pulse" />
        </div>
      )}

      <div className="relative z-10 w-full max-w-lg">
        {/* Success toast */}
        {sessionDone && (
          <div className="mb-4 flex items-center gap-3 px-4 py-3 bg-green-500/10 border border-green-500/40 rounded-lg text-green-400 text-sm font-mono animate-slide-in">
            <Zap size={16} />
            SESSION RECORDED — XP AWARDED
          </div>
        )}

        <NeonCard glowing className="border-neon-pink/40 text-center">
          {/* Title */}
          <div className="mb-6">
            <GlitchText text="FOCUS MODE" className="text-3xl font-black block" />
            <p className="text-xs font-mono tracking-[0.3em] text-gray-600 mt-1">
              {isRunning ? "DEEP WORK ACTIVE" : "STANDBY"}
            </p>
          </div>

          {/* Timer ring */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <CircleProgress percentage={progress} size={180} strokeWidth={6}>
              <div className="text-center">
                <div className={`text-4xl sm:text-5xl font-cyber font-black tabular-nums ${isRunning ? "text-neon-pink animate-glow" : "text-white"}`}>
                  {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </div>
                <div className={`text-xs font-mono mt-2 ${qualityConfig[focusQuality].color}`}>
                  {qualityConfig[focusQuality].label}
                </div>
                {isRunning && (
                  <div className="text-xs font-mono text-gray-600 mt-1">
                    {Math.round(progress)}% complete
                  </div>
                )}
              </div>
            </CircleProgress>
          </div>

          {/* Duration presets — only when not running */}
          {!hasStarted && (
            <div className="mb-6">
              <p className="text-xs font-mono uppercase tracking-widest text-gray-600 mb-3">Duration</p>
              <div className="flex gap-2 justify-center">
                {presets.map((p) => (
                  <button
                    key={p}
                    onClick={() => { setDuration(p); setTimeLeft(p * 60); }}
                    className={`px-3 py-2 text-xs font-bold rounded border transition-all duration-200 ${
                      duration === p
                        ? "bg-neon-pink border-neon-pink text-white shadow-[0_0_10px_rgba(255,0,128,0.5)]"
                        : "border-neon-blue/20 text-gray-600 hover:border-neon-blue hover:text-neon-blue"
                    }`}
                  >
                    {p}m
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quality selector — only when not running */}
          {!isRunning && (
            <div className="mb-6">
              <p className="text-xs font-mono uppercase tracking-widest text-gray-600 mb-3">Focus Quality</p>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(qualityConfig).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => setFocusQuality(key)}
                    className={`py-2 text-xs font-bold rounded border transition-all duration-200 ${
                      focusQuality === key
                        ? `${cfg.border} ${cfg.color} bg-white/5`
                        : "border-gray-800 text-gray-700 hover:border-gray-600"
                    }`}
                  >
                    {cfg.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-3">
            {!hasStarted && (
              <button
                onClick={handleStart}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-neon-pink text-white font-cyber font-bold uppercase tracking-widest rounded hover:shadow-[0_0_24px_rgba(255,0,128,0.6)] transition-all duration-200"
              >
                <Play size={16} /> INITIATE
              </button>
            )}
            {isRunning && (
              <>
                <button
                  onClick={handlePause}
                  className="flex-1 flex items-center justify-center gap-2 py-4 border-2 border-yellow-500/60 text-yellow-400 font-cyber font-bold uppercase tracking-widest rounded hover:bg-yellow-500/10 transition-all duration-200"
                >
                  <Pause size={16} /> PAUSE
                </button>
                <button
                  onClick={handleSessionEnd}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-4 border-2 border-neon-blue/60 text-neon-blue font-cyber font-bold uppercase tracking-widest rounded hover:bg-neon-blue/10 transition-all duration-200 disabled:opacity-40"
                >
                  <Square size={16} /> {isLoading ? "SAVING..." : "FINISH"}
                </button>
              </>
            )}
            {!isRunning && hasStarted && !sessionDone && (
              <>
                <button
                  onClick={handleResume}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-neon-blue/10 border-2 border-neon-blue text-neon-blue font-cyber font-bold uppercase tracking-widest rounded hover:bg-neon-blue hover:text-neon-black transition-all duration-200"
                >
                  <Play size={16} /> RESUME
                </button>
                <button
                  onClick={handleSessionEnd}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-4 border-2 border-neon-pink/60 text-neon-pink font-cyber font-bold uppercase tracking-widest rounded hover:bg-neon-pink/10 transition-all duration-200 disabled:opacity-40"
                >
                  <Square size={16} /> {isLoading ? "SAVING..." : "END"}
                </button>
              </>
            )}
          </div>

          {/* Status footer */}
          <div className="mt-6 pt-4 border-t border-neon-blue/10 flex justify-between text-xs font-mono text-gray-700">
            <span>MODE: {focusQuality.toUpperCase()}</span>
            <span>STATUS: {isRunning ? "ACTIVE" : "STANDBY"}</span>
            <span>TARGET: {duration}m</span>
          </div>
        </NeonCard>
      </div>
    </div>
  );
}

export function AnalyticsPage() {
  const { dashboardStats, productivityTrend, fetchDashboardStats, fetchProductivityTrend } = useAnalyticsStore();
  const { weeklyMetrics, fetchWeeklyMetrics } = useFocusStore();

  useEffect(() => {
    fetchDashboardStats();
    fetchProductivityTrend(1);
    fetchWeeklyMetrics();
  }, []);

  const productivityScore = dashboardStats?.today.productivityScore || 0;

  return (
    <div className="min-h-screen bg-neon-black text-white relative">
      <GridBg />
      <ScanlineOverlay />
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-neon-blue/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8 pb-20 md:pb-8">
        <div className="mb-6 sm:mb-8">
          <p className="text-xs font-mono tracking-[0.3em] text-gray-600 uppercase mb-1">Performance Overview</p>
          <GlitchText text="ANALYTICS" className="text-3xl sm:text-4xl md:text-5xl font-black block" />
        </div>

        {/* Top row: Today + User Profile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Today's score with circle */}
          <NeonCard className="border-neon-pink/30 flex flex-col items-center justify-center py-6">
            <p className="text-xs font-mono uppercase tracking-widest text-gray-600 mb-4">Today's Score</p>
            <CircleProgress percentage={productivityScore} size={140} strokeWidth={6}>
              <div className="text-center">
                <p className="text-3xl font-cyber font-black text-neon-pink">{productivityScore}</p>
                <p className="text-xs font-mono text-gray-600">/ 100</p>
              </div>
            </CircleProgress>
            <div className="mt-4 grid grid-cols-2 gap-4 w-full text-center">
              <div>
                <p className="text-lg font-cyber font-black text-neon-blue">{dashboardStats?.today.missionsCompleted || 0}</p>
                <p className="text-xs font-mono text-gray-600">MISSIONS</p>
              </div>
              <div>
                <p className="text-lg font-cyber font-black text-neon-purple">{dashboardStats?.today.focusMinutes || 0}</p>
                <p className="text-xs font-mono text-gray-600">FOCUS MIN</p>
              </div>
            </div>
          </NeonCard>

          {/* User stats */}
          <NeonCard className="border-neon-blue/30">
            <p className="text-xs font-mono uppercase tracking-widest text-neon-blue mb-4">Agent Profile</p>
            <div className="space-y-4">
              {[
                { label: "Level",        value: dashboardStats?.user.level || 1,                  color: "text-neon-purple" },
                { label: "XP Points",    value: dashboardStats?.user.xpPoints || 0,               color: "text-neon-pink" },
                { label: "Focus Streak", value: `${dashboardStats?.user.focusStreak || 0} days`,  color: "text-neon-blue" },
                { label: "Total Focus",  value: `${dashboardStats?.user.totalFocusMinutes || 0}m`, color: "text-green-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-600">{label}</span>
                  <span className={`text-sm font-cyber font-bold ${color}`}>{value}</span>
                </div>
              ))}
            </div>
          </NeonCard>

          {/* All-time stats */}
          <NeonCard className="border-neon-purple/30">
            <p className="text-xs font-mono uppercase tracking-widest text-neon-purple mb-4">All-Time Records</p>
            <div className="space-y-4">
              {[
                { label: "Total Sessions",  value: dashboardStats?.allTime.totalSessions || 0,      color: "text-neon-pink" },
                { label: "Focus Minutes",   value: dashboardStats?.allTime.totalFocusMinutes || 0,  color: "text-neon-blue" },
                { label: "Avg Session",     value: `${dashboardStats?.allTime.avgSessionLength || 0}m`, color: "text-neon-purple" },
                { label: "Best Streak",     value: `${dashboardStats?.allTime.maxStreak || 0} days`, color: "text-green-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-600">{label}</span>
                  <span className={`text-sm font-cyber font-bold ${color}`}>{value}</span>
                </div>
              ))}
            </div>
          </NeonCard>
        </div>

        {/* Weekly bar chart */}
        {weeklyMetrics?.dailyBreakdown?.length > 0 && (
          <NeonCard className="border-neon-blue/20 mb-6">
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs font-mono uppercase tracking-widest text-neon-blue">Weekly Focus Distribution</p>
              <Badge variant="blue">{weeklyMetrics.totalMinutesThisWeek} min total</Badge>
            </div>
            <div className="flex items-end gap-2 h-32">
              {weeklyMetrics.dailyBreakdown.slice(0, 7).reverse().map((day, i) => {
                const max = Math.max(...weeklyMetrics.dailyBreakdown.map((d) => d.total_minutes || 0), 1);
                const pct = Math.max(((day.total_minutes || 0) / max) * 100, 2);
                const date = day.session_date instanceof Date ? day.session_date : new Date(day.session_date);
                const label = date.toLocaleDateString("en", { weekday: "short", timeZone: "UTC" });
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="relative w-full flex flex-col justify-end" style={{ height: "100px" }}>
                      <div
                        className="w-full rounded-t bg-gradient-to-t from-neon-pink/60 to-neon-blue/60 group-hover:from-neon-pink group-hover:to-neon-blue transition-all duration-300"
                        style={{ height: `${pct}%` }}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-mono text-gray-600">
                        {label}
                      </p>
                      <p className="text-[10px] font-mono text-neon-blue">{day.total_minutes || 0}m</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </NeonCard>
        )}

        {/* Productivity trend summary */}
        {productivityTrend?.summary && (
          <NeonCard className="border-neon-pink/20">
            <p className="text-xs font-mono uppercase tracking-widest text-neon-pink mb-6">Monthly Trend Summary</p>
            <div className="grid grid-cols-3 gap-2 sm:gap-6 text-center">
              <div>
                <p className="text-2xl sm:text-4xl font-cyber font-black text-neon-pink mb-1">
                  {productivityTrend.summary.averageProductivity}%
                </p>
                <p className="text-[10px] sm:text-xs font-mono text-gray-600">AVG PRODUCTIVITY</p>
              </div>
              <div>
                <p className="text-2xl sm:text-4xl font-cyber font-black text-neon-blue mb-1">
                  {productivityTrend.summary.totalFocusMinutes}
                </p>
                <p className="text-[10px] sm:text-xs font-mono text-gray-600">FOCUS MIN</p>
              </div>
              <div>
                <p className="text-2xl sm:text-4xl font-cyber font-black text-neon-purple mb-1">
                  {productivityTrend.summary.missionsCompleted}
                </p>
                <p className="text-[10px] sm:text-xs font-mono text-gray-600">MISSIONS</p>
              </div>
            </div>
          </NeonCard>
        )}
      </div>
    </div>
  );
}
