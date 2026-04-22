import React, { useState } from "react";
import { useAuthStore, useUiStore } from "../store/index.js";
import { useNavigate } from "react-router-dom";
import { Badge, NeonCard, GlitchText, GridBg, ScanlineOverlay } from "../components/NeonComponents.jsx";
import { User, Mail, Shield, Trash2, AlertTriangle } from "lucide-react";

export function SettingsPage() {
  const { user, updateProfile, deleteAccount } = useAuthStore();
  const { showToast } = useUiStore();
  const navigate = useNavigate();

  const [username, setUsername] = useState(user?.username || "");
  const [profileImageUrl, setProfileImageUrl] = useState(user?.profile_image_url || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteMatch = deleteConfirm === "DELETE";

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const result = await updateProfile(username, profileImageUrl || undefined);
    setIsUpdating(false);
    if (result.success) {
      showToast({
        title: "Profile Updated",
        message: "Your agent profile changes are now live.",
        variant: "success",
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") return;
    setIsDeleting(true);
    const result = await deleteAccount();
    setIsDeleting(false);
    if (result.success) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-neon-black text-white relative">
      <GridBg />
      <ScanlineOverlay />

      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-neon-purple/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <GlitchText text="SETTINGS" className="text-4xl font-black block mb-2" />
          <p className="text-xs font-mono tracking-[0.3em] text-gray-600 uppercase">Agent Configuration</p>
        </div>

        {/* Profile Section */}
        <NeonCard className="border-neon-blue/30 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <User size={20} className="text-neon-blue" />
            <h2 className="text-lg font-cyber font-bold text-neon-blue uppercase">Profile</h2>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-neon-darker/80 border border-neon-blue/30 text-white font-mono text-sm rounded focus:outline-none focus:border-neon-pink transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">
                Profile Image URL (optional)
              </label>
              <input
                type="url"
                value={profileImageUrl}
                onChange={(e) => setProfileImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 bg-neon-darker/80 border border-neon-blue/30 text-white placeholder-gray-700 font-mono text-sm rounded focus:outline-none focus:border-neon-pink transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Email</label>
              <div className="flex items-center gap-2 px-4 py-3 bg-neon-darker/40 border border-gray-700 rounded">
                <Mail size={14} className="text-gray-600" />
                <span className="text-sm font-mono text-gray-500">{user?.email}</span>
                <span className="ml-auto text-xs font-mono text-gray-700">READ ONLY</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="px-6 py-3 bg-neon-blue text-white font-cyber font-bold uppercase tracking-widest rounded hover:shadow-[0_0_20px_rgba(0,234,255,0.6)] transition-all disabled:opacity-40"
            >
              {isUpdating ? "UPDATING..." : "SAVE CHANGES"}
            </button>
          </form>
        </NeonCard>

        {/* Account Stats */}
        <NeonCard className="border-neon-purple/30 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield size={20} className="text-neon-purple" />
            <h2 className="text-lg font-cyber font-bold text-neon-purple uppercase">Account Info</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-mono text-gray-600 mb-1">LEVEL</p>
              <p className="text-2xl font-cyber font-black text-neon-purple">{user?.level || 1}</p>
            </div>
            <div>
              <p className="text-xs font-mono text-gray-600 mb-1">XP POINTS</p>
              <p className="text-2xl font-cyber font-black text-neon-pink">{user?.xp_points || 0}</p>
            </div>
            <div>
              <p className="text-xs font-mono text-gray-600 mb-1">FOCUS STREAK</p>
              <p className="text-2xl font-cyber font-black text-neon-blue">{user?.focus_streak || 0} days</p>
            </div>
            <div>
              <p className="text-xs font-mono text-gray-600 mb-1">TOTAL FOCUS</p>
              <p className="text-2xl font-cyber font-black text-green-400">{user?.total_focus_minutes || 0}m</p>
            </div>
          </div>
        </NeonCard>

        {/* Danger Zone */}
        <NeonCard
          variant="danger"
          className="mb-8 border-red-500/60 bg-[linear-gradient(180deg,rgba(127,29,29,0.22),rgba(10,10,15,0.92))] shadow-[0_0_0_1px_rgba(239,68,68,0.16),0_0_36px_rgba(239,68,68,0.12)]"
        >
          <div className="mb-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AlertTriangle size={20} className="text-red-400" />
              <h2 className="text-lg font-cyber font-bold text-red-400 uppercase">Danger Zone</h2>
            </div>
            <Badge variant="red">Critical</Badge>
          </div>

          <div className="rounded-xl border border-red-500/45 bg-red-950/20 p-4">
            <p className="text-sm font-mono text-red-100/70 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/55 text-red-300 font-cyber font-bold uppercase tracking-widest rounded hover:bg-red-500/20 hover:shadow-[0_0_24px_rgba(239,68,68,0.18)] transition-all"
            >
              <Trash2 size={16} />
              DELETE ACCOUNT
            </button>
          </div>
        </NeonCard>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neon-black/95 backdrop-blur-md p-4">
          <NeonCard variant="danger" className="max-w-md w-full border-red-500/50">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full mb-4">
                <AlertTriangle size={32} className="text-red-400" />
              </div>
              <h3 className="text-xl font-cyber font-black text-red-400 mb-2">CONFIRM DELETION</h3>
              <p className="text-sm font-mono text-gray-500">
                This will permanently delete your account, all missions, focus sessions, and analytics data.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">
                Type <span className="text-red-400 font-bold">DELETE</span> to confirm
              </label>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="DELETE"
                autoCapitalize="characters"
                spellCheck={false}
                className={`w-full px-4 py-3 bg-neon-darker/80 border text-white placeholder-gray-700 font-mono text-sm rounded focus:outline-none transition-all ${
                  deleteMatch
                    ? "border-red-400 shadow-[0_0_18px_rgba(239,68,68,0.18)]"
                    : "border-red-500/30 focus:border-red-500"
                }`}
              />
              <p className={`mt-2 text-[11px] font-mono uppercase tracking-[0.24em] ${deleteMatch ? "text-red-300" : "text-gray-600"}`}>
                {deleteMatch ? "Phrase accepted" : "Exact phrase required"}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirm("");
                }}
                className="flex-1 px-6 py-3 border border-gray-700 text-gray-500 font-mono text-sm rounded hover:border-gray-500 transition-all"
              >
                CANCEL
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={!deleteMatch || isDeleting}
                className="flex-1 px-6 py-3 bg-red-600 text-white font-cyber font-bold uppercase tracking-widest rounded hover:bg-red-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isDeleting ? "DELETING..." : "DELETE"}
              </button>
            </div>
          </NeonCard>
        </div>
      )}
    </div>
  );
}
