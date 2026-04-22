import React from "react";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { useUiStore } from "../store/index.js";

const toastStyles = {
  success: {
    icon: CheckCircle2,
    iconClass: "text-green-300",
    cardClass:
      "border-green-400/50 bg-[linear-gradient(135deg,rgba(34,197,94,0.18),rgba(10,10,15,0.92))] shadow-[0_0_24px_rgba(34,197,94,0.18)]",
  },
  danger: {
    icon: AlertTriangle,
    iconClass: "text-red-300",
    cardClass:
      "border-red-400/50 bg-[linear-gradient(135deg,rgba(239,68,68,0.18),rgba(10,10,15,0.92))] shadow-[0_0_24px_rgba(239,68,68,0.18)]",
  },
  info: {
    icon: Info,
    iconClass: "text-neon-blue",
    cardClass:
      "border-neon-blue/50 bg-[linear-gradient(135deg,rgba(0,234,255,0.14),rgba(10,10,15,0.92))] shadow-[0_0_24px_rgba(0,234,255,0.18)]",
  },
};

export function ToastViewport() {
  const { toasts, dismissToast } = useUiStore();

  return (
    <div className="pointer-events-none fixed top-4 right-4 z-[120] flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => {
        const config = toastStyles[toast.variant] || toastStyles.info;
        const Icon = config.icon;

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-xl border px-4 py-3 backdrop-blur-md animate-toast-in ${config.cardClass}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full border border-white/10 bg-white/5 p-1.5">
                <Icon size={16} className={config.iconClass} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-cyber font-bold uppercase tracking-[0.18em] text-white">
                  {toast.title}
                </p>
                {toast.message ? (
                  <p className="mt-1 text-xs font-mono leading-relaxed text-gray-300">
                    {toast.message}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="text-gray-500 transition-colors hover:text-white"
                aria-label="Dismiss notification"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
