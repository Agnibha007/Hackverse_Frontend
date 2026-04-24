import React, { useEffect, useState } from "react";
import { useSocialStore, useAuthStore } from "../store/index.js";
import { FriendsPanel } from "../components/social/FriendsPanel.jsx";
import { Leaderboard } from "../components/social/Leaderboard.jsx";
import { StudySessionModal } from "../components/social/StudySessionModal.jsx";
import { GlitchText, GridBg, ScanlineOverlay } from "../components/NeonComponents.jsx";
import { Users, Play } from "lucide-react";

export function SocialPage() {
  const { updatePresence } = useSocialStore();
  const { user } = useAuthStore();
  const [showSessionModal, setShowSessionModal] = useState(false);

  useEffect(() => {
    updatePresence("online");
    return () => updatePresence("offline");
  }, []);

  return (
    <div className="min-h-screen bg-neon-black text-white relative">
      <GridBg />
      <ScanlineOverlay />
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8 pb-20 md:pb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <p className="text-xs font-mono tracking-[0.3em] text-gray-600 uppercase mb-1">Social Hub</p>
            <GlitchText text="SQUAD" className="text-3xl sm:text-4xl md:text-5xl font-black block" />
            <p className="text-xs font-mono text-gray-600 mt-1">
              Welcome, <span className="text-neon-blue">{user?.callsign || user?.username}</span>
            </p>
          </div>
          <button onClick={() => setShowSessionModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-neon-blue/10 border border-neon-blue/40 text-neon-blue font-cyber font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-neon-blue hover:text-neon-black transition-all">
            <Play size={14} /> Study Together
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <FriendsPanel />
          </div>
          <div className="space-y-4">
            <Leaderboard />
          </div>
        </div>
      </div>

      {showSessionModal && <StudySessionModal onClose={() => setShowSessionModal(false)} />}
    </div>
  );
}
