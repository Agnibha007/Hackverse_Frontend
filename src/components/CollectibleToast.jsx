import React from "react";
import { useCollectibleStore } from "../store/index.js";
import { Gift, X } from "lucide-react";

const MEME_META = {
  1: "First Boot", 2: "Mission Accepted", 3: "Focus Initiated",
  4: "aria.ai Unlocked", 5: "Level 2", 6: "Level 3", 7: "Level 4",
  8: "Level 5", 9: "Level 6", 10: "Level 7", 11: "Legendary",
};

export function CollectibleToast() {
  const { newCollectible, clearNew } = useCollectibleStore();
  if (!newCollectible) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-[200] animate-slide-in">
      <div className="flex items-center gap-3 px-4 py-3 bg-neon-darker border border-neon-pink/50 rounded-xl shadow-[0_0_30px_rgba(255,0,128,0.3)] max-w-xs">
        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-neon-pink/30">
          <img src={`/memes/meme${newCollectible.meme_id}.png`} alt="collectible"
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = "none"; }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-mono text-neon-pink uppercase tracking-widest">New Collectible!</p>
          <p className="text-sm font-cyber font-bold text-white truncate">
            {MEME_META[newCollectible.meme_id] || "Rare Drop"}
          </p>
        </div>
        <button onClick={clearNew} className="text-gray-600 hover:text-gray-400 shrink-0">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
