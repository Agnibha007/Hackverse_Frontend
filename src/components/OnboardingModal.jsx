import React, { useState } from "react";
import { useAuthStore } from "../store/index.js";
import { NeonCard, GlitchText } from "./NeonComponents.jsx";
import { Zap, Target, Activity, Award, ChevronRight } from "lucide-react";

const steps = [
  {
    title: "WELCOME, AGENT",
    description: "You've joined the Neon Drive command center. Your mission: maximize productivity through gamified focus sessions.",
    icon: Zap,
  },
  {
    title: "MISSIONS",
    description: "Create tasks as missions with priority levels and deadlines. Complete them to earn XP and level up your agent profile.",
    icon: Target,
  },
  {
    title: "FOCUS MODE",
    description: "Track deep work sessions with quality ratings. Build daily streaks and watch your productivity metrics soar.",
    icon: Activity,
  },
  {
    title: "LEVEL UP",
    description: "Earn XP from completed missions. Every 100 XP = 1 level. Track your progress in real-time analytics.",
    icon: Award,
  },
];

export function OnboardingModal() {
  const { completeOnboarding } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neon-black/95 backdrop-blur-md p-4">
      <NeonCard glowing className="max-w-lg w-full border-neon-pink/50 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-pink/80 to-transparent" />

        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.35em] text-neon-blue">
              Onboarding
            </p>
            <p className="text-xs font-mono text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
          <button
            onClick={completeOnboarding}
            className="rounded-full border border-gray-700 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.22em] text-gray-500 transition-all hover:border-neon-blue/50 hover:text-neon-blue"
          >
            Skip Tour
          </button>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentStep ? "w-8 bg-neon-pink" : i < currentStep ? "w-1.5 bg-neon-blue" : "w-1.5 bg-gray-700"
              }`}
            />
          ))}
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-neon-pink/10 border border-neon-pink/30 flex items-center justify-center">
            <Icon size={32} className="text-neon-pink" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <GlitchText text={step.title} className="text-2xl font-black block mb-4" />
          <p className="text-gray-400 font-mono text-sm leading-relaxed">{step.description}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-6 py-3 border border-gray-700 text-gray-500 font-mono text-sm rounded hover:border-gray-500 transition-all"
            >
              BACK
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-neon-pink text-white font-cyber font-bold uppercase tracking-widest rounded hover:shadow-[0_0_20px_rgba(255,0,128,0.6)] transition-all"
          >
            {currentStep === steps.length - 1 ? "START MISSION" : "NEXT"}
            <ChevronRight size={16} />
          </button>
        </div>
      </NeonCard>
    </div>
  );
}
