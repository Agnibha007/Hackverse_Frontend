import React, { useState } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/index.js";
import { LayoutDashboard, Crosshair, BarChart3, LogOut, Zap, Pencil, Trash2, X, AlertTriangle, BookOpen, Bot, Gift } from "lucide-react";

const navLinks = [
  { to: "/dashboard",    label: "Command",      icon: LayoutDashboard },
  { to: "/focus",        label: "Focus",        icon: Crosshair },
  { to: "/subjects",     label: "Subjects",     icon: BookOpen },
  { to: "/analytics",   label: "Stats",        icon: BarChart3 },
  { to: "/ai",          label: "aria.ai",      icon: Bot },
  { to: "/collectibles", label: "Drops",        icon: Gift },
];

function ProfileDropdown({ user, onClose }) {
  const { logout, updateProfile, deleteAccount } = useAuthStore();
  const [view, setView] = useState("menu");
  const [newUsername, setNewUsername] = useState(user.username || "");
  const [confirmUsername, setConfirmUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    if (!newUsername.trim()) return;
    if (newUsername.trim() === user.username) { onClose(); return; }
    setLoading(true); setError("");
    const result = await updateProfile(newUsername.trim(), undefined);
    setLoading(false);
    if (result.success) onClose();
    else setError(result.error || "Failed to update username");
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (confirmUsername.trim() !== user.username) { setError("Username doesn't match"); return; }
    setLoading(true); setError("");
    const result = await deleteAccount(user.username);
    setLoading(false);
    if (!result.success) setError(result.error || "Failed to delete account");
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-64 bg-neon-darker border border-neon-blue/30 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] z-50 overflow-hidden">
      {view === "menu" && (
        <>
          <div className="px-4 py-3 border-b border-neon-blue/20">
            <p className="text-xs font-mono text-gray-600 uppercase tracking-widest">Agent</p>
            <p className="text-sm font-cyber font-bold text-neon-blue mt-0.5">{user.username?.toUpperCase()}</p>
            <p className="text-xs font-mono text-gray-600 truncate">{user.email}</p>
          </div>
          <div className="p-2 space-y-1">
            <button onClick={() => setView("edit")} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-mono text-gray-400 hover:text-neon-blue hover:bg-neon-blue/5 rounded transition-all">
              <Pencil size={13} /> EDIT USERNAME
            </button>
            <button onClick={logout} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-mono text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/5 rounded transition-all">
              <LogOut size={13} /> SIGN OUT
            </button>
            <button onClick={() => setView("delete")} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-mono text-red-500/60 hover:text-red-400 hover:bg-red-500/5 rounded transition-all">
              <Trash2 size={13} /> DELETE ACCOUNT
            </button>
          </div>
        </>
      )}
      {view === "edit" && (
        <form onSubmit={handleUpdateUsername} className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-mono uppercase tracking-widest text-neon-blue">Edit Username</p>
            <button type="button" onClick={() => setView("menu")} className="text-gray-600 hover:text-gray-400"><X size={14} /></button>
          </div>
          <input value={newUsername} onChange={(e) => setNewUsername(e.target.value)}
            className="w-full px-3 py-2.5 bg-neon-dark border border-neon-blue/30 text-white font-mono text-sm rounded focus:outline-none focus:border-neon-pink transition-all mb-3" autoFocus />
          {error && <p className="text-red-400 text-xs font-mono mb-2">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-neon-pink text-white font-mono text-xs font-bold uppercase rounded transition-all disabled:opacity-40">
            {loading ? "SAVING..." : "SAVE"}
          </button>
        </form>
      )}
      {view === "delete" && (
        <form onSubmit={handleDelete} className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-mono uppercase tracking-widest text-red-400">Delete Account</p>
            <button type="button" onClick={() => setView("menu")} className="text-gray-600 hover:text-gray-400"><X size={14} /></button>
          </div>
          <div className="flex items-start gap-2 mb-3 p-2 bg-red-500/10 border border-red-500/30 rounded">
            <AlertTriangle size={13} className="text-red-400 mt-0.5 shrink-0" />
            <p className="text-xs font-mono text-red-400">Permanently deletes all data. Type username to confirm.</p>
          </div>
          <input value={confirmUsername} onChange={(e) => setConfirmUsername(e.target.value)} placeholder={user.username}
            className="w-full px-3 py-2.5 bg-neon-dark border border-red-500/30 text-white font-mono text-sm rounded focus:outline-none focus:border-red-500 transition-all mb-3" autoFocus />
          {error && <p className="text-red-400 text-xs font-mono mb-2">{error}</p>}
          <button type="submit" disabled={loading || confirmUsername.trim() !== user.username}
            className="w-full py-2.5 bg-red-600 text-white font-mono text-xs font-bold uppercase rounded transition-all disabled:opacity-30">
            {loading ? "DELETING..." : "PERMANENTLY DELETE"}
          </button>
        </form>
      )}
    </div>
  );
}

