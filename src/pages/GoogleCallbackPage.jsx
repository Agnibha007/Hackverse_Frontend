import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/index.js";
import { GlitchText, GridBg, ScanlineOverlay } from "../components/NeonComponents.jsx";
import { Loader2, XCircle } from "lucide-react";

export default function GoogleCallbackPage() {
  const navigate = useNavigate();
  const { googleLogin } = useAuthStore();
  const [error, setError] = useState("");

  useEffect(() => {
    // Google returns access_token in the URL hash for implicit flow
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const errorParam = params.get("error");

    if (errorParam) {
      setError("Google sign-in was cancelled or failed.");
      return;
    }

    if (!accessToken) {
      setError("No token received from Google.");
      return;
    }

    googleLogin(accessToken, true).then((result) => {
      if (result.success) {
        navigate(result.isNew ? "/onboarding" : "/dashboard", { replace: true });
      } else {
        setError(result.error || "Google login failed");
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-neon-black flex items-center justify-center px-4 relative">
      <GridBg />
      <ScanlineOverlay />
      <div className="relative z-10 text-center">
        <img src="/logo.png" alt="Phi" className="h-12 w-auto mx-auto mb-6" />
        {!error ? (
          <>
            <Loader2 size={32} className="animate-spin text-neon-blue mx-auto mb-4" />
            <p className="text-sm font-mono text-gray-400">AUTHENTICATING WITH GOOGLE...</p>
          </>
        ) : (
          <>
            <XCircle size={32} className="text-red-400 mx-auto mb-4" />
            <p className="text-sm font-mono text-red-400 mb-4">{error}</p>
            <a href="/login" className="text-xs font-mono text-neon-pink hover:text-neon-blue transition-colors">
              ← BACK TO LOGIN
            </a>
          </>
        )}
      </div>
    </div>
  );
}
