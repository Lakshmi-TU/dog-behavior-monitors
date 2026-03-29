// ─────────────────────────────────────────────────────────────
// src/components/ShockConfirm.jsx
// Confirmation dialog before triggering a corrective shock.
// ─────────────────────────────────────────────────────────────

import { useApp } from '../context/AppContext';

export default function ShockConfirm({ onConfirm }) {
  const { shockDog, closeShock, addToast } = useApp();

  // shockDog === undefined  → modal closed
  // shockDog === null       → act on ALL high-risk dogs
  // shockDog === <dog obj>  → act on specific dog
  if (shockDog === undefined) return null;

  const targetLabel = shockDog
    ? `${shockDog.emoji} ${shockDog.name} (${shockDog.id})`
    : 'all HIGH RISK dogs';

  function handleConfirm() {
    closeShock();
    onConfirm(shockDog);
    addToast(`⚡ Shock triggered for ${shockDog ? shockDog.name : 'ALL HIGH RISK'}. Action logged.`, 'error');
  }

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.85)' }}
    >
      <div
        className="rounded-xl p-7 w-full max-w-sm text-center animate-modalIn"
        style={{ background: '#0c1017', border: '1px solid #ff3d3d' }}
      >
        <div className="text-[40px] mb-3">⚡</div>
        <h2 className="font-heading text-red font-bold text-[18px] mb-2">CONFIRM SHOCK TRIGGER</h2>
        <p className="text-[13px] text-muted mb-5 leading-relaxed">
          Are you sure you want to trigger a corrective shock for{' '}
          <strong className="text-text">{targetLabel}</strong>?{' '}
          This action will be logged.
        </p>
        <div className="flex gap-2.5 justify-center">
          <button
            onClick={closeShock}
            className="px-5 py-2 rounded-md text-[13px] font-medium transition-all hover:border-border2"
            style={{ background: '#111820', border: '1px solid #1e2d3d', color: '#c8d8e8' }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2 rounded-md text-[13px] font-semibold transition-all"
            style={{ background: 'rgba(255,61,61,0.2)', border: '1px solid #ff3d3d', color: '#ff3d3d' }}
          >
            ⚡ Confirm Trigger
          </button>
        </div>
      </div>
    </div>
  );
}
