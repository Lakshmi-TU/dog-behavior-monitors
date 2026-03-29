// ─────────────────────────────────────────────────────────────
// src/components/StatCard.jsx
// Single KPI card with label, big value, sub-text, and a
// thin accent bar at the bottom.
// ─────────────────────────────────────────────────────────────

const COLOR_MAP = {
  red:    '#ff3d3d',
  yellow: '#ffd740',
  green:  '#00e676',
  cyan:   '#00b8d9',
  orange: '#ff6d00',
  white:  '#ffffff',
};

export default function StatCard({ label, value, sub, color = 'cyan', barWidth = '100%', delay = 0 }) {
  const hex = COLOR_MAP[color] ?? color;

  return (
    <div
      className="rounded-lg p-4 relative overflow-hidden animate-fadeUp"
      style={{
        background:       '#111820',
        border:           '1px solid #1e2d3d',
        animationDelay:   `${delay}s`,
      }}
    >
      {/* Subtle gloss overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.02) 0%,transparent 60%)' }}
      />

      {/* Label */}
      <p className="font-mono-sg text-[9px] text-muted uppercase tracking-[2px] mb-2">{label}</p>

      {/* Value */}
      <p className="font-heading text-[32px] font-bold leading-none" style={{ color: hex }}>
        {value}
      </p>

      {/* Sub text */}
      <p className="text-[11px] text-muted mt-1.5">{sub}</p>

      {/* Accent bar */}
      <div className="h-[2px] mt-2.5 rounded-sm" style={{ background: '#1e2d3d' }}>
        <div
          className="h-full rounded-sm transition-all duration-1000 ease-out"
          style={{ width: barWidth, background: hex }}
        />
      </div>
    </div>
  );
}
