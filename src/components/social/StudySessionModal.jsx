import React, { useEffect, useState, useRef } from "react";
import { useStudySessionStore, useSocialStore, useAuthStore } from "../../store/index.js";
import { X, Play, Square, Users, Clock, Loader2, Zap } from "lucide-react";

function TimerDisplay({ session }) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!session?.ends_at) return;
    const calc = () => Math.max(0, Math.floor((new Date(session.ends_at) - Date.now()) / 1000));
    setTimeLeft(calc());
    const t = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(t);
  }, [session?.ends_at]);

  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  return (
    <div className="text-4xl font-cyber font-black text-neon-pink tabular-nums">
      {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
    </div>
  );
}

export function StudySessionModal({ onClose }) {
  const { currentSession, createSession, joinSession, endSession, leaveSession, refreshSession, isLoading } = useStudySessionStore();
  const { friendSessions, fetchFriendSessions } = useSocialStore();
  const { user } = useAuthStore();
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState(25);
  const [tab, setTab] = useState("create");

  useEffect(() => {
    fetchFriendSessions();
    if (!currentSession) return;
    const t = setInterval(() => refreshSession(currentSession.id), 10000);
    return () => clearInterval(t);
  }, [currentSession?.id]);

  const handleCreate = async () => {
    await createSession(subject || "General", duration);
  };

  const handleJoin = async (sessionId) => {
    await joinSession(sessionId);
  };

  const handleEnd = async () => {
    if (currentSession) await endSession(currentSession.id);
  };

  const handleLeave = () => {
    leaveSession();
    onClose();
  };

  if (currentSession) {
    const isHost = currentSession.host_id === user?.id;
    const participants = currentSession.participants || [];
    return (
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div className="w-full max-w-sm bg-neon-darker border border-neon-blue/30 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.8)]">
          <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-neon-blue/10">
            <div>
              <p className="text-xs font-mono text-gray-600 uppercase tracking-widest">Study Together</p>
              <p className="text-sm font-cyber font-bold text-white">{currentSession.subject}</p>
            </div>
            <button onClick={handleLeave} className="text-gray-600 hover:text-gray-400 transition-colors">
              <X size={16} />
            </button>
          </div>

          <div className="p-6 text-center">
            {currentSession.status === "waiting" ? (
              <>
                <div className="w-12 h-12 rounded-full bg-neon-blue/10 border border-neon-blue/30 flex items-center justify-center mx-auto mb-4">
                  <Loader2 size={20} className="animate-spin text-neon-blue" />
                </div>
                <p className="text-sm font-mono text-gray-400 mb-1">Waiting for others to join...</p>
                <p className="text-xs font-mono text-gray-600">Share your session ID: <span className="text-neon-blue">{currentSession.id.slice(0, 8)}</span></p>
              </>
            ) : (
              <>
                <TimerDisplay session={currentSession} />
                <p className="text-xs font-mono text-gray-600 mt-2">{currentSession.duration_minutes}m session</p>
              </>
            )}

            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {participants.map(p => (
                <div key={p.id} className="flex items-center gap-1.5 px-2 py-1 bg-neon-dark border border-neon-blue/20 rounded-full">
                  <div className="w-4 h-4 rounded-full bg-neon-pink/20 flex items-center justify-center text-[9px] font-cyber text-neon-pink">
                    {(p.callsign || p.username || "?")[0].toUpperCase()}
                  </div>
                  <span className="text-[10px] font-mono text-gray-400">{p.callsign || p.username}</span>
                  {p.id === currentSession.host_id && <Zap size={9} className="text-neon-pink" />}
                </div>
              ))}
            </div>
          </div>

          <div className="px-5 pb-5">
            {isHost ? (
              <button onClick={handleEnd}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-red-500/60 text-red-400 font-cyber font-bold uppercase tracking-widest rounded-lg hover:bg-red-500/10 transition-all">
                <Square size={14} /> END SESSION
              </button>
            ) : (
              <button onClick={handleLeave}
                className="w-full py-3 border border-gray-700 text-gray-500 font-mono text-sm rounded-lg hover:border-gray-500 transition-all">
                LEAVE
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-neon-darker border border-neon-blue/30 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-neon-blue/10">
          <p className="text-sm font-cyber font-bold text-white">Study Together</p>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-400 transition-colors"><X size={16} /></button>
        </div>

        <div className="flex border-b border-neon-blue/10">
          {["create", "join"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-xs font-mono uppercase tracking-widest transition-all ${
                tab === t ? "text-neon-pink border-b-2 border-neon-pink" : "text-gray-600 hover:text-gray-400"
              }`}>
              {t === "create" ? "Start Session" : "Join Friend"}
            </button>
          ))}
        </div>

        <div className="p-5">
          {tab === "create" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Subject</label>
                <input value={subject} onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Math, Physics..."
                  className="w-full px-3 py-2.5 bg-neon-dark border border-neon-blue/30 text-white placeholder-gray-700 font-mono text-sm rounded focus:outline-none focus:border-neon-pink transition-all" />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Duration</label>
                <div className="flex gap-2">
                  {[15, 25, 45, 60].map(d => (
                    <button key={d} onClick={() => setDuration(d)}
                      className={`flex-1 py-2 text-xs font-bold rounded border transition-all ${
                        duration === d ? "bg-neon-pink border-neon-pink text-white" : "border-neon-blue/30 text-gray-500 hover:border-neon-blue"
                      }`}>
                      {d}m
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleCreate} disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-neon-pink text-white font-cyber font-bold uppercase tracking-widest rounded-lg hover:shadow-[0_0_16px_rgba(255,0,128,0.4)] transition-all disabled:opacity-40">
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <><Play size={14} /> START</>}
              </button>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {friendSessions.length === 0 ? (
                <div className="text-center py-8">
                  <Users size={28} className="text-gray-700 mx-auto mb-2" />
                  <p className="text-xs font-mono text-gray-700">No active friend sessions</p>
                </div>
              ) : (
                friendSessions.map(s => (
                  <div key={s.id} className="flex items-center gap-3 p-3 bg-neon-dark border border-neon-blue/20 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-white truncate">{s.host_callsign || s.host_username}</p>
                      <p className="text-[10px] font-mono text-neon-blue">{s.subject} · {s.participant_count} studying</p>
                    </div>
                    <button onClick={() => handleJoin(s.id)} disabled={isLoading}
                      className="px-3 py-1.5 bg-neon-blue/10 border border-neon-blue/40 text-neon-blue text-xs font-bold rounded hover:bg-neon-blue hover:text-neon-black transition-all disabled:opacity-40">
                      JOIN
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
