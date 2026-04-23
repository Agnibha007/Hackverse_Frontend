import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/index.js";
import { GlitchText, GridBg, ScanlineOverlay } from "../components/NeonComponents.jsx";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import api from "../services/api.js";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) { setStatus("error"); setError("No verification token found."); return; }

    api.get(`/auth/verify-email?token=${token}`)
      .then((res) => {
        const { user, token: jwt } = res.data.data;
        localStorage.setItem("authToken", jwt);
        useAuthStore.setState({ user, token: jwt });
        setStatus("success");
        setTimeout(() => navigate("/onboarding"), 2000);
      })
      .catch((err) => {
        setStatus("error");
        setError(err.response?.data?.error || "Verification failed. The link may have expired.");
      });
  }, []);

  return (
    <div className="min-h-screen bg-neon-black flex items-center justify-center px-4 relative">
      <GridBg />
      <ScanlineOverlay />
      <div className="relative z-10 w-full max-w-md text-center bg-neon-dark/80 backdrop-blur-md border border-neon-blue/20 rounded-xl p-8">
        <img src="/logo.png" alt="Phi" className="h-12 w-auto mx-auto mb-6" />

        {status === "loading" && (
          <>
            <Loader2 size={32} className="animate-spin text-neon-blue mx-auto mb-4" />
            <p className="text-sm font-mono text-gray-400">VERIFYING YOUR EMAIL...</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle size={32} className="text-green-400 mx-auto mb-4" />
            <p className="text-sm font-mono text-green-400 mb-2">EMAIL VERIFIED</p>
            <p className="text-xs font-mono text-gray-600">Redirecting to setup...</p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle size={32} className="text-red-400 mx-auto mb-4" />
            <p className="text-sm font-mono text-red-400 mb-2">VERIFICATION FAILED</p>
            <p className="text-xs font-mono text-gray-500 mb-6">{error}</p>
            <Link to="/signup" className="text-xs font-mono text-neon-pink hover:text-neon-blue transition-colors">
              ← BACK TO SIGNUP
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
