import { create } from "zustand";
import api from "../services/api.js";

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("authToken") || null,
  isLoading: false,
  error: null,
  onboarding: { completed: false, step: 0, loading: true, error: null, callsign: "", mainGoal: "" },

  fetchOnboardingStatus: async () => {
    set((s) => ({ onboarding: { ...s.onboarding, loading: true, error: null } }));
    try {
      const res = await api.get("/auth/user/onboarding-status");
      const { onboarding_completed, onboarding_step, callsign, main_goal } = res.data.data;
      set((s) => ({ onboarding: { ...s.onboarding, completed: onboarding_completed, step: onboarding_step, callsign: callsign || "", mainGoal: main_goal || "", loading: false } }));
      return { success: true };
    } catch (error) {
      set((s) => ({ onboarding: { ...s.onboarding, completed: true, loading: false, error: error.response?.data?.error || "Failed" } }));
      return { success: false };
    }
  },

  updateOnboarding: async (completed, step, callsign, mainGoal) => {
    set((s) => ({ onboarding: { ...s.onboarding, loading: true, error: null } }));
    try {
      const res = await api.post("/auth/user/onboarding", { onboardingCompleted: completed, onboardingStep: step, callsign, mainGoal });
      const { onboarding_completed, onboarding_step, callsign: cs, main_goal } = res.data.data;
      set((s) => ({ onboarding: { ...s.onboarding, completed: onboarding_completed, step: onboarding_step, callsign: cs || "", mainGoal: main_goal || "", loading: false } }));
      return { success: true };
    } catch (error) {
      set((s) => ({ onboarding: { ...s.onboarding, loading: false, error: error.response?.data?.error || "Failed" } }));
      return { success: false };
    }
  },

  signup: async (email, password, username) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/auth/signup", { email, password, username });
      const { user, token, emailSent } = response.data.data;
      if (token) {
        localStorage.setItem("authToken", token);
        set({ user, token, isLoading: false });
        return { success: true, emailSent: false };
      }
      set({ isLoading: false });
      return { success: true, emailSent: true, email };
    } catch (error) {
      const message = error.response?.data?.error || "Signup failed";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  verifyOtp: async (email, otp) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/auth/verify-otp", { email, otp });
      const { user, token } = response.data.data;
      localStorage.setItem("authToken", token);
      set({ user, token, isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || "Invalid code";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  resendOtp: async (email) => {
    try {
      await api.post("/auth/resend-otp", { email });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Failed to resend" };
    }
  },

  googleLogin: async (token, isAccessToken = false) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/auth/google", { idToken: token, isAccessToken });
      const { user, token: jwt, isNew } = response.data.data;
      localStorage.setItem("authToken", jwt);
      set({ user, token: jwt, isLoading: false });
      return { success: true, isNew };
    } catch (error) {
      const message = error.response?.data?.error || "Google login failed";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/auth/login", { email, password });
      const { user, token } = response.data.data;
      localStorage.setItem("authToken", token);
      set({ user, token, isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || "Login failed";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  logout: () => {
    localStorage.removeItem("authToken");
    set({ user: null, token: null, onboarding: { completed: false, step: 0, loading: false, error: null, callsign: "", mainGoal: "" } });
  },

  deleteAccount: async (username) => {
    try {
      await api.delete("/auth/profile", { data: { username } });
      localStorage.removeItem("authToken");
      set({ user: null, token: null, onboarding: { completed: false, step: 0, loading: false, error: null, callsign: "", mainGoal: "" } });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Failed to delete account" };
    }
  },

  fetchProfile: async () => {
    try {
      const response = await api.get("/auth/profile");
      set({ user: response.data.data });
    } catch {}
  },

  updateProfile: async (username, profileImageUrl) => {
    try {
      const response = await api.patch("/auth/profile", {
        username: username || undefined,
        profileImageUrl: profileImageUrl || undefined,
      });
      set({ user: response.data.data });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Failed to update profile" };
    }
  },

  setToken: (token) => {
    if (token) localStorage.setItem("authToken", token);
    else localStorage.removeItem("authToken");
    set({ token });
  },

  clearOnboardingLoading: () =>
    set((s) => ({ onboarding: { ...s.onboarding, loading: false } })),
}));

export const useMissionStore = create((set) => ({
  missions: [],
  isLoading: false,
  error: null,

  fetchMissions: async (filters = {}) => {
    set({ isLoading: true });
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.priority) params.append("priority", filters.priority);
      const response = await api.get(`/missions?${params.toString()}`);
      set({ missions: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.error, isLoading: false });
    }
  },

  createMission: async (missionData) => {
    try {
      const response = await api.post("/missions", missionData);
      set((s) => ({ missions: [response.data.data, ...s.missions] }));
      return { success: true, mission: response.data.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  },

  updateMission: async (missionId, updates) => {
    try {
      const response = await api.patch(`/missions/${missionId}`, updates);
      set((s) => ({ missions: s.missions.map((m) => m.id === missionId ? response.data.data : m) }));
      return { success: true, mission: response.data.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  },

  deleteMission: async (missionId) => {
    try {
      await api.delete(`/missions/${missionId}`);
      set((s) => ({ missions: s.missions.filter((m) => m.id !== missionId) }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  },

  activateMission: async (missionId) => {
    try {
      const response = await api.post(`/missions/${missionId}/activate`);
      const { mission, xpAwarded } = response.data.data;
      set((s) => ({ missions: s.missions.map((m) => m.id === missionId ? mission : m) }));
      return { success: true, mission, xpAwarded };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  },
}));

export const useMissionItemStore = create((set) => ({
  items: [],
  isLoading: false,

  fetchItems: async (missionId) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/missions/${missionId}/items`);
      set({ items: response.data.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addItem: async (missionId, type, content, list_name) => {
    try {
      const response = await api.post(`/missions/${missionId}/items`, { type, content, list_name });
      set((s) => ({ items: [...s.items, response.data.data] }));
      return { success: true, item: response.data.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  },

  updateItem: async (missionId, itemId, updates) => {
    try {
      const response = await api.patch(`/missions/${missionId}/items/${itemId}`, updates);
      set((s) => ({ items: s.items.map((i) => i.id === itemId ? response.data.data : i) }));
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  removeItem: async (missionId, itemId) => {
    try {
      await api.delete(`/missions/${missionId}/items/${itemId}`);
      set((s) => ({ items: s.items.filter((i) => i.id !== itemId) }));
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  clearItems: () => set({ items: [] }),
}));

export const useFocusStore = create((set) => ({
  focusHistory: [],
  dailyMetrics: null,
  weeklyMetrics: null,
  streak: 0,
  dailyGoal: null,
  isLoading: false,

  recordSession: async (sessionData) => {
    try {
      const response = await api.post("/focus/session", sessionData);
      set((s) => ({ focusHistory: [response.data.data, ...s.focusHistory] }));
      return { success: true, session: response.data.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  },

  fetchHistory: async (days = 7) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/focus/history?days=${days}`);
      set({ focusHistory: response.data.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchDailyMetrics: async (date) => {
    try {
      const response = await api.get(`/focus/daily?date=${date}`);
      set({ dailyMetrics: response.data.data });
    } catch {}
  },

  fetchWeeklyMetrics: async () => {
    try {
      const response = await api.get("/focus/weekly");
      set({ weeklyMetrics: response.data.data });
    } catch {}
  },

  fetchStreak: async () => {
    try {
      const response = await api.get("/focus/streak");
      set({ streak: response.data.data.streak });
    } catch {}
  },

  fetchDailyGoal: async () => {
    try {
      const response = await api.get("/focus/goal");
      set({ dailyGoal: response.data.data });
    } catch {}
  },

  setDailyGoal: async (minutes) => {
    try {
      const response = await api.post("/focus/goal", { target_minutes: minutes });
      set({ dailyGoal: response.data.data });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  },
}));

export const useAnalyticsStore = create((set) => ({
  dashboardStats: null,
  productivityTrend: null,
  systemStats: null,
  isLoading: false,

  fetchDashboardStats: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/analytics/dashboard");
      set({ dashboardStats: response.data.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchProductivityTrend: async (monthsBack = 1) => {
    try {
      const response = await api.get(`/analytics/trend?monthsBack=${monthsBack}`);
      set({ productivityTrend: response.data.data });
    } catch {}
  },

  fetchSystemStats: async () => {
    try {
      const response = await api.get("/analytics/system");
      set({ systemStats: response.data.data });
    } catch {}
  },
}));

export const useSubjectStore = create((set) => ({
  subjects: [],
  isLoading: false,

  fetchSubjects: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/subjects");
      set({ subjects: response.data.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  createSubject: async (data) => {
    try {
      const response = await api.post("/subjects", data);
      set((s) => ({ subjects: [...s.subjects, response.data.data] }));
      return { success: true, subject: response.data.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  },

  updateSubject: async (id, data) => {
    try {
      const response = await api.patch(`/subjects/${id}`, data);
      set((s) => ({ subjects: s.subjects.map((sub) => sub.id === id ? response.data.data : sub) }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  },

  deleteSubject: async (id) => {
    try {
      await api.delete(`/subjects/${id}`);
      set((s) => ({ subjects: s.subjects.filter((sub) => sub.id !== id) }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  },
}));

export const useAiStore = create((set) => ({
  messages: [],
  isLoading: false,

  fetchHistory: async () => {
    try {
      const response = await api.get("/ai/history");
      set({ messages: response.data.data });
    } catch {}
  },

  sendMessage: async (message) => {
    set((s) => ({ messages: [...s.messages, { role: "user", content: message }], isLoading: true }));
    try {
      const response = await api.post("/ai/chat", { message });
      const reply = response.data.data.reply;
      set((s) => ({ messages: [...s.messages, { role: "assistant", content: reply }], isLoading: false }));
      return { success: true, reply };
    } catch (error) {
      set(() => ({ isLoading: false }));
      return { success: false, error: error.response?.data?.error };
    }
  },

  clearHistory: async () => {
    try {
      await api.delete("/ai/history");
      set({ messages: [] });
    } catch {}
  },
}));

export const useCollectibleStore = create((set) => ({
  collectibles: [],
  newCollectible: null,

  fetchCollectibles: async () => {
    try {
      const response = await api.get("/collectibles");
      const fetched = response.data.data;
      const seenKey = "phi_seen_collectibles";
      const seen = new Set(JSON.parse(localStorage.getItem(seenKey) || "[]"));
      const brandNew = fetched.find(c => !seen.has(c.id));
      if (brandNew) {
        set({ collectibles: fetched, newCollectible: brandNew });
      } else {
        set({ collectibles: fetched });
      }
      localStorage.setItem(seenKey, JSON.stringify(fetched.map(c => c.id)));
    } catch {}
  },

  awardCollectible: async (memeId, reason) => {
    try {
      const response = await api.post("/collectibles/award", { memeId, reason });
      const collectible = response.data.data;
      if (collectible) {
        set((s) => ({ collectibles: [...s.collectibles, collectible], newCollectible: collectible }));
      }
      return collectible;
    } catch {}
  },

  clearNew: () => set({ newCollectible: null }),
}));

export const useSocialStore = create((set, get) => ({
  friends: [],
  pendingRequests: [],
  sentRequests: [],
  searchResults: [],
  unreadCounts: {},
  friendSessions: [],
  leaderboard: [],
  isLoading: false,

  fetchFriends: async () => {
    try {
      const res = await api.get("/social/friends");
      set({ friends: res.data.data });
    } catch {}
  },

  fetchPendingRequests: async () => {
    try {
      const res = await api.get("/social/friends/requests/pending");
      set({ pendingRequests: res.data.data });
    } catch {}
  },

  fetchSentRequests: async () => {
    try {
      const res = await api.get("/social/friends/requests/sent");
      set({ sentRequests: res.data.data });
    } catch {}
  },

  searchUsers: async (query) => {
    if (!query || query.length < 2) { set({ searchResults: [] }); return; }
    try {
      const res = await api.get(`/social/users/search?q=${encodeURIComponent(query)}`);
      set({ searchResults: res.data.data });
    } catch {}
  },

  sendFriendRequest: async (userId) => {
    try {
      await api.post("/social/friends/request", { userId });
      get().searchUsers("");
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error };
    }
  },

  respondToRequest: async (requestId, action) => {
    try {
      await api.patch(`/social/friends/requests/${requestId}`, { action });
      get().fetchPendingRequests();
      get().fetchFriends();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error };
    }
  },

  removeFriend: async (friendId) => {
    try {
      await api.delete(`/social/friends/${friendId}`);
      set((s) => ({ friends: s.friends.filter(f => f.id !== friendId) }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error };
    }
  },

  updatePresence: async (status, studying_subject) => {
    try {
      await api.post("/social/presence", { status, studying_subject });
    } catch {}
  },

  fetchUnreadCounts: async () => {
    try {
      const res = await api.get("/social/messages/unread");
      const counts = {};
      res.data.data.forEach(r => { counts[r.sender_id] = parseInt(r.count); });
      set({ unreadCounts: counts });
    } catch {}
  },

  fetchFriendSessions: async () => {
    try {
      const res = await api.get("/social/sessions/friends");
      set({ friendSessions: res.data.data });
    } catch {}
  },

  fetchLeaderboard: async () => {
    try {
      const res = await api.get("/social/leaderboard");
      set({ leaderboard: res.data.data });
    } catch {}
  },
}));

export const useChatStore = create((set, get) => ({
  conversations: {},
  activeChat: null,
  incomingToast: null,

  openChat: (friendId) => set({ activeChat: friendId, incomingToast: null }),
  closeChat: () => set({ activeChat: null }),
  clearToast: () => set({ incomingToast: null }),

  fetchConversation: async (friendId) => {
    try {
      const res = await api.get(`/social/messages/${friendId}`);
      const newMsgs = res.data.data;
      const prev = get().conversations[friendId] || [];
      const activeChat = get().activeChat;

      if (newMsgs.length > prev.length && activeChat !== friendId) {
        const latest = newMsgs[newMsgs.length - 1];
        if (latest && latest.sender_id === friendId) {
          const friend = useSocialStore.getState().friends.find(f => f.id === friendId);
          set({ incomingToast: { friendId, senderName: friend?.callsign || friend?.username || "Someone", content: latest.content, ts: Date.now() } });
          setTimeout(() => set((s) => s.incomingToast?.friendId === friendId ? { incomingToast: null } : s), 5000);
        }
      }

      set((s) => ({ conversations: { ...s.conversations, [friendId]: newMsgs } }));
      useSocialStore.setState((s) => {
        const counts = { ...s.unreadCounts };
        delete counts[friendId];
        return { unreadCounts: counts };
      });
    } catch {}
  },

  sendMessage: async (receiverId, content) => {
    try {
      const res = await api.post("/social/messages", { receiverId, content });
      const msg = res.data.data;
      set((s) => ({
        conversations: {
          ...s.conversations,
          [receiverId]: [...(s.conversations[receiverId] || []), msg],
        },
      }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error };
    }
  },
}));

export const useStudySessionStore = create((set) => ({
  currentSession: null,
  isLoading: false,

  createSession: async (subject, durationMinutes) => {
    set({ isLoading: true });
    try {
      const res = await api.post("/social/sessions", { subject, duration_minutes: durationMinutes });
      set({ currentSession: res.data.data, isLoading: false });
      return { success: true, session: res.data.data };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: err.response?.data?.error };
    }
  },

  joinSession: async (sessionId) => {
    set({ isLoading: true });
    try {
      const res = await api.post(`/social/sessions/${sessionId}/join`);
      set({ currentSession: res.data.data, isLoading: false });
      return { success: true, session: res.data.data };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: err.response?.data?.error };
    }
  },

  refreshSession: async (sessionId) => {
    try {
      const res = await api.get(`/social/sessions/${sessionId}`);
      set({ currentSession: res.data.data });
    } catch {}
  },

  endSession: async (sessionId) => {
    try {
      await api.post(`/social/sessions/${sessionId}/end`);
      set({ currentSession: null });
      useSocialStore.getState().updatePresence("online");
    } catch {}
  },

  leaveSession: () => set({ currentSession: null }),
}));

const REMINDERS_KEY = "phi_reminders";

function loadReminders() {
  try { return JSON.parse(localStorage.getItem(REMINDERS_KEY) || "[]"); } catch { return []; }
}

function saveReminders(list) {
  localStorage.setItem(REMINDERS_KEY, JSON.stringify(list));
}

export const useReminderStore = create((set, get) => ({
  reminders: loadReminders(),

  addReminder: (label, time) => {
    const reminder = { id: Date.now().toString(), label, time, fired: false };
    const updated = [...get().reminders, reminder];
    saveReminders(updated);
    set({ reminders: updated });
    return reminder;
  },

  removeReminder: (id) => {
    const updated = get().reminders.filter(r => r.id !== id);
    saveReminders(updated);
    set({ reminders: updated });
  },

  markFired: (id) => {
    const updated = get().reminders.map(r => r.id === id ? { ...r, fired: true } : r);
    saveReminders(updated);
    set({ reminders: updated });
  },

  clearFired: () => {
    const updated = get().reminders.filter(r => !r.fired);
    saveReminders(updated);
    set({ reminders: updated });
  },
}));
