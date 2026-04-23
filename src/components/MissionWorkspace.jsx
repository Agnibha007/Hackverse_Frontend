import React, { useState, useEffect, useRef } from "react";
import { useMissionItemStore } from "../store/index.js";
import { NeonCard, Badge } from "./NeonComponents.jsx";
import {
  X, Plus, Trash2, CheckSquare, Square, MessageSquare,
  List, Zap, Loader2
} from "lucide-react";

const TABS = [
  { key: "todo",    label: "TODOS",    icon: CheckSquare },
  { key: "thought", label: "THOUGHTS", icon: MessageSquare },
  { key: "list",    label: "LISTS",    icon: List },
];

const PRIORITY_COLORS = {
  critical: "border-red-500/70 text-red-400",
  high:     "border-neon-pink/70 text-neon-pink",
  medium:   "border-neon-blue/70 text-neon-blue",
  low:      "border-neon-purple/70 text-neon-purple",
};

export function MissionWorkspace({ mission, onClose, xpAwarded }) {
  const { items, isLoading, fetchItems, addItem, updateItem, removeItem } = useMissionItemStore();
  const [tab, setTab] = useState("todo");
  const [input, setInput] = useState("");
  const [listName, setListName] = useState("");
  const [showXP, setShowXP] = useState(!!xpAwarded);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchItems(mission.id);
    return () => useMissionItemStore.getState().clearItems();
  }, [mission.id]);

  useEffect(() => {
    if (showXP) {
      const t = setTimeout(() => setShowXP(false), 3000);
      return () => clearTimeout(t);
    }
  }, [showXP]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [tab]);

  const tabItems = items.filter((i) => i.type === tab);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await addItem(mission.id, tab, input.trim(), tab === "list" ? listName || "List" : undefined);
    setInput("");
  };

  const handleToggle = (item) => {
    updateItem(mission.id, item.id, { checked: !item.checked });
  };

  // Group list items by list_name
  const listGroups = tab === "list"
    ? tabItems.reduce((acc, item) => {
        const key = item.list_name || "List";
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      }, {})
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-neon-darker border border-neon-blue/30 rounded-xl shadow-[0_0_60px_rgba(0,234,255,0.1)] overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b border-neon-blue/20 shrink-0">
          <div className="flex-1 min-w-0 mr-3">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-mono font-bold px-2 py-0.5 border rounded ${PRIORITY_COLORS[mission.priority] || PRIORITY_COLORS.medium}`}>
                {mission.priority?.toUpperCase()}
              </span>
              <Badge variant="blue">ACTIVE</Badge>
            </div>
            <h2 className="text-base sm:text-lg font-cyber font-black text-white uppercase truncate">
              {mission.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-white border border-gray-700 hover:border-gray-500 rounded transition-all shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* XP toast */}
        {showXP && (
          <div className="mx-4 mt-3 flex items-center gap-2 px-3 py-2 bg-neon-pink/10 border border-neon-pink/40 rounded text-neon-pink text-xs font-mono shrink-0">
            <Zap size={13} />
            +{xpAwarded} XP AWARDED — MISSION ACTIVATED
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-neon-blue/20 shrink-0">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-mono font-bold uppercase tracking-widest transition-all duration-200 ${
                tab === key
                  ? "text-neon-pink border-b-2 border-neon-pink bg-neon-pink/5"
                  : "text-gray-600 hover:text-gray-400"
              }`}
            >
              <Icon size={12} />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{label.slice(0, 4)}</span>
              {items.filter((i) => i.type === key).length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-neon-blue/20 text-neon-blue rounded text-[10px]">
                  {items.filter((i) => i.type === key).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-gray-600">
              <Loader2 size={20} className="animate-spin mr-2" />
              <span className="text-xs font-mono">LOADING...</span>
            </div>
          ) : tab === "list" ? (
            Object.keys(listGroups).length === 0 ? (
              <EmptyState tab={tab} />
            ) : (
              Object.entries(listGroups).map(([name, groupItems]) => (
                <div key={name} className="mb-4">
                  <p className="text-xs font-mono uppercase tracking-widest text-neon-blue mb-2">{name}</p>
                  {groupItems.map((item) => (
                    <ItemRow key={item.id} item={item} missionId={mission.id}
                      onToggle={handleToggle} onDelete={removeItem} showCheck />
                  ))}
                </div>
              ))
            )
          ) : tabItems.length === 0 ? (
            <EmptyState tab={tab} />
          ) : (
            tabItems.map((item) => (
              <ItemRow key={item.id} item={item} missionId={mission.id}
                onToggle={handleToggle} onDelete={removeItem}
                showCheck={tab === "todo"} />
            ))
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleAdd} className="p-4 border-t border-neon-blue/20 shrink-0">
          {tab === "list" && (
            <input
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="List name (optional)"
              className="w-full mb-2 px-3 py-2 bg-neon-dark border border-neon-blue/20 text-white placeholder-gray-700 font-mono text-xs rounded focus:outline-none focus:border-neon-blue transition-all"
            />
          )}
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                tab === "todo" ? "Add a todo..." :
                tab === "thought" ? "Add a thought..." :
                "Add a list item..."
              }
              className="flex-1 px-3 py-2.5 bg-neon-dark border border-neon-blue/30 text-white placeholder-gray-700 font-mono text-sm rounded focus:outline-none focus:border-neon-pink transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-4 py-2.5 bg-neon-pink text-white rounded font-bold hover:shadow-[0_0_16px_rgba(255,0,128,0.5)] transition-all disabled:opacity-30"
            >
              <Plus size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ItemRow({ item, missionId, onToggle, onDelete, showCheck }) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded border transition-all group ${
      item.checked
        ? "bg-neon-dark/30 border-gray-800 opacity-50"
        : "bg-neon-dark/60 border-neon-blue/10 hover:border-neon-blue/30"
    }`}>
      {showCheck && (
        <button onClick={() => onToggle(item)} className="mt-0.5 shrink-0 text-gray-600 hover:text-neon-pink transition-colors">
          {item.checked ? <CheckSquare size={15} className="text-neon-pink" /> : <Square size={15} />}
        </button>
      )}
      <p className={`flex-1 text-sm font-mono leading-relaxed ${item.checked ? "line-through text-gray-600" : "text-gray-300"}`}>
        {item.content}
      </p>
      <button
        onClick={() => onDelete(missionId, item.id)}
        className="shrink-0 opacity-0 group-hover:opacity-100 text-gray-700 hover:text-red-400 transition-all"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}

function EmptyState({ tab }) {
  const msgs = {
    todo:    ["NO TODOS YET", "Add tasks to track your progress"],
    thought: ["NO THOUGHTS YET", "Capture ideas and notes"],
    list:    ["NO LISTS YET", "Create organized lists"],
  };
  const [title, sub] = msgs[tab];
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-gray-700 font-mono text-sm">{title}</p>
      <p className="text-gray-800 font-mono text-xs mt-1">{sub}</p>
    </div>
  );
}
