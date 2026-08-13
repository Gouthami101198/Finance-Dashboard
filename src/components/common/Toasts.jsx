import React from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

export default function Toasts({ toasts, dismiss }) {
  return (
    <div className="toast-stack">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.kind}`}>
          {t.kind === "success" && <CheckCircle2 size={18} />}
          {t.kind === "error" && <XCircle size={18} />}
          {t.kind === "info" && <Info size={18} />}
          <span>{t.message}</span>
          <button aria-label="Dismiss notification" onClick={() => dismiss(t.id)}>
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
