import React, { useEffect, useState } from "react";
import {
  useMissionStore, useFocusStore, useAnalyticsStore, useAuthStore, useSubjectStore,
} from "../store/index.js";
import { NeonCard, GlitchText, GridBg, ScanlineOverlay, Badge } from "../components/NeonComponents.jsx";
import { StatBox, MissionCard, StreakCounter, FocusSessionForm, XPBar } from "../components/DashboardComponents.jsx";
import { MissionWorkspace } from "../components/MissionWorkspace.jsx";
import { TourOverlay } from "../components/TourOverlay.jsx";
import { Activity, Zap, Target, Award, Plus, X, Circle } from "lucide-react";

const formatDate = (d) => {
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleDateString("en", { weekday: "narrow", timeZone: "UTC" });
};

export function DashboardPage() {
  const { user, onboarding } = useAuthStore();
  const { missions, fetchMissions, createMission, updateMission, deleteMission } = useMissionStore();
  const { fetchDailyMetrics, fetchWeeklyMetrics, fetchStreak, fetchDailyGoal, dailyMetrics, weeklyMetrics, streak, dailyGoal } = useFocusStore();
  const { dashboardStats, fetchDashboardStats, systemStats, fetchSystemStats } = useAnalyticsStore();
  const { fetchSubjects } = useSubjectStore();

  const [showMissionForm, setShowMissionForm] = useState(false);
  const [showFocusForm, setShowFocusForm] = useState(false);
  const [missionFilter, setMissionFilter] = useState("all");
  const [focusLoading, setFocusLoading] = useState(false);
  const [workspace, setWorkspace] = useState(null);
  const [showTour, setShowTour] = useState(() => {
    const flag = sessionStorage.getItem("showTour");
    if (flag) { sessionStorage.removeItem("showTour"); return true; }
    return false;
  });

  const refreshAll = () => {
    const today = new Date().toISOString().split("T")[0];
    fetchDailyMetrics(today);
    fetchWeeklyMetrics();
    fetchStreak();
    fetchDashboardStats();
    fetchSystemStats();
    fetchDailyGoal();
  };

  useEffect(() => {
    fetchMissions();
    fetchSubjects();
    refreshAll();
  }, []);

  const handleCreateMission = async (data) => {
    const result = await createMission(data);
    if (result.success) setShowMissionForm(false);
  };

  const handleRecordSession = async (data) => {
    setFocusLoading(true);
    const result = await useFocusStore.getState().recordSession(data);
    setFocusLoading(false);
    if (result.success) {
      setShowFocusForm(false);
      refreshAll();
    }
  };

  const handleActivate = async (mission) => {
    const result = await useMissionStore.getState().activateMission(mission.id);
    if (result.success) {
      setWorkspace({ mission: result.mission, xpAwarded: result.xpAwarded });
      refreshAll();
    }
  };

  const handleUpdateMission = async (id, updates) => {
    await updateMission(id, updates);
    refreshAll();
  };

  const handleOpenWorkspace = (mission) => {
    setWorkspace({ mission, xpAwarded: 0 });
  };

  const filterOptions = ["all", "pending", "active", "completed"];
  const filteredMissions = missionFilter === "all"
    ? missions
    : missions.filter((m) => m.status === missionFilter);

  const activeMissions = missions.filter((m) => m.status === "active");
  const pendingMissions = missions.filter((m) => m.status === "pending");
  const completedToday = dashboardStats?.today.missionsCompleted || 0;

  return (
    <div className="min-h-screen bg-neon-black text-white relative">
      <GridBg />
      <ScanlineOverlay />

      {/* Ambient lighting */}
      <div className="fixed top-0 left-0 w-[600px] h-[600px] bg-neon-pink/3 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-neon-blue/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8 pb-20 md:pb-8">

      {showTour && <TourOverlay onDone={() => setShowTour(false)} />}

        {workspace && (
          <MissionWorkspace
            mission={workspace.mission}
            xpAwarded={workspace.xpAwarded}
            onClose={() => setWorkspace(null)}
          />
        )}

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <p className="text-xs font-mono tracking-[0.3em] text-gray-600 uppercase mb-1">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
            <GlitchText text="COMMAND CENTER" className="text-3xl sm:text-4xl md:text-5xl font-black block" />
            <p className="text-sm font-mono text-gray-500 mt-2">
              WELCOME BACK, <span className="text-neon-blue">{(onboarding.callsign || user?.username)?.toUpperCase()}</span>
            </p>
            {onboarding.mainGoal && (
              <p className="text-xs font-mono text-gray-600 mt-1">
                OBJECTIVE: <span className="text-neon-purple">{onboarding.mainGoal}</span>
              </p>
            )}
          </div>
          <div className="hidden md:flex flex-col items-end gap-1">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-neon-dark border border-green-500/30 rounded">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs font-mono text-green-400">SYSTEM ONLINE</span>
            </div>
            {systemStats && (
              <p className="text-xs font-mono text-gray-600">
                INTEGRITY: {systemStats.commandCenter?.systemIntegrity || 0}%
              </p>
            )}
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatBox icon={Target}   label="Active"    value={activeMissions.length}                    color="pink"   glowing={activeMissions.length > 0} />
          <StatBox icon={Zap}      label="XP Points" value={dashboardStats?.user.xpPoints || 0}       color="purple" />
          <StatBox icon={Award}    label="Level"     value={dashboardStats?.user.level || 1}           color="blue"  />
          <StatBox icon={Activity} label="Focus Min" value={dailyMetrics?.totalMinutes || 0} unit="m" color="green" />
        </div>

        {/* ── Daily Goal ── */}
        {dailyGoal && (
          <div className="mb-6">
            <NeonCard className="border-neon-blue/20">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-mono uppercase tracking-widest text-neon-blue">Daily Focus Goal</p>
                <span className="text-xs font-mono text-gray-500">
                  {dailyMetrics?.totalMinutes || 0} / {dailyGoal.target_minutes} min
                </span>
              </div>
              <div className="w-full bg-neon-darker rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-neon-blue to-neon-pink transition-all duration-700"
                  style={{ width: `${Math.min(((dailyMetrics?.totalMinutes || 0) / dailyGoal.target_minutes) * 100, 100)}%` }}
                />
              </div>
              {(dailyMetrics?.totalMinutes || 0) >= dailyGoal.target_minutes && (
                <p className="text-xs font-mono text-green-400 mt-1">DAILY GOAL ACHIEVED</p>
              )}
            </NeonCard>
          </div>
        )}

        {/* ── XP Bar + Streak + Quick Actions ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <XPBar xp={dashboardStats?.user.xpPoints || 0} level={dashboardStats?.user.level || 1} />
          <StreakCounter streak={streak} targetStreak={7} />

          {/* Quick actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => { setShowFocusForm(!showFocusForm); setShowMissionForm(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 font-cyber font-bold uppercase tracking-widest text-sm rounded border-2 transition-all duration-200 ${
                showFocusForm
                  ? "bg-neon-blue/10 border-neon-blue text-neon-blue shadow-[0_0_16px_rgba(0,234,255,0.3)]"
                  : "border-neon-blue/40 text-neon-blue hover:border-neon-blue hover:shadow-[0_0_12px_rgba(0,234,255,0.2)]"
              }`}
            >
              {showFocusForm ? <X size={14} /> : <Plus size={14} />}
              LOG SESSION
            </button>
            <button
              onClick={() => { setShowMissionForm(!showMissionForm); setShowFocusForm(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 font-cyber font-bold uppercase tracking-widest text-sm rounded border-2 transition-all duration-200 ${
                showMissionForm
                  ? "bg-neon-pink/10 border-neon-pink text-neon-pink shadow-[0_0_16px_rgba(255,0,128,0.3)]"
                  : "border-neon-pink/40 text-neon-pink hover:border-neon-pink hover:shadow-[0_0_12px_rgba(255,0,128,0.2)]"
              }`}
            >
              {showMissionForm ? <X size={14} /> : <Plus size={14} />}
              NEW MISSION
            </button>
          </div>
        </div>

        {/* ── Expandable Forms ── */}
        {showFocusForm && (
          <div className="mb-6 animate-slide-in">
            <NeonCard glowing className="border-neon-blue/50">
              <p className="text-xs font-mono uppercase tracking-widest text-neon-blue mb-4">Log Focus Session</p>
              <FocusSessionForm onSubmit={handleRecordSession} isLoading={focusLoading} />
            </NeonCard>
          </div>
        )}

        {showMissionForm && (
          <div className="mb-6 animate-slide-in">
            <NeonCard glowing className="border-neon-pink/50">
              <p className="text-xs font-mono uppercase tracking-widest text-neon-pink mb-4">Create New Mission</p>
              <CreateMissionForm onSubmit={handleCreateMission} onCancel={() => setShowMissionForm(false)} />
            </NeonCard>
          </div>
        )}

        {/* ── Weekly Metrics Bar ── */}
        {weeklyMetrics && (
          <div className="mb-6">
            <NeonCard className="border-neon-blue/20">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-mono uppercase tracking-widest text-neon-blue">Weekly Overview</p>
                <Badge variant="blue">{weeklyMetrics.totalSessionsThisWeek} sessions</Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-cyber font-black text-neon-pink">{weeklyMetrics.totalMinutesThisWeek}</p>
                  <p className="text-xs font-mono text-gray-600 mt-1">TOTAL MIN</p>
                </div>
                <div>
                  <p className="text-2xl font-cyber font-black text-neon-blue">{weeklyMetrics.totalSessionsThisWeek}</p>
                  <p className="text-xs font-mono text-gray-600 mt-1">SESSIONS</p>
                </div>
                <div>
                  <p className="text-2xl font-cyber font-black text-neon-purple">{weeklyMetrics.avgMinutesPerDay}</p>
                  <p className="text-xs font-mono text-gray-600 mt-1">AVG / DAY</p>
                </div>
              </div>

              {/* Daily bar chart */}
              {weeklyMetrics.dailyBreakdown?.length > 0 && (
                <div className="mt-4 flex items-end gap-1 h-12">
                  {weeklyMetrics.dailyBreakdown.slice(0, 7).reverse().map((day, i) => {
                    const max = Math.max(...weeklyMetrics.dailyBreakdown.map((d) => d.total_minutes || 0), 1);
                    const h = Math.max(((day.total_minutes || 0) / max) * 100, 4);
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full rounded-sm bg-gradient-to-t from-neon-pink to-neon-blue opacity-70 transition-all duration-500"
                          style={{ height: `${h}%` }}
                        />
                        <span className="text-[9px] font-mono text-gray-700">
                          {formatDate(day.session_date)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </NeonCard>
          </div>
        )}

        {/* ── Missions Panel ── */}
        <div>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <p className="text-xs font-mono uppercase tracking-widest text-gray-500">Missions</p>
              <Badge variant="pink">{missions.length} total</Badge>
            </div>
            <div className="flex gap-0.5 sm:gap-1 overflow-x-auto">
              {filterOptions.map((f) => (
                <button key={f} onClick={() => setMissionFilter(f)}
                  className={`px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-mono uppercase rounded transition-all whitespace-nowrap ${
                    missionFilter === f ? "bg-neon-pink/10 text-neon-pink border border-neon-pink/50" : "text-gray-600 hover:text-gray-400"
                  }`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {filteredMissions.length === 0 ? (
            <NeonCard className="text-center py-16 border-dashed border-neon-blue/20">
              <Circle size={32} className="text-gray-700 mx-auto mb-3" />
              <p className="text-gray-600 font-mono text-sm">NO MISSIONS FOUND</p>
              <p className="text-gray-700 font-mono text-xs mt-1">
                {missionFilter === "all" ? "Create your first mission above" : `No ${missionFilter} missions`}
              </p>
            </NeonCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {filteredMissions.map((mission) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  onUpdate={handleUpdateMission}
                  onDelete={deleteMission}
                  onActivate={handleActivate}
                  onOpenWorkspace={handleOpenWorkspace}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CreateMissionForm({ onSubmit, onCancel }) {
  const { subjects } = useSubjectStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [deadline, setDeadline] = useState("");
  const [xpReward, setXpReward] = useState(50);
  const [subjectId, setSubjectId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      description: description || undefined,
      priority,
      xp_reward: xpReward,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
      subject_id: subjectId || undefined,
    });
  };

  const priorities = [
    { value: "low",      label: "LOW",      color: "text-neon-purple border-neon-purple/50" },
    { value: "medium",   label: "MEDIUM",   color: "text-neon-blue border-neon-blue/50" },
    { value: "high",     label: "HIGH",     color: "text-neon-pink border-neon-pink/50" },
    { value: "critical", label: "CRITICAL", color: "text-red-400 border-red-500/50" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Mission Title *</label>
        <input
          type="text" required value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter mission objective..."
          className="w-full px-4 py-3 bg-neon-darker/80 border border-neon-blue/30 text-white placeholder-gray-700 font-mono text-sm rounded focus:outline-none focus:border-neon-pink focus:shadow-[0_0_12px_rgba(255,0,128,0.2)] transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Description</label>
        <textarea
          value={description} onChange={(e) => setDescription(e.target.value)}
          placeholder="Mission briefing..."
          className="w-full px-4 py-3 bg-neon-darker/80 border border-neon-blue/30 text-white placeholder-gray-700 font-mono text-xs rounded focus:outline-none focus:border-neon-pink resize-none transition-all"
          rows="2"
        />
      </div>

      <div>
        <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Priority Level</label>
        <div className="grid grid-cols-4 gap-2">
          {priorities.map(({ value, label, color }) => (
            <button
              key={value} type="button" onClick={() => setPriority(value)}
              className={`py-2 text-xs font-bold rounded border transition-all duration-200 ${
                priority === value ? `${color} bg-current/10` : "border-gray-700 text-gray-600 hover:border-gray-500"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Deadline</label>
          <input
            type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-3 py-3 bg-neon-darker/80 border border-neon-blue/30 text-white font-mono text-sm rounded focus:outline-none focus:border-neon-pink transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">XP Reward</label>
          <input
            type="number" min="10" max="500" value={xpReward}
            onChange={(e) => setXpReward(parseInt(e.target.value))}
            className="w-full px-3 py-3 bg-neon-darker/80 border border-neon-blue/30 text-neon-pink font-mono text-sm rounded focus:outline-none focus:border-neon-pink transition-all"
          />
        </div>
      </div>

      {subjects.length > 0 && (
        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Subject</label>
          <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)}
            className="w-full px-3 py-3 bg-neon-darker/80 border border-neon-blue/30 text-white font-mono text-sm rounded focus:outline-none focus:border-neon-pink transition-all">
            <option value="">None</option>
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 py-3 bg-neon-pink text-white font-cyber font-bold uppercase tracking-widest rounded hover:shadow-[0_0_20px_rgba(255,0,128,0.5)] transition-all duration-200"
        >
          DEPLOY MISSION
        </button>
        <button
          type="button" onClick={onCancel}
          className="px-6 py-3 border border-gray-700 text-gray-500 font-mono text-sm rounded hover:border-gray-500 hover:text-gray-400 transition-all duration-200"
        >
          CANCEL
        </button>
      </div>
    </form>
  );
}
