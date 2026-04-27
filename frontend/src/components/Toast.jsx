import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// Toast types config
const TOAST_CONFIG = {
  success: {
    icon: CheckCircle,
    barColor: 'bg-green-500',
    iconColor: 'text-green-400',
    border: 'border-green-500/30',
  },
  error: {
    icon: XCircle,
    barColor: 'bg-[#ff003c]',
    iconColor: 'text-[#ff003c]',
    border: 'border-[#ff003c]/30',
  },
  warning: {
    icon: AlertTriangle,
    barColor: 'bg-yellow-500',
    iconColor: 'text-yellow-400',
    border: 'border-yellow-500/30',
  },
  info: {
    icon: Info,
    barColor: 'bg-blue-500',
    iconColor: 'text-blue-400',
    border: 'border-blue-500/30',
  },
};

// Individual Toast Item
const ToastItem = ({ toast, onRemove }) => {
  const [visible, setVisible] = useState(false);
  const config = TOAST_CONFIG[toast.type] || TOAST_CONFIG.info;
  const Icon = config.icon;

  useEffect(() => {
    // Animate in
    const showTimer = setTimeout(() => setVisible(true), 10);
    // Auto-remove
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(toast.id), 300);
    }, toast.duration || 4000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [toast.id, toast.duration, onRemove]);

  return (
    <div
      className={`relative flex items-start gap-3 w-80 glass-panel rounded-lg border ${config.border} px-4 py-3 shadow-2xl transition-all duration-300 ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
      }`}
    >
      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 h-full w-1 ${config.barColor} rounded-l-lg`}></div>

      <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${config.iconColor}`} />

      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="font-orbitron text-xs font-bold uppercase tracking-widest text-white mb-0.5">
            {toast.title}
          </p>
        )}
        <p className="text-sm text-gray-300 leading-snug">{toast.message}</p>
      </div>

      <button
        onClick={() => {
          setVisible(false);
          setTimeout(() => onRemove(toast.id), 300);
        }}
        className="text-gray-500 hover:text-white transition-colors shrink-0 mt-0.5"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Toast Container (renders in top-right corner)
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-24 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onRemove={removeToast} />
        </div>
      ))}
    </div>
  );
};

// Custom hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, title, message, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (message, title) => addToast({ type: 'success', title, message }),
    error: (message, title) => addToast({ type: 'error', title, message }),
    warning: (message, title) => addToast({ type: 'warning', title, message }),
    info: (message, title) => addToast({ type: 'info', title, message }),
  };

  return { toasts, removeToast, toast };
};