export function Navigation() {
  const { user, logout } = useAuthStore();
  const { pathname } = useLocation();
  const [showProfile, setShowProfile] = useState(false);

  if (!user) return null;

  return (
    <>
      {showProfile && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowProfile(false)}
        />
      )}
      {/* Desktop top nav */}
      <nav className="sticky top-0 z-50 bg-neon-darker/95 backdrop-blur-md border-b border-neon-blue/20 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/dashboard">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Phi" className="h-8 w-8 object-contain" />
              <span className="text-neon-pink font-cyber font-black text-xl tracking-widest">Phi</span>
            </div>
          </Link>
          <div className="flex items-center gap-0.5">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = pathname === to;
              return (
                <Link key={to} to={to} className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded transition-all
                  ${active ? "text-neon-pink bg-neon-pink/10" : "text-gray-500 hover:text-neon-blue hover:bg-neon-blue/5"}`}>
                  <Icon size={13} />{label}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setShowProfile(v => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-neon-dark border border-neon-blue/30 rounded hover:border-neon-blue transition-all">
                <Zap size={11} className="text-neon-pink" />
                <span className="text-xs font-mono text-neon-blue">{user.username?.toUpperCase()}</span>
                {user.level && <span className="text-xs font-mono text-neon-purple">LV.{user.level}</span>}
              </button>
              {showProfile && <ProfileDropdown user={user} onClose={() => setShowProfile(false)} />}
            </div>
            <button onClick={logout} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-gray-500 border border-gray-700 rounded hover:border-red-500 hover:text-red-400 transition-all">
              <LogOut size={11} /> EXIT
            </button>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-neon-pink/50 to-transparent" />
      </nav>

      {/* Mobile top bar */}
      <nav className="sticky top-0 z-50 bg-neon-darker/95 backdrop-blur-md border-b border-neon-blue/20 md:hidden">
        <div className="px-4 h-12 flex items-center justify-between">
          <Link to="/dashboard">
            <div className="flex items-center gap-1.5">
              <img src="/logo.png" alt="Phi" className="h-7 w-7 object-contain" />
              <span className="text-neon-pink font-cyber font-black text-base tracking-widest">Phi</span>
            </div>
          </Link>
          <div className="relative">
            <button onClick={() => setShowProfile(v => !v)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-neon-dark border border-neon-blue/30 rounded transition-all">
              <Zap size={10} className="text-neon-pink" />
              <span className="text-xs font-mono text-neon-blue">{user.username?.slice(0, 8).toUpperCase()}</span>
              {user.level && <span className="text-xs font-mono text-neon-purple">L{user.level}</span>}
            </button>
            {showProfile && <ProfileDropdown user={user} onClose={() => setShowProfile(false)} />}
          </div>
        </div>
      </nav>

      {/* Mobile bottom tab bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-neon-darker/95 backdrop-blur-md border-t border-neon-blue/20 md:hidden">
        <div className="flex items-center justify-around h-14 px-1">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link key={to} to={to} className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all min-w-0 flex-1
                ${active ? "text-neon-pink" : "text-gray-600"}`}>
                <Icon size={18} />
                <span className="text-[9px] font-mono uppercase tracking-wide truncate">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

export function ProtectedRoute({ children }) {
  const { token, onboarding } = useAuthStore();
  const location = useLocation();
  if (!token) return <Navigate to="/login" state={{ from: location }} replace />;
  if (onboarding.loading) return null;
  if (onboarding.completed === false) return <Navigate to="/onboarding" replace />;
  return children;
}
