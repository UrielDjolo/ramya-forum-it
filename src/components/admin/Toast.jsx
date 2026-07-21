import { useEffect } from "react";

export default function Toast({ toasts, onDismiss }) {
  return (
    <div className="fixed top-20 right-6 z-50 flex flex-col gap-3 w-full max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 6000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div className="glass border border-primary/30 rounded-2xl p-4 shadow-2xl flex items-start gap-3 animate-[fadeIn_0.3s_ease-premium] bg-surface-container-high">
      <div className="w-9 h-9 rounded-full bg-primary-container/20 flex items-center justify-center text-primary shrink-0">
        <span className="material-symbols-outlined text-lg">notifications_active</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm">Nouvelle demande</p>
        <p className="text-on-surface-variant text-sm truncate">{toast.message}</p>
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="text-on-surface-variant hover:text-on-surface transition-colors shrink-0"
      >
        <span className="material-symbols-outlined text-lg">close</span>
      </button>
    </div>
  );
}
