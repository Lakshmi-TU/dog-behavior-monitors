// ─────────────────────────────────────────────────────────────
// src/components/ToastContainer.jsx
// Renders all active toast notifications (bottom-right stack).
// ─────────────────────────────────────────────────────────────

import { useApp } from '../context/AppContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-[400] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-2.5 px-4 py-3 rounded-lg text-[13px] text-text
                     shadow-2xl pointer-events-auto animate-toastIn cursor-pointer"
          style={{
            background:  '#0c1017',
            border:      t.type === 'success'
              ? '1px solid rgba(0,230,118,0.5)'
              : '1px solid rgba(255,61,61,0.5)',
            minWidth:    260,
          }}
          onClick={() => removeToast(t.id)}
        >
          <span>{t.type === 'success' ? '✓' : '⚡'}</span>
          <span className="flex-1">{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
