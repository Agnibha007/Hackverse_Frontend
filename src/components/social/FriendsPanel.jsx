import React, { useEffect, useState } from "react";
import { useSocialStore, useChatStore } from "../../store/index.js";
import { UserPlus, Users, Search, Check, X, MessageCircle, Trash2, ChevronDown, ChevronUp } from "lucide-react";

const STATUS_DOT = {
  online:   "bg-green-400",
  studying: "bg-neon-blue animate-pulse",
  offline:  "bg-gray-600",
};

function Avatar({ user, size = "sm" }) {
  const sz = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  return (
    <div className={`${sz} rounded-full bg-neon-dark border border-neon-blue/30 flex items-center justify-center font-cyber font-bold text-neon-pink shrink-0 overflow-hidden`}>
      {user.profile_image_url
        ? <img src={user.profile_image_url} alt="" className="w-full h-full object-cover" />
        : (user.callsign || user.username || "?")[0].toUpperCase()}
    </div>
  );
}

function FriendRow({ friend, onChat, onRemove }) {
  const unread = useSocialStore(s => s.unreadCounts[friend.id] || 0);
  return (
    <div className="flex items-center gap-2.5 px-3 py-2 hover:bg-neon-blue/5 rounded-lg group transition-all">
      <div className="relative">
        <Avatar user={friend} />
        <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-neon-darker ${STATUS_DOT[friend.presence_status || "offline"]}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-mono text-white truncate">{friend.callsign || friend.username}</p>
        {friend.presence_status === "studying" && friend.studying_subject
          ? <p className="text-[10px] font-mono text-neon-blue truncate">studying {friend.studying_subject}</p>
          : <p className="text-[10px] font-mono text-gray-700 truncate capitalize">{friend.presence_status || "offline"}</p>
        }
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onChat(friend.id)}
          className="relative p-1.5 text-gray-600 hover:text-neon-blue transition-colors rounded">
          <MessageCircle size={13} />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-neon-pink rounded-full text-[8px] text-white flex items-center justify-center font-bold">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
        <button onClick={() => onRemove(friend.id)}
          className="p-1.5 text-gray-700 hover:text-red-400 transition-colors rounded">
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}

