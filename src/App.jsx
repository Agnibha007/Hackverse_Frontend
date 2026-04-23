import "@/styles/globals.css";
import React, { useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/index.js";
import { Navigation, ProtectedRoute } from "./components/Layout.jsx";
import { CollectibleToast } from "./components/CollectibleToast.jsx";

const LoginPage = lazy(() => import("./pages/AuthPages.jsx").then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import("./pages/AuthPages.jsx").then(m => ({ default: m.SignupPage })));
const DashboardPage = lazy(() => import("./pages/DashboardPage.jsx").then(m => ({ default: m.DashboardPage })));
const FocusModePage = lazy(() => import("./pages/FocusAndAnalyticsPages.jsx").then(m => ({ default: m.FocusModePage })));
const AnalyticsPage = lazy(() => import("./pages/FocusAndAnalyticsPages.jsx").then(m => ({ default: m.AnalyticsPage })));
const SubjectsPage = lazy(() => import("./pages/SubjectsPage.jsx").then(m => ({ default: m.SubjectsPage })));
const AiMentorPage = lazy(() => import("./pages/AiMentorPage.jsx").then(m => ({ default: m.AiMentorPage })));
const CollectiblesPage = lazy(() => import("./pages/CollectiblesPage.jsx").then(m => ({ default: m.CollectiblesPage })));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage.jsx"));
const VerifyEmailPage = lazy(() => import("./pages/VerifyEmailPage.jsx"));
const GoogleCallbackPage = lazy(() => import("./pages/GoogleCallbackPage.jsx"));

const Loader = () => (
  <div className="flex items-center justify-center min-h-screen bg-neon-black">
    <div className="w-6 h-6 border-2 border-neon-pink/30 border-t-neon-pink rounded-full animate-spin" />
  </div>
);

function App() {
  const { token, fetchProfile, fetchOnboardingStatus, clearOnboardingLoading, onboarding } = useAuthStore();

  useEffect(() => {
    if (token) {
      fetchProfile();
      fetchOnboardingStatus();
    } else {
      clearOnboardingLoading();
    }
  }, [token]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-neon-black text-white overflow-x-hidden">
        {token && <Navigation />}
        <Suspense fallback={<Loader />}>
          <CollectibleToast />
          <Routes>
            <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <LoginPage />} />
            <Route path="/signup" element={token ? <Navigate to="/dashboard" /> : <SignupPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
            <Route path="/onboarding" element={
              token && !onboarding.loading && onboarding.completed
                ? <Navigate to="/dashboard" replace />
                : token && onboarding.loading
                ? <Loader />
                : <OnboardingPage />
            } />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/focus" element={<ProtectedRoute><FocusModePage /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/subjects" element={<ProtectedRoute><SubjectsPage /></ProtectedRoute>} />
            <Route path="/ai" element={<ProtectedRoute><AiMentorPage /></ProtectedRoute>} />
            <Route path="/collectibles" element={<ProtectedRoute><CollectiblesPage /></ProtectedRoute>} />
            <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
            <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
