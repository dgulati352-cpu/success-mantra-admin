import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const Toast = () => {
  const { toasts, removeToast } = useAdmin();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let bg = 'bg-slate-900 border-blue-500/40 text-blue-300';
        let Icon = Info;

        if (toast.type === 'success') {
          bg = 'bg-slate-900 border-emerald-500/40 text-emerald-300';
          Icon = CheckCircle2;
        } else if (toast.type === 'warning') {
          bg = 'bg-slate-900 border-amber-500/40 text-amber-300';
          Icon = AlertTriangle;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl border ${bg} shadow-2xl backdrop-blur-xl flex items-start space-x-3 transform transition-all duration-300 animate-slide-up`}
          >
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-xs font-semibold leading-relaxed">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