function SearchPanel({ onClose }) {
  const [query, setQuery] = useState("");
  const { searchResults, searchUsers, sendFriendRequest } = useSocialStore();
  const [sent, setSent] = useState({});

  useEffect(() => {
    const t = setTimeout(() => searchUsers(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const handleAdd = async (userId) => {
    const res = await sendFriendRequest(userId);
    if (res.success) setSent(s => ({ ...s, [userId]: true }));
  };

  return (
    <div className="p-3 border-b border-neon-blue/10">
      <div className="relative mb-3">
        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-600" />
        <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Search by username..."
          className="w-full pl-8 pr-3 py-2 bg-neon-dark border border-neon-blue/20 text-white placeholder-gray-700 font-mono text-xs rounded focus:outline-none focus:border-neon-pink transition-all" />
      </div>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {searchResults.map(u => (
          <div key={u.id} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-neon-blue/5">
            <Avatar user={u} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-mono text-white truncate">{u.callsign || u.username}</p>
              <p className="text-[10px] font-mono text-gray-600">LV.{u.level}</p>
            </div>
            {u.relationship === "friends" ? (
              <span className="text-[10px] font-mono text-green-400">Friends</span>
            ) : u.relationship === "request_sent" || sent[u.id] ? (
              <span className="text-[10px] font-mono text-gray-600">Sent</span>
            ) : u.relationship === "request_received" ? (
              <span className="text-[10px] font-mono text-neon-blue">Incoming</span>
            ) : (
              <button onClick={() => handleAdd(u.id)}
                className="p-1.5 bg-neon-pink/10 border border-neon-pink/40 text-neon-pink rounded hover:bg-neon-pink hover:text-white transition-all">
                <UserPlus size={12} />
              </button>
            )}
          </div>
        ))}
        {query.length >= 2 && searchResults.length === 0 && (
          <p className="text-xs font-mono text-gray-700 text-center py-3">No users found</p>
        )}
      </div>
      <button onClick={onClose} className="mt-2 text-xs font-mono text-gray-600 hover:text-gray-400 transition-colors">
        Cancel
      </button>
    </div>
  );
}

function RequestsPanel() {
  const { pendingRequests, respondToRequest } = useSocialStore();
  if (!pendingRequests.length) return null;
  return (
    <div className="border-b border-neon-blue/10 pb-2">
      <p className="text-[10px] font-mono uppercase tracking-widest text-neon-pink px-3 py-2">
        Requests ({pendingRequests.length})
      </p>
      {pendingRequests.map(req => (
        <div key={req.id} className="flex items-center gap-2 px-3 py-1.5">
          <Avatar user={{ username: req.username, callsign: req.callsign, profile_image_url: req.profile_image_url }} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-mono text-white truncate">{req.callsign || req.username}</p>
          </div>
          <button onClick={() => respondToRequest(req.id, "accepted")}
            className="p-1.5 bg-green-500/10 border border-green-500/40 text-green-400 rounded hover:bg-green-500 hover:text-white transition-all">
            <Check size={12} />
          </button>
          <button onClick={() => respondToRequest(req.id, "rejected")}
            className="p-1.5 bg-red-500/10 border border-red-500/40 text-red-400 rounded hover:bg-red-500 hover:text-white transition-all">
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}

export function FriendsPanel() {
  const { friends, fetchFriends, fetchPendingRequests, fetchUnreadCounts, removeFriend, pendingRequests } = useSocialStore();
  const { openChat } = useChatStore();
  const [showSearch, setShowSearch] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    fetchFriends();
    fetchPendingRequests();
    fetchUnreadCounts();
    const t = setInterval(() => { fetchFriends(); fetchUnreadCounts(); }, 15000);
    return () => clearInterval(t);
  }, []);

  const online = friends.filter(f => f.presence_status === "online" || f.presence_status === "studying");
  const offline = friends.filter(f => !f.presence_status || f.presence_status === "offline");

  return (
    <div className="bg-neon-darker border border-neon-blue/20 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-neon-blue/10">
        <div className="flex items-center gap-2">
          <Users size={14} className="text-neon-blue" />
          <span className="text-xs font-mono font-bold text-neon-blue uppercase tracking-widest">Friends</span>
          {pendingRequests.length > 0 && (
            <span className="px-1.5 py-0.5 bg-neon-pink/20 text-neon-pink text-[10px] font-mono rounded-full">
              {pendingRequests.length}
            </span>
          )}
        </div>
        <div className="flex gap-1">
          <button onClick={() => setShowSearch(s => !s)}
            className="p-1.5 text-gray-600 hover:text-neon-pink transition-colors rounded">
            <UserPlus size={13} />
          </button>
          <button onClick={() => setCollapsed(s => !s)}
            className="p-1.5 text-gray-600 hover:text-gray-400 transition-colors rounded">
            {collapsed ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <>
          {showSearch && <SearchPanel onClose={() => setShowSearch(false)} />}
          <RequestsPanel />
          <div className="max-h-72 overflow-y-auto">
            {friends.length === 0 ? (
              <div className="px-3 py-6 text-center">
                <p className="text-xs font-mono text-gray-700">No friends yet</p>
                <button onClick={() => setShowSearch(true)}
                  className="mt-2 text-xs font-mono text-neon-pink hover:text-neon-blue transition-colors">
                  Find people to add
                </button>
              </div>
            ) : (
              <>
                {online.length > 0 && (
                  <>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-gray-600 px-3 pt-2 pb-1">Online — {online.length}</p>
                    {online.map(f => <FriendRow key={f.id} friend={f} onChat={openChat} onRemove={removeFriend} />)}
                  </>
                )}
                {offline.length > 0 && (
                  <>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-gray-600 px-3 pt-2 pb-1">Offline — {offline.length}</p>
                    {offline.map(f => <FriendRow key={f.id} friend={f} onChat={openChat} onRemove={removeFriend} />)}
                  </>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
