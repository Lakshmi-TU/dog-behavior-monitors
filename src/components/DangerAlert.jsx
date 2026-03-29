// ─────────────────────────────────────────────────────────────
// src/components/DangerAlert.jsx
// Live alerts panel — scrollable list of alert items, each
// colour-coded by severity level.
// ─────────────────────────────────────────────────────────────

const LEVEL_STYLES = {
  high:   { border: '#ff3d3d', bg: 'rgba(255,61,61,0.05)' },
  medium: { border: '#ffd740', bg: 'rgba(255,215,64,0.04)' },
  info:   { border: '#00b8d9', bg: 'rgba(0,184,217,0.04)'  },
};

function AlertItem({ alert }) {
  const ls = LEVEL_STYLES[alert.level] ?? LEVEL_STYLES.info;
  return (
    <div
      className="flex gap-2.5 items-start px-3 py-2.5 rounded-md animate-slideIn"
      style={{ borderLeft: `3px solid ${ls.border}`, background: ls.bg }}
    >
      <span className="text-sm mt-0.5 flex-shrink-0">{alert.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-semibold text-white mb-0.5 truncate">{alert.title}</p>
        <p className="text-[11px] text-muted leading-snug">{alert.msg}</p>
        <p className="font-mono-sg text-[9px] mt-1" style={{ color: '#2a3a4a', letterSpacing: '0.5px' }}>
          {alert.timeLabel ?? (alert.time?.toDate?.().toLocaleTimeString('en-IN', { hour12: false }) ?? '')}
        </p>
      </div>
    </div>
  );
}

export default function DangerAlert({ alerts }) {
  const newCount = alerts.filter((a) => a.level === 'high').length;

  return (
    <div className="rounded-xl p-4 animate-fadeUp flex flex-col" style={{ background: '#111820', border: '1px solid #1e2d3d' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5 flex-shrink-0">
        <h3 className="font-heading text-white font-bold text-[13px] uppercase tracking-[1px]">🚨 Live Alerts</h3>
        <span
          className="font-mono-sg text-[9px] px-2 py-0.5 rounded-sm tracking-[1px]"
          style={{ background: 'rgba(255,61,61,0.12)', border: '1px solid rgba(255,61,61,0.3)', color: '#ff3d3d' }}
        >
          {newCount} NEW
        </span>
      </div>

      {/* Scrollable list */}
      <div className="flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: 240 }}>
        {alerts.map((a) => (
          <AlertItem key={a.id} alert={a} />
        ))}
        {alerts.length === 0 && (
          <p className="text-center text-muted font-mono-sg text-[11px] py-6">No alerts right now.</p>
        )}
      </div>
    </div>
  );
}
