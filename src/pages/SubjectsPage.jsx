import React, { useEffect, useState } from "react";
import { useSubjectStore } from "../store/index.js";
import { NeonCard, GlitchText, GridBg, ScanlineOverlay, Badge } from "../components/NeonComponents.jsx";
import { Plus, Trash2, BookOpen, Clock, Target, X, Pencil } from "lucide-react";

const COLORS = [
  { value: "pink",   label: "Pink",   cls: "bg-neon-pink",   text: "text-neon-pink",   border: "border-neon-pink/50" },
  { value: "blue",   label: "Blue",   cls: "bg-neon-blue",   text: "text-neon-blue",   border: "border-neon-blue/50" },
  { value: "purple", label: "Purple", cls: "bg-neon-purple", text: "text-neon-purple", border: "border-neon-purple/50" },
  { value: "green",  label: "Green",  cls: "bg-green-400",   text: "text-green-400",   border: "border-green-400/50" },
  { value: "yellow", label: "Yellow", cls: "bg-yellow-400",  text: "text-yellow-400",  border: "border-yellow-400/50" },
  { value: "red",    label: "Red",    cls: "bg-red-400",     text: "text-red-400",     border: "border-red-400/50" },
];

const colorMap = Object.fromEntries(COLORS.map(c => [c.value, c]));

function SubjectForm({ initial, onSubmit, onCancel }) {
  const [name, setName] = useState(initial?.name || "");
  const [color, setColor] = useState(initial?.color || "blue");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), color });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Subject Name</label>
        <input
          value={name} onChange={(e) => setName(e.target.value)} required autoFocus
          placeholder="e.g. Mathematics, Physics..."
          className="w-full px-4 py-3 bg-neon-darker/80 border border-neon-blue/30 text-white placeholder-gray-700 font-mono text-sm rounded focus:outline-none focus:border-neon-pink transition-all"
        />
      </div>
      <div>
        <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Color</label>
        <div className="flex gap-2">
          {COLORS.map((c) => (
            <button key={c.value} type="button" onClick={() => setColor(c.value)}
              className={`w-8 h-8 rounded-full ${c.cls} transition-all ${color === c.value ? "ring-2 ring-white ring-offset-2 ring-offset-neon-darker scale-110" : "opacity-60 hover:opacity-100"}`}
            />
          ))}
        </div>
      </div>
      <div className="flex gap-3 pt-1">
        <button type="submit"
          className="flex-1 py-2.5 bg-neon-pink text-white font-cyber font-bold uppercase tracking-widest text-sm rounded hover:shadow-[0_0_16px_rgba(255,0,128,0.4)] transition-all">
          {initial ? "UPDATE" : "CREATE"}
        </button>
        <button type="button" onClick={onCancel}
          className="px-5 py-2.5 border border-gray-700 text-gray-500 font-mono text-sm rounded hover:border-gray-500 transition-all">
          CANCEL
        </button>
      </div>
    </form>
  );
}

export function SubjectsPage() {
  const { subjects, isLoading, fetchSubjects, createSubject, updateSubject, deleteSubject } = useSubjectStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchSubjects(); }, []);

  const handleCreate = async (data) => {
    const result = await createSubject(data);
    if (result.success) setShowForm(false);
  };

  const handleUpdate = async (id, data) => {
    await updateSubject(id, data);
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this subject? Missions and sessions will be unlinked.")) {
      await deleteSubject(id);
    }
  };

  return (
    <div className="min-h-screen bg-neon-black text-white relative">
      <GridBg />
      <ScanlineOverlay />
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8 pb-20 md:pb-8">
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <p className="text-xs font-mono tracking-[0.3em] text-gray-600 uppercase mb-1">Study Domains</p>
            <GlitchText text="SUBJECTS" className="text-3xl sm:text-4xl md:text-5xl font-black block" />
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-neon-pink text-white font-cyber font-bold uppercase tracking-widest text-sm rounded hover:shadow-[0_0_16px_rgba(255,0,128,0.4)] transition-all">
            <Plus size={14} /> NEW SUBJECT
          </button>
        </div>

        {showForm && (
          <NeonCard glowing className="border-neon-pink/50 mb-6">
            <p className="text-xs font-mono uppercase tracking-widest text-neon-pink mb-4">Create Subject</p>
            <SubjectForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
          </NeonCard>
        )}

        {isLoading ? (
          <div className="text-center py-20 text-gray-600 font-mono text-sm">LOADING...</div>
        ) : subjects.length === 0 ? (
          <NeonCard className="text-center py-20 border-dashed border-neon-blue/20">
            <BookOpen size={40} className="text-gray-700 mx-auto mb-4" />
            <p className="text-gray-600 font-mono text-sm">NO SUBJECTS YET</p>
            <p className="text-gray-700 font-mono text-xs mt-1">Create subjects to track study time by domain</p>
          </NeonCard>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => {
              const c = colorMap[subject.color] || colorMap.blue;
              return (
                <NeonCard key={subject.id} className={`border-l-4 ${c.border} border-neon-blue/10`}>
                  {editingId === subject.id ? (
                    <SubjectForm
                      initial={subject}
                      onSubmit={(data) => handleUpdate(subject.id, data)}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${c.cls}`} />
                          <h3 className={`font-cyber font-bold text-base uppercase ${c.text}`}>{subject.name}</h3>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => setEditingId(subject.id)}
                            className="p-1.5 text-gray-600 hover:text-neon-blue transition-colors">
                            <Pencil size={13} />
                          </button>
                          <button onClick={() => handleDelete(subject.id)}
                            className="p-1.5 text-gray-600 hover:text-red-400 transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                          <p className={`text-xl font-cyber font-black ${c.text}`}>{subject.total_focus_minutes || 0}</p>
                          <p className="text-[10px] font-mono text-gray-600 mt-0.5">MIN STUDIED</p>
                        </div>
                        <div>
                          <p className={`text-xl font-cyber font-black ${c.text}`}>{subject.completed_missions || 0}</p>
                          <p className="text-[10px] font-mono text-gray-600 mt-0.5">COMPLETED</p>
                        </div>
                        <div>
                          <p className={`text-xl font-cyber font-black ${c.text}`}>{subject.mission_count || 0}</p>
                          <p className="text-[10px] font-mono text-gray-600 mt-0.5">MISSIONS</p>
                        </div>
                      </div>
                      {subject.total_focus_minutes > 0 && (
                        <div className="mt-4">
                          <div className="w-full bg-neon-darker rounded-full h-1 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${c.cls} opacity-70 transition-all duration-700`}
                              style={{ width: `${Math.min((subject.total_focus_minutes / 600) * 100, 100)}%` }}
                            />
                          </div>
                          <p className="text-[10px] font-mono text-gray-700 mt-1">
                            {Math.round(subject.total_focus_minutes / 60 * 10) / 10}h total
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </NeonCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
