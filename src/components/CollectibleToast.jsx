import React, { useEffect, useState } from "react";
import { useCollectibleStore } from "../store/index.js";
import { X, Gift } from "lucide-react";

const MEME_META = {
  1:  { title: "First Boot",        desc: "You joined Phi. Welcome to the grid." },
  2:  { title: "Mission Accepted",  desc: "First mission deployed. The grind begins." },
  3:  { title: "Focus Initiated",   desc: "First session logged. Brain.exe is running." },
  4:  { title: "aria.ai Unlocked",  desc: "You talked to aria.ai. She already knows everything." },
  5:  { title: "Level 2",           desc: "100 XP down. The compounding starts now." },
  6:  { title: "Level 3",           desc: "300 XP total. You're actually doing this." },
  7:  { title: "Level 4",           desc: "700 XP. Built different." },
  8:  { title: "Level 5",           desc: "1500 XP. Certified grinder." },
  9:  { title: "Level 6",           desc: "3100 XP. We respect the dedication." },
  10: { title: "Level 7",           desc: "6300 XP. Are you okay? Go touch grass." },
  11: { title: "Legendary",         desc: "12700+ XP. You have ascended." },
};

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 0.8,
  duration: 1.2 + Math.random() * 0.8,
  color: ["#ff0080", "#00eaff", "#8a2be2", "#FFD700", "#ff0080"][Math.floor(Math.random() * 5)],
  size: 4 + Math.random() * 6,
}));

function Particle({ x, delay, duration, color, size }) {
  return (
    <div
      className="absolute top-0 rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        width: size,
        height: size,
        backgroundColor: color,
        animation: `fall ${duration}s ease-in ${delay}s both`,
      }}
    />
  );
}

export function CollectibleToast() {
  const { newCollectible, clearNew } = useCollectibleStore();
  const [visible, setVisible] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (newCollectible) {
      setVisible(false);
      setImgError(false);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      const t = setTimeout(() => { setVisible(false); setTimeout(clearNew, 400); }, 6000);
      return () => clearTimeout(t);
    }
  }, [newCollectible?.id]);

  if (!newCollectible) return null;

  const meta = MEME_META[newCollectible.meme_id] || { title: "Rare Drop", desc: "Something special just dropped." };

  const handleClose = () => {
    setVisible(false);
    setTimeout(clearNew, 300);
  };

  return (
    <>
      <style>{`
        @keyframes fall {
          0%   { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(300px) rotate(720deg); opacity: 0; }
        }
        @keyframes popIn {
          0%   { transform: scale(0.5) translateY(40px); opacity: 0; }
          70%  { transform: scale(1.05) translateY(-4px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes popOut {
          0%   { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.8) translateY(20px); opacity: 0; }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 1; }
        }
      `}</style>

      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative pointer-events-auto"
          style={{ animation: visible ? "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards" : "popOut 0.3s ease-in forwards" }}
        >
          {/* Confetti particles */}
          <div className="absolute inset-0 overflow-visible pointer-events-none">
            {PARTICLES.map(p => <Particle key={p.id} {...p} />)}
          </div>

          {/* Card */}
          <div className="relative w-72 sm:w-80 bg-neon-darker rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(255,0,128,0.4),0_0_40px_rgba(0,234,255,0.2)]">
            {/* Glow border */}
            <div className="absolute inset-0 rounded-2xl border-2 border-neon-pink/60 pointer-events-none" />

            {/* Header */}
            <div className="relative px-5 pt-5 pb-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Gift size={14} className="text-neon-pink" style={{ animation: "shimmer 1s ease-in-out infinite" }} />
                <p className="text-xs font-mono uppercase tracking-[0.3em] text-neon-pink font-bold">
                  New Collectible Dropped
                </p>
                <Gift size={14} className="text-neon-pink" style={{ animation: "shimmer 1s ease-in-out 0.5s infinite" }} />
              </div>
              <button onClick={handleClose}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-400 transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Meme image */}
            <div className="px-5 pb-4">
              <div className="relative rounded-xl overflow-hidden border border-neon-pink/30 shadow-[0_0_20px_rgba(255,0,128,0.2)]">
                {!imgError ? (
                  <img
                    src={`/memes/meme${newCollectible.meme_id}.png`}
                    alt={meta.title}
                    className="w-full aspect-square object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="w-full aspect-square bg-neon-dark flex items-center justify-center">
                    <Gift size={48} className="text-neon-pink/40" />
                  </div>
                )}
                {/* Collectible number badge */}
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-neon-pink text-white text-[10px] font-mono font-bold rounded-full">
                  #{String(newCollectible.meme_id).padStart(3, "0")}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="px-5 pb-5 text-center">
              <p className="text-base font-cyber font-black text-white mb-1">{meta.title}</p>
              <p className="text-xs font-mono text-gray-500 leading-relaxed">{meta.desc}</p>
              <button onClick={handleClose}
                className="mt-4 w-full py-2.5 bg-neon-pink text-white font-cyber font-bold uppercase tracking-widest text-sm rounded-lg hover:shadow-[0_0_20px_rgba(255,0,128,0.5)] transition-all">
                Claim
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
