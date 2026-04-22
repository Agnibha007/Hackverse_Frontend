import { create } from "zustand";
import api from "../services/api.js";

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("authToken") || null,
  isNewUser: localStorage.getItem("isNewUser") === "true",
  isLoading: false,
  error: null,

  signup: async (email, password, username) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/auth/signup", { email, password, username });
      const { user, token } = response.data.data;
      localStorage.setItem("authToken", token);
      localStorage.setItem("isNewUser", "true");
      set({ user, token, isLoading: false, isNewUser: true });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || "Signup failed";
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
      localStorage.removeItem("isNewUser"); // Clear isNewUser flag on login
      set({ user, token, isLoading: false, isNewUser: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || "Login failed";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("isNewUser");
    set({ user: null, token: null, isNewUser: false });
  },

  completeOnboarding: () => {
    localStorage.removeItem("isNewUser");
    set({ isNewUser: false });
  },

  deleteAccount: async () => {
    try {
      await api.delete("/auth/account");
      localStorage.removeItem("authToken");
      localStorage.removeItem("isNewUser");
      set({ user: null, token: null, isNewUser: false });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Failed to delete account" };
    }
  },

  fetchProfile: async () => {
    try {
      const response = await api.get("/auth/profile");
      set({ user: response.data.data });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  },

  updateProfile: async (username, profileImageUrl) => {
    try {
      const response = await api.patch("/auth/profile", {
        username,
        profileImageUrl,
      });
      set({ user: response.data.data });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  },

  setToken: (token) => {
    if (token) {
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken");
    }
    set({ token });
  },
}));

export const useMissionStore = create((set) => ({
  missions: [],
  filteredMissions: [],
  isLoading: false,
  error: null,
  overview: null,

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
      set((state) => ({
        missions: [response.data.data, ...state.missions],
      }));
      return { success: true, mission: response.data.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  },

  updateMission: async (missionId, updates) => {
    try {
      const response = await api.patch(`/missions/${missionId}`, updates);
      set((state) => ({
        missions: state.missions.map((m) =>
          m.id === missionId ? response.data.data : m,
        ),
      }));
      return { success: true, mission: response.data.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  },

  deleteMission: async (missionId) => {
    try {
      await api.delete(`/missions/${missionId}`);
      set((state) => ({
        missions: state.missions.filter((m) => m.id !== missionId),
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  },

  fetchOverview: async () => {
    try {
      const response = await api.get("/missions/overview");
      set({ overview: response.data.data });
    } catch (error) {
      console.error("Failed to fetch missions overview:", error);
    }
  },
}));

export const useFocusStore = create((set) => ({
  focusHistory: [],
  currentSession: null,
  dailyMetrics: null,
  weeklyMetrics: null,
  streak: 0,
  isLoading: false,

  recordSession: async (sessionData) => {
    try {
      const response = await api.post("/focus/session", sessionData);
      set((state) => ({
        focusHistory: [response.data.data, ...state.focusHistory],
      }));
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
    } catch (error) {
      set({ isLoading: false });
    }
  },

  fetchDailyMetrics: async (date) => {
    try {
      const response = await api.get(`/focus/daily?date=${date}`);
      set({ dailyMetrics: response.data.data });
    } catch (error) {
      console.error("Failed to fetch daily metrics:", error);
    }
  },

  fetchWeeklyMetrics: async () => {
    try {
      const response = await api.get("/focus/weekly");
      set({ weeklyMetrics: response.data.data });
    } catch (error) {
      console.error("Failed to fetch weekly metrics:", error);
    }
  },

  fetchStreak: async () => {
    try {
      const response = await api.get("/focus/streak");
      set({ streak: response.data.data.streak });
    } catch (error) {
      console.error("Failed to fetch streak:", error);
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
    } catch (error) {
      set({ isLoading: false });
      console.error("Failed to fetch dashboard stats:", error);
    }
  },

  fetchProductivityTrend: async (monthsBack = 1) => {
    try {
      const response = await api.get(
        `/analytics/trend?monthsBack=${monthsBack}`,
      );
      set({ productivityTrend: response.data.data });
    } catch (error) {
      console.error("Failed to fetch productivity trend:", error);
    }
  },

  fetchSystemStats: async () => {
    try {
      const response = await api.get("/analytics/system");
      set({ systemStats: response.data.data });
    } catch (error) {
      console.error("Failed to fetch system stats:", error);
    }
  },
}));

export const useUiStore = create((set) => ({
  toasts: [],

  showToast: ({
    title,
    message = "",
    variant = "success",
    duration = 3000,
  }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    set((state) => ({
      toasts: [...state.toasts, { id, title, message, variant }],
    }));

    window.setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      }));
    }, duration);

    return id;
  },

  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
