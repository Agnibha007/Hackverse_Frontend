import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/index.js";
import { GlitchText, GridBg, ScanlineOverlay } from "../components/NeonComponents.jsx";
import { Zap, User, Lock, Mail, AlertCircle, CheckCircle } from "lucide-react";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const REDIRECT_URI = `${window.location.origin}/auth/google/callback`;

function googleAuthUrl() {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "token",
    scope: "openid email profile",
    prompt: "select_account",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

function GoogleSignInButton() {
  return (
    <a
      href={googleAuthUrl()}
      className="w-full flex items-center justify-center gap-3 py-3 bg-neon-darker border border-neon-blue/30 text-white font-mono text-sm rounded hover:border-neon-blue hover:bg-neon-blue/5 transition-all duration-200"
    >
      <svg width="18" height="18" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.6 5.1C9.6 39.6 16.3 44 24 44z"/>
        <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.2 5.2C40.8 35.5 44 30.2 44 24c0-1.3-.1-2.7-.4-4z"/>
      </svg>
      CONTINUE WITH GOOGLE
    </a>
  );
}

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-neon-black flex items-center justify-center relative overflow-hidden px-4">
      <GridBg />
      <ScanlineOverlay />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-neon-pink/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-neon-blue/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-neon-blue/20" />
      <span className="text-xs font-mono text-gray-700">OR</span>
      <div className="flex-1 h-px bg-neon-blue/20" />
    </div>
  );
}

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await login(email, password);
    if (!result.success) setError(result.error);
  };

  const handleGoogleSuccess = (result) => {
    navigate(result.isNew ? "/onboarding" : "/dashboard");
  };

  return (
    <AuthLayout>
      <div className="bg-neon-dark/80 backdrop-blur-md border border-neon-blue/20 rounded-xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,234,255,0.05)]">
        <div className="text-center mb-6">
          <img src="/logo.png" alt="Phi" className="h-16 w-auto mx-auto mb-3" />
          <p className="text-xs font-mono tracking-[0.3em] text-gray-600 uppercase">Study Command Center</p>
        </div>

        <div className="flex items-center gap-2 mb-5 px-3 py-2 bg-neon-darker/60 border border-neon-blue/10 rounded">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs font-mono text-gray-600">SYSTEM ONLINE · AWAITING AUTHENTICATION</span>
        </div>

        {error && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2.5 bg-red-500/10 border border-red-500/40 rounded text-red-400 text-xs font-mono">
            <AlertCircle size={13} />{error}
          </div>
        )}

        {/* Google Sign-In */}
        <GoogleSignInButton />

        <Divider />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 z-10" />
            <input type="email" placeholder="agent@command.local" value={email}
              onChange={(e) => setEmail(e.target.value)} required
              className="w-full pl-9 pr-4 py-3 bg-neon-darker/80 border border-neon-blue/30 text-white placeholder-gray-700 font-mono text-sm rounded focus:outline-none focus:border-neon-pink focus:shadow-[0_0_12px_rgba(255,0,128,0.3)] transition-all" />
          </div>
          <div className="relative">
            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 z-10" />
            <input type="password" placeholder="••••••••" value={password}
              onChange={(e) => setPassword(e.target.value)} required
              className="w-full pl-9 pr-4 py-3 bg-neon-darker/80 border border-neon-blue/30 text-white placeholder-gray-700 font-mono text-sm rounded focus:outline-none focus:border-neon-pink focus:shadow-[0_0_12px_rgba(255,0,128,0.3)] transition-all" />
          </div>
          <button type="submit" disabled={isLoading}
            className="w-full py-3 mt-1 bg-neon-pink text-white font-cyber font-bold uppercase tracking-widest rounded hover:shadow-[0_0_24px_rgba(255,0,128,0.6)] active:scale-[0.98] transition-all duration-200 disabled:opacity-40">
            {isLoading ? <span className="flex items-center justify-center gap-2"><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />INITIALIZING...</span> : "AUTHENTICATE"}
          </button>
        </form>

        <p className="text-center text-xs font-mono text-gray-700 mt-5">
          NO ACCOUNT?{" "}
          <Link to="/signup" className="text-neon-pink hover:text-neon-blue transition-colors">REGISTER AS AGENT</Link>
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
  const [stage, setStage] = useState("form");
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const { signup, verifyOtp, resendOtp, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await signup(email, password, username);
    if (!result.success) { setError(result.error); return; }
    if (!result.emailSent) { navigate("/onboarding"); return; }
    setStage("otp");
    setResendCooldown(60);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    if (otp.length !== 6) { setError("Enter the 6-digit code from your email."); return; }
    const result = await verifyOtp(email, otp);
    if (result.success) { navigate("/onboarding"); return; }
    setError(result.error);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError("");
    const result = await resendOtp(email);
    if (result.success) setResendCooldown(60);
    else setError(result.error);
  };

  const handleGoogleSuccess = (result) => {
    navigate(result.isNew ? "/onboarding" : "/dashboard");
  };

  if (stage === "otp") {
    return (
      <AuthLayout>
        <div className="bg-neon-dark/80 backdrop-blur-md border border-neon-blue/20 rounded-xl p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-neon-blue/10 border border-neon-blue/30 rounded-full mb-3">
              <Mail size={20} className="text-neon-blue" />
            </div>
            <GlitchText text="CHECK YOUR EMAIL" className="text-xl font-black block mb-1" />
            <p className="text-xs font-mono text-gray-500 mt-1">Code sent to <span className="text-neon-blue">{email}</span></p>
          </div>
          {error && (
            <div className="flex items-center gap-2 mb-4 px-3 py-2.5 bg-red-500/10 border border-red-500/40 rounded text-red-400 text-xs font-mono">
              <AlertCircle size={13} />{error}
            </div>
          )}
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">6-Digit Code</label>
              <input
                type="text" inputMode="numeric" maxLength={6}
                value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="000000" autoFocus
                className="w-full px-4 py-4 bg-neon-darker/80 border border-neon-blue/30 text-white placeholder-gray-700 font-mono text-2xl text-center tracking-[0.5em] rounded focus:outline-none focus:border-neon-pink transition-all"
              />
            </div>
            <button type="submit" disabled={isLoading || otp.length !== 6}
              className="w-full py-3 bg-neon-pink text-white font-cyber font-bold uppercase tracking-widest rounded hover:shadow-[0_0_24px_rgba(255,0,128,0.6)] transition-all disabled:opacity-40">
              {isLoading ? <span className="flex items-center justify-center gap-2"><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />VERIFYING...</span> : "VERIFY"}
            </button>
          </form>
          <div className="flex items-center justify-between mt-4">
            <button onClick={() => { setStage("form"); setOtp(""); setError(""); }}
              className="text-xs font-mono text-gray-600 hover:text-gray-400 transition-colors">Wrong email?</button>
            <button onClick={handleResend} disabled={resendCooldown > 0}
              className="text-xs font-mono text-neon-blue hover:text-neon-pink transition-colors disabled:text-gray-600 disabled:cursor-not-allowed">
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="bg-neon-dark/80 backdrop-blur-md border border-neon-blue/20 rounded-xl p-6 sm:p-8 shadow-[0_0_60px_rgba(138,43,226,0.05)]">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-neon-purple/10 border border-neon-purple/30 rounded-full mb-3">
            <User size={22} className="text-neon-purple" />
          </div>
          <GlitchText text="JOIN THE MISSION" className="text-2xl font-black block mb-1" />
          <p className="text-xs font-mono tracking-[0.3em] text-gray-600 uppercase">Become an Agent</p>
        </div>
        {error && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2.5 bg-red-500/10 border border-red-500/40 rounded text-red-400 text-xs font-mono">
            <AlertCircle size={13} />{error}
          </div>
        )}
        <GoogleSignInButton />
        <Divider />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 z-10" />
            <input type="text" placeholder="agent_codename" value={username}
              onChange={(e) => setUsername(e.target.value)} required
              className="w-full pl-9 pr-4 py-3 bg-neon-darker/80 border border-neon-blue/30 text-white placeholder-gray-700 font-mono text-sm rounded focus:outline-none focus:border-neon-purple focus:shadow-[0_0_12px_rgba(138,43,226,0.3)] transition-all" />
          </div>
          <div className="relative">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 z-10" />
            <input type="email" placeholder="agent@command.local" value={email}
              onChange={(e) => setEmail(e.target.value)} required
              className="w-full pl-9 pr-4 py-3 bg-neon-darker/80 border border-neon-blue/30 text-white placeholder-gray-700 font-mono text-sm rounded focus:outline-none focus:border-neon-purple focus:shadow-[0_0_12px_rgba(138,43,226,0.3)] transition-all" />
          </div>
          <div className="relative">
            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 z-10" />
            <input type="password" placeholder="min. 8 characters" value={password}
              onChange={(e) => setPassword(e.target.value)} required
              className="w-full pl-9 pr-4 py-3 bg-neon-darker/80 border border-neon-blue/30 text-white placeholder-gray-700 font-mono text-sm rounded focus:outline-none focus:border-neon-purple focus:shadow-[0_0_12px_rgba(138,43,226,0.3)] transition-all" />
          </div>
          <button type="submit" disabled={isLoading}
            className="w-full py-3 mt-1 bg-neon-purple text-white font-cyber font-bold uppercase tracking-widest rounded hover:shadow-[0_0_24px_rgba(138,43,226,0.6)] active:scale-[0.98] transition-all duration-200 disabled:opacity-40">
            {isLoading ? <span className="flex items-center justify-center gap-2"><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />INITIALIZING...</span> : "CREATE AGENT"}
          </button>
        </form>
        <p className="text-center text-xs font-mono text-gray-700 mt-5">
          ALREADY AN AGENT?{" "}
          <Link to="/login" className="text-neon-purple hover:text-neon-pink transition-colors">LOGIN HERE</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
