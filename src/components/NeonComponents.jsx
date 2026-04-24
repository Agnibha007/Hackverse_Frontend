import React from "react";

export function NeonButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
}) {
  const base =
    "relative font-mono font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer overflow-hidden rounded";

  const variants = {
    primary:
      "bg-neon-pink text-white border border-neon-pink hover:shadow-[0_0_20px_rgba(255,0,128,0.8)] active:scale-95",
    secondary:
      "bg-transparent text-neon-blue border-2 border-neon-blue hover:bg-neon-blue hover:text-neon-black hover:shadow-[0_0_20px_rgba(0,234,255,0.8)] active:scale-95",
    tertiary:
      "bg-transparent text-neon-purple border-2 border-neon-purple hover:bg-neon-purple hover:text-white hover:shadow-[0_0_20px_rgba(138,43,226,0.8)] active:scale-95",
    danger:
      "bg-transparent text-red-400 border-2 border-red-500 hover:bg-red-600 hover:text-white active:scale-95",
    ghost:
      "bg-transparent text-gray-400 border border-gray-600 hover:border-neon-pink hover:text-neon-pink active:scale-95",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3 text-base",
    xl: "px-10 py-4 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : ""} ${className}`}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}

export function NeonCard({ children, className = "", glowing = false, variant = "default" }) {
  const variants = {
    default: "border-neon-blue/40",
    pink:    "border-neon-pink/60",
    purple:  "border-neon-purple/60",
    danger:  "border-red-500/60",
  };

  return (
    <div
      className={`
        bg-neon-dark/80 backdrop-blur-sm border rounded-lg p-5
        ${variants[variant]}
        ${glowing
          ? "shadow-[0_0_20px_rgba(255,0,128,0.25),0_0_40px_rgba(138,43,226,0.15),0_0_60px_rgba(0,234,255,0.08)]"
          : "shadow-[0_4px_24px_rgba(0,0,0,0.4)]"}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export function NeonInput({ placeholder, value, onChange, type = "text", className = "", label, id }) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-xs font-mono uppercase tracking-widest text-neon-pink mb-2">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`
          w-full px-4 py-3 bg-neon-darker/80 border border-neon-blue/50 text-white
          placeholder-gray-600 font-mono text-sm rounded
          focus:outline-none focus:border-neon-pink focus:shadow-[0_0_12px_rgba(255,0,128,0.4)]
          transition-all duration-200 ${className}
        `}
      />
    </div>
  );
}

export function GlitchText({ text, className = "" }) {
  return (
    <span className={`relative inline-block font-cyber animate-flicker ${className}`}>
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-neon-blue to-neon-purple"
        style={{ filter: "drop-shadow(0 0 8px rgba(255,0,128,0.5))" }}>
        {text}
      </span>
    </span>
  );
}

export function CircleProgress({ percentage, size = 120, strokeWidth = 6, children = null }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;
  const gradId = `grad-${size}`;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0 -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="transparent" stroke="#1a0a2e" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="transparent"
          stroke={`url(#${gradId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff0080" />
            <stop offset="100%" stopColor="#00eaff" />
          </linearGradient>
        </defs>
      </svg>
      <div className="relative z-10 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}

export function GridBg() {
  return <div className="grid-bg" />;
}

export function ScanlineOverlay() {
  return <div className="scanline-overlay" />;
}

export function Terminal({ children, title = "TERMINAL" }) {
  return (
    <NeonCard className="font-mono text-xs">
      <div className="flex items-center gap-2 pb-3 border-b border-neon-blue/30 mb-3">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
          <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full" />
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
        </div>
        <span className="text-neon-blue font-bold tracking-widest ml-2">{title}</span>
      </div>
      <div className="text-neon-blue/90">{children}</div>
    </NeonCard>
  );
}

export function Badge({ children, variant = "blue" }) {
  const variants = {
    blue:   "bg-neon-blue/10 text-neon-blue border-neon-blue/40",
    pink:   "bg-neon-pink/10 text-neon-pink border-neon-pink/40",
    purple: "bg-neon-purple/10 text-neon-purple border-neon-purple/40",
    green:  "bg-green-500/10 text-green-400 border-green-500/40",
    red:    "bg-red-500/10 text-red-400 border-red-500/40",
    gray:   "bg-gray-500/10 text-gray-400 border-gray-500/40",
  };
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-mono font-bold uppercase tracking-wider border rounded ${variants[variant]}`}>
      {children}
    </span>
  );
}

export function Divider({ label }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-neon-blue/20" />
      {label && <span className="text-xs text-gray-600 font-mono uppercase tracking-widest">{label}</span>}
      <div className="flex-1 h-px bg-neon-blue/20" />
    </div>
  );
}
