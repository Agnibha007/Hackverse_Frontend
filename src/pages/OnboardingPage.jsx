import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/index.js";
import { NeonInput, GlitchText, GridBg, ScanlineOverlay } from "../components/NeonComponents.jsx";
import { CheckCircle } from "lucide-react";

export default function OnboardingPage() {
  const { onboarding, updateOnboarding } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [callsign, setCallsign] = useState("");
  const [goal, setGoal] = useState("");

  const steps = [
    {
      label: "Choose a call sign",
      sublabel: "This is how you'll be addressed inside the app.",
      content: (
        <NeonInput
          value={callsign}
          onChange={(e) => setCallsign(e.target.value)}
          placeholder="e.g. NightOwl, StudyBot, Apex..."
        />
      ),
      validate: () => callsign.trim().length > 0,
    },
    {
      label: "Set your main objective",
      sublabel: "What are you primarily studying or working towards?",
      content: (
        <NeonInput
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="e.g. JEE 2026, UPSC, Final exams..."
        />
      ),
      validate: () => goal.trim().length > 0,
    },
  ];

  const isLast = step === steps.length - 1;

  const handleNext = async () => {
    setError("");
    if (!steps[step].validate()) {
      setError("Please fill this in before continuing.");
      return;
    }

    if (!isLast) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    const resp = await updateOnboarding(true, steps.length, callsign.trim(), goal.trim());
    setLoading(false);

    if (resp.success) {
      sessionStorage.setItem("showTour", "1");
      navigate("/dashboard");
    } else {
      setError(onboarding.error || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neon-black px-4">
      <GridBg />
      <ScanlineOverlay />
      <div className="bg-neon-dark/80 backdrop-blur-md border border-neon-blue/20 rounded-xl p-6 sm:p-8 w-full max-w-md relative z-10">
        <GlitchText text="AGENT SETUP" className="text-2xl sm:text-3xl font-black block mb-1" />
        <p className="text-xs font-mono text-gray-600 tracking-widest mb-6">INITIALIZING PROFILE</p>

        <div className="flex gap-2 mb-6">
          {steps.map((_, i) => (
            <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-300 ${
              i <= step ? "bg-neon-pink shadow-[0_0_8px_rgba(255,0,128,0.6)]" : "bg-neon-darker"
            }`} />
          ))}
        </div>

        <div className="mb-6">
          <p className="text-xs font-mono uppercase tracking-widest text-neon-blue mb-1">
            Step {step + 1} of {steps.length}
          </p>
          <p className="text-sm font-cyber font-bold text-white mb-1">{steps[step].label}</p>
          <p className="text-xs font-mono text-gray-500 mb-4">{steps[step].sublabel}</p>
          {steps[step].content}
        </div>

        {error && <p className="text-red-400 text-xs font-mono mb-4">{error}</p>}

        <div className="flex gap-3">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)}
              className="px-5 py-3 border border-gray-700 text-gray-400 font-mono text-sm rounded hover:border-gray-500 transition-all">
              BACK
            </button>
          )}
          <button onClick={handleNext} disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-neon-pink text-white font-cyber font-bold uppercase tracking-widest rounded hover:shadow-[0_0_20px_rgba(255,0,128,0.5)] transition-all disabled:opacity-40">
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isLast ? (
              <><CheckCircle size={15} /> LAUNCH</>
            ) : "NEXT"}
          </button>
        </div>
      </div>
    </div>
  );
}
