// ─────────────────────────────────────────────────────────────
// src/components/ControlPanel.jsx
// Authorized action buttons: shock, locate, track, dispatch.
// ─────────────────────────────────────────────────────────────

import { useApp } from '../context/AppContext';

const BUTTONS = [
  { icon: '⚡', label: 'Trigger Shock', sub: 'SELECTED / ALL HIGH', action: 'shock', style: { border: 'rgba(255,61,61,0.5)', bg: 'rgba(255,61,61,0.08)' } },
  { icon: '📍', label: 'Locate All',    sub: 'REFRESH POSITIONS',   action: 'locate', style: { border: 'rgba(0,184,217,0.3)', bg: 'transparent' } },
  { icon: '📡', label: 'Track Path',    sub: 'ENABLE HISTORY',      action: 'track',  style: { border: 'rgba(0,230,118,0.3)', bg: 'transparent' } },
  { icon: '🚐', label: 'Dispatch Team', sub: 'ALERT FIELD UNIT',    action: 'dispatch', style: { border: 'rgba(255,215,64,0.3)', bg: 'transparent' } },
];

export default function ControlPanel({ lastShock, onDispatch }) {
  const { openShock, addToast } = useApp();

  function handleAction(action) {
    if (action === 'shock')    openShock(null);
    else if (action === 'locate')   addToast('📍 Locating all dogs…', 'success');
    else if (action === 'track')    addToast('📡 GPS tracking enabled', 'success');
    else if (action === 'dispatch') { onDispatch(); addToast('🚐 Field team dispatched to Zone 3 — Market St.', 'success'); }
  }

  return (
    <div className="rounded-xl p-4 animate-fadeUp" style={{ background: '#111820', border: '1px solid #1e2d3d' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="font-heading text-white font-bold text-[13px] uppercase tracking-[1px]">🎛️ Control Panel</h3>
        <span
          className="font-mono-sg text-[9px] px-2 py-0.5 rounded-sm tracking-[1px]"
          style={{ background: 'rgba(255,109,0,0.12)', border: '1px solid rgba(255,109,0,0.35)', color: '#ff6d00' }}
        >
          AUTHORIZED
        </span>
      </div>

      <p className="font-mono-sg text-[10px] text-muted mb-2.5 tracking-[1px]">SELECT A DOG FIRST OR ACT ON ALL</p>

      {/* Button grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {BUTTONS.map(({ icon, label, sub, action, style }) => (
          <button
            key={action}
            onClick={() => handleAction(action)}
            className="p-3 rounded-lg text-center cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: style.bg, border: `1px solid ${style.border}` }}
          >
            <div className="text-xl mb-1">{icon}</div>
            <div className="text-[12px] font-semibold text-text">{label}</div>
            <div className="font-mono-sg text-[9px] text-muted tracking-[0.5px] mt-0.5">{sub}</div>
          </button>
        ))}
      </div>

      {/* Last shock info */}
      <div className="p-2.5 rounded-md" style={{ background: '#182030', border: '1px solid #1e2d3d' }}>
        <p className="font-mono-sg text-[9px] text-muted tracking-[1px] mb-1">LAST SHOCK TRIGGERED</p>
        <p className="font-mono-sg text-[11px] text-red">{lastShock}</p>
      </div>
    </div>
  );
}
