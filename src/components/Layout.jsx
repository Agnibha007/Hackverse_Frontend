import React from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/index.js";
import { GlitchText } from "./NeonComponents.jsx";
import { LayoutDashboard, Crosshair, BarChart3, LogOut, Zap, Settings } from "lucide-react";

const navLinks = [
  { to: "/dashboard", label: "Command", icon: LayoutDashboard },
  { to: "/focus",     label: "Focus",   icon: Crosshair },
  { to: "/analytics", label: "Stats",   icon: BarChart3 },
  { to: "/settings",  label: "Config",  icon: Settings },
];

export function Navigation() {
  const { user, logout } = useAuthStore();
  const { pathname } = useLocation();

  if (!user) return null;

  return (
    <nav className="sticky top-0 z-50 bg-neon-darker/95 backdrop-blur-md border-b border-neon-blue/20">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <span className="text-neon-pink text-xl font-cyber font-black tracking-widest group-hover:text-neon-blue transition-colors duration-200">
            ◇ NEON DRIVE
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`
                  flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold uppercase tracking-widest rounded transition-all duration-200
                  ${active
                    ? "text-neon-pink bg-neon-pink/10 shadow-[0_0_12px_rgba(255,0,128,0.3)]"
                    : "text-gray-500 hover:text-neon-blue hover:bg-neon-blue/5"
                  }
                `}
              >
                <Icon size={13} />
                {label}
              </Link>
            );
          })}
        </div>

        {/* User info + logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neon-dark border border-neon-blue/30 rounded">
            <Zap size={11} className="text-neon-pink" />
            <span className="text-xs font-mono text-neon-blue tracking-wider">
              {user.username?.toUpperCase()}
            </span>
            {user.level && (
              <span className="text-xs font-mono text-neon-purple ml-1">LV.{user.level}</span>
            )}
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-gray-500 border border-gray-700 rounded hover:border-red-500 hover:text-red-400 transition-all duration-200"
          >
            <LogOut size={11} />
            EXIT
          </button>
        </div>
      </div>

      {/* Active page indicator bar */}
      <div className="h-px bg-gradient-to-r from-transparent via-neon-pink/50 to-transparent" />
    </nav>
  );
}

export function ProtectedRoute({ children }) {
  const { token } = useAuthStore();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
