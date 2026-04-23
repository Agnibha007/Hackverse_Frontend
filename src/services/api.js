import axios from "axios";
import { useAuthStore } from "../store/index.js";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const publicPaths = ["/login", "/signup", "/verify-email", "/auth/google/callback"];
      const isPublic = publicPaths.some(p => window.location.pathname.startsWith(p));
      if (!isPublic) {
        localStorage.removeItem("authToken");
        useAuthStore.setState({
          user: null,
          token: null,
          onboarding: { completed: false, step: 0, loading: false, error: null, callsign: "", mainGoal: "" },
        });
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
