// ─────────────────────────────────────────────────────────────
// src/components/HistoryPanel.jsx
// Two sub-panels:
//   RValueMeter   — horizontal risk bar per dog (top 7)
//   BatteryStatus — battery percentage bars per dog
// ─────────────────────────────────────────────────────────────

import { useApp } from '../context/AppContext';

const RISK_COLOR = {
  high:   { bar: 'linear-gradient(90deg,#ff6d00,#ff3d3d)', text: '#ff3d3d' },
  medium: { bar: 'linear-gradient(90deg,#ffab00,#ffd740)', text: '#ffd740' },
  low:    { bar: 'linear-gradient(90deg,#00c853,#00e676)', text: '#00e676' },
};

/* ── R-Value Meter ── */
export function RValueMeter({ dogs }) {
  const { openDogModal } = useApp();
  const sorted = [...dogs].sort((a, b) => b.r - a.r).slice(0, 8);

  return (
    <div className="rounded-xl p-4 animate-fadeUp" style={{ background: '#111820', border: '1px solid #1e2d3d' }}>
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="font-heading text-white font-bold text-[13px] uppercase tracking-[1px]">⚡ R-Value Meter</h3>
        <span
          className="font-mono-sg text-[9px] px-2 py-0.5 rounded-sm tracking-[1px]"
          style={{ background: 'rgba(0,184,217,0.12)', border: '1px solid rgba(0,184,217,0.3)', color: '#00b8d9' }}
        >
          RISK SCORE
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {sorted.map((dog) => {
          const rc = RISK_COLOR[dog.risk];
          return (
            <button
              key={dog.id}
              onClick={() => openDogModal(dog)}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-md w-full text-left transition-all duration-150 hover:border-cyan"
              style={{ background: '#182030', border: '1px solid #1e2d3d' }}
            >
              {/* Dog info */}
              <div className="flex items-center gap-2 min-w-[88px]">
                <span className="text-base">{dog.emoji}</span>
                <div>
                  <p className="text-[12px] font-semibold text-white leading-none">{dog.name}</p>
                  <p className="font-mono-sg text-[9px] text-muted">{dog.id}</p>
                </div>
              </div>

              {/* Bar */}
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#1e2d3d' }}>
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${dog.r}%`, background: rc.bar }}
                />
              </div>

              {/* Score */}
              <span
                className="font-mono-sg text-[13px] font-medium min-w-[34px] text-right"
                style={{ color: rc.text }}
              >
                {dog.r}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Battery Status ── */
export function BatteryStatus({ dogs }) {
  return (
    <div className="rounded-xl p-4 animate-fadeUp" style={{ background: '#111820', border: '1px solid #1e2d3d' }}>
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="font-heading text-white font-bold text-[13px] uppercase tracking-[1px]">🔋 Device Battery</h3>
        <span
          className="font-mono-sg text-[9px] px-2 py-0.5 rounded-sm tracking-[1px]"
          style={{ background: 'rgba(0,230,118,0.10)', border: '1px solid rgba(0,230,118,0.3)', color: '#00e676' }}
        >
          BELT STATUS
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {dogs.map((dog) => {
          const color = dog.batt < 40 ? '#ff3d3d' : dog.batt < 60 ? '#ffd740' : '#00e676';
          return (
            <div key={dog.id} className="flex items-center gap-2">
              <span className="text-sm w-5 text-center">{dog.emoji}</span>
              <span className="text-[11px] text-text w-14 truncate">{dog.name}</span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#1e2d3d' }}>
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${dog.batt}%`, background: color }}
                />
              </div>
              <span className="font-mono-sg text-[10px] w-8 text-right" style={{ color }}>
                {dog.batt}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
