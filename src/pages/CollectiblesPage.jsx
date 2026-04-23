import React, { useEffect } from "react";
import { useCollectibleStore } from "../store/index.js";
import { GlitchText, GridBg, ScanlineOverlay, NeonCard } from "../components/NeonComponents.jsx";
import { Gift, Lock } from "lucide-react";

const MEME_META = {
  1:  { title: "First Boot",       desc: "Joined Phi" },
  2:  { title: "Mission Accepted", desc: "Created first mission" },
  3:  { title: "Focus Initiated",  desc: "Logged first session" },
  4:  { title: "aria.ai Unlocked", desc: "First aria.ai message" },
  5:  { title: "Level 2",          desc: "Reached level 2" },
  6:  { title: "Level 3",          desc: "Reached level 3" },
  7:  { title: "Level 4",          desc: "Reached level 4" },
  8:  { title: "Level 5",          desc: "Reached level 5" },
  9:  { title: "Level 6",          desc: "Reached level 6" },
  10: { title: "Level 7",          desc: "Reached level 7" },
  11: { title: "Legendary",        desc: "Reached level 8+" },
};

const ALL_MEME_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export function CollectiblesPage() {
  const { collectibles, fetchCollectibles } = useCollectibleStore();

  useEffect(() => { fetchCollectibles(); }, []);

  const earnedIds = new Set(collectibles.map(c => c.meme_id));

  return (
    <div className="min-h-screen bg-neon-black text-white relative">
      <GridBg />
      <ScanlineOverlay />
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8 pb-20 md:pb-8">
        <div className="mb-6 sm:mb-8">
          <p className="text-xs font-mono tracking-[0.3em] text-gray-600 uppercase mb-1">Earned Rewards</p>
          <GlitchText text="COLLECTIBLES" className="text-3xl sm:text-4xl md:text-5xl font-black block" />
          <p className="text-xs font-mono text-gray-600 mt-2">
            {earnedIds.size} / {ALL_MEME_IDS.length} collected
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {ALL_MEME_IDS.map((memeId) => {
            const earned = earnedIds.has(memeId);
            const meta = MEME_META[memeId];
            const collectible = collectibles.find(c => c.meme_id === memeId);
            return (
              <NeonCard key={memeId}
                className={`relative overflow-hidden transition-all duration-300 ${
                  earned ? "border-neon-pink/40 hover:border-neon-pink/70" : "border-gray-800 opacity-50"
                }`}>
                <div className="relative">
                  {earned ? (
                    <img
                      src={`/memes/meme${memeId}.png`}
                      alt={meta.title}
                      className="w-full aspect-square object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div className={`w-full aspect-square rounded-lg bg-neon-darker flex items-center justify-center ${earned ? "hidden" : "flex"}`}>
                    <Lock size={32} className="text-gray-700" />
                  </div>
                  {earned && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-neon-pink rounded-full flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">✓</span>
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <p className={`text-xs font-cyber font-bold uppercase ${earned ? "text-white" : "text-gray-700"}`}>
                    {meta.title}
                  </p>
                  <p className="text-[10px] font-mono text-gray-600 mt-0.5">{meta.desc}</p>
                  {earned && collectible && (
                    <p className="text-[10px] font-mono text-neon-pink/60 mt-1">
                      {new Date(collectible.earned_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </NeonCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
