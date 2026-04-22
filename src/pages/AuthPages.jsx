import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/index.js";
import { NeonInput, GlitchText, GridBg, ScanlineOverlay } from "../components/NeonComponents.jsx";
import { Zap, User, Lock, Mail, AlertCircle } from "lucide-react";

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-neon-black flex items-center justify-center relative overflow-hidden">
      <GridBg />
      <ScanlineOverlay />

      {/* Ambient blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-neon-pink/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-neon-blue/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-neon-purple/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-4">
        {children}
      </div>
    </div>
  );
}

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await login(email, password);
    if (!result.success) setError(result.error);
  };

  return (
    <AuthLayout>
      <div className="bg-neon-dark/80 backdrop-blur-md border border-neon-blue/20 rounded-xl p-8 shadow-[0_0_60px_rgba(0,234,255,0.05)]">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-neon-pink/10 border border-neon-pink/30 rounded-full mb-4">
            <Zap size={24} className="text-neon-pink" />
          </div>
          <GlitchText text="NEON DRIVE" className="text-3xl font-black block mb-1" />
          <p className="text-xs font-mono tracking-[0.3em] text-gray-600 uppercase">Study Command Center</p>
        </div>

        {/* Status line */}
        <div className="flex items-center gap-2 mb-6 px-3 py-2 bg-neon-darker/60 border border-neon-blue/10 rounded">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs font-mono text-gray-600">SYSTEM ONLINE · AWAITING AUTHENTICATION</span>
        </div>

        {error && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2.5 bg-red-500/10 border border-red-500/40 rounded text-red-400 text-xs font-mono">
            <AlertCircle size={13} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 z-10" />
            <input
              type="email"
              placeholder="agent@command.local"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-9 pr-4 py-3 bg-neon-darker/80 border border-neon-blue/30 text-white placeholder-gray-700 font-mono text-sm rounded focus:outline-none focus:border-neon-pink focus:shadow-[0_0_12px_rgba(255,0,128,0.3)] transition-all"
            />
          </div>

          <div className="relative">
            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 z-10" />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-9 pr-4 py-3 bg-neon-darker/80 border border-neon-blue/30 text-white placeholder-gray-700 font-mono text-sm rounded focus:outline-none focus:border-neon-pink focus:shadow-[0_0_12px_rgba(255,0,128,0.3)] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-2 bg-neon-pink text-white font-cyber font-bold uppercase tracking-widest rounded hover:shadow-[0_0_24px_rgba(255,0,128,0.6)] active:scale-[0.98] transition-all duration-200 disabled:opacity-40"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                INITIALIZING...
              </span>
            ) : "⚡ AUTHENTICATE"}
          </button>
        </form>

        <p className="text-center text-xs font-mono text-gray-700 mt-6">
          NO ACCOUNT?{" "}
          <Link to="/signup" className="text-neon-pink hover:text-neon-blue transition-colors">
            REGISTER AS AGENT
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const { signup, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await signup(email, password, username);
    if (!result.success) setError(result.error);
  };

  return (
    <AuthLayout>
      <div className="bg-neon-dark/80 backdrop-blur-md border border-neon-blue/20 rounded-xl p-8 shadow-[0_0_60px_rgba(138,43,226,0.05)]">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-neon-purple/10 border border-neon-purple/30 rounded-full mb-4">
            <User size={24} className="text-neon-purple" />
          </div>
          <GlitchText text="JOIN THE MISSION" className="text-2xl font-black block mb-1" />
          <p className="text-xs font-mono tracking-[0.3em] text-gray-600 uppercase">Become an Agent</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2.5 bg-red-500/10 border border-red-500/40 rounded text-red-400 text-xs font-mono">
            <AlertCircle size={13} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 z-10" />
            <input
              type="text"
              placeholder="agent_codename"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full pl-9 pr-4 py-3 bg-neon-darker/80 border border-neon-blue/30 text-white placeholder-gray-700 font-mono text-sm rounded focus:outline-none focus:border-neon-purple focus:shadow-[0_0_12px_rgba(138,43,226,0.3)] transition-all"
            />
          </div>

          <div className="relative">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 z-10" />
            <input
              type="email"
              placeholder="agent@command.local"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-9 pr-4 py-3 bg-neon-darker/80 border border-neon-blue/30 text-white placeholder-gray-700 font-mono text-sm rounded focus:outline-none focus:border-neon-purple focus:shadow-[0_0_12px_rgba(138,43,226,0.3)] transition-all"
            />
          </div>

          <div className="relative">
            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 z-10" />
            <input
              type="password"
              placeholder="min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-9 pr-4 py-3 bg-neon-darker/80 border border-neon-blue/30 text-white placeholder-gray-700 font-mono text-sm rounded focus:outline-none focus:border-neon-purple focus:shadow-[0_0_12px_rgba(138,43,226,0.3)] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-2 bg-neon-purple text-white font-cyber font-bold uppercase tracking-widest rounded hover:shadow-[0_0_24px_rgba(138,43,226,0.6)] active:scale-[0.98] transition-all duration-200 disabled:opacity-40"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                INITIALIZING...
              </span>
            ) : "◇ CREATE AGENT"}
          </button>
        </form>

        <p className="text-center text-xs font-mono text-gray-700 mt-6">
          ALREADY AN AGENT?{" "}
          <Link to="/login" className="text-neon-purple hover:text-neon-pink transition-colors">
            LOGIN HERE
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
