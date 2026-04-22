import "@/styles/globals.css";
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/index.js";
import { Navigation, ProtectedRoute } from "./components/Layout.jsx";
import { OnboardingModal } from "./components/OnboardingModal.jsx";
import { ToastViewport } from "./components/ToastViewport.jsx";
import { LoginPage, SignupPage } from "./pages/AuthPages.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { SettingsPage } from "./pages/SettingsPage.jsx";
import {
  FocusModePage,
  AnalyticsPage,
} from "./pages/FocusAndAnalyticsPages.jsx";

function App() {
  const { token, isNewUser, fetchProfile } = useAuthStore();

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-neon-black text-white overflow-x-hidden">
        {token && <Navigation />}
        {token && isNewUser && <OnboardingModal />}
        <ToastViewport />

        <Routes>
          {/* Auth Routes */}
          <Route
            path="/login"
            element={token ? <Navigate to="/dashboard" /> : <LoginPage />}
          />
          <Route
            path="/signup"
            element={token ? <Navigate to="/dashboard" /> : <SignupPage />}
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/focus"
            element={
              <ProtectedRoute>
                <FocusModePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route
            path="/"
            element={<Navigate to={token ? "/dashboard" : "/login"} />}
          />
          <Route
            path="*"
            element={<Navigate to={token ? "/dashboard" : "/login"} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
