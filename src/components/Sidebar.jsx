// ─────────────────────────────────────────────────────────────
// src/components/Sidebar.jsx
// Left navigation sidebar — logo, nav items, system status.
// ─────────────────────────────────────────────────────────────

import { useState } from 'react';

const NAV = [
  { section: 'Monitor',  items: [
    { icon: '📊', label: 'Dashboard',       badge: null },
    { icon: '🐕', label: 'All Dogs',        badge: null },
    { icon: '📍', label: 'Live Map',        badge: null },
  ]},
  { section: 'Analysis', items: [
    { icon: '📈', label: 'Behavior Trends', badge: null },
    { icon: '🧠', label: 'ML Insights',     badge: null },
  ]},
  { section: 'Control',  items: [
    { icon: '🚨', label: 'Alerts',          badge: 3 },
    { icon: '⚙️', label: 'Settings',        badge: null },
    { icon: '👤', label: 'Users',           badge: null },
  ]},
];

export default function Sidebar() {
  const [active, setActive] = useState('Dashboard');

  return (
    <aside
      className="w-[220px] min-w-[220px] flex flex-col z-50"
      style={{ background: '#0c1017', borderRight: '1px solid #1e2d3d' }}
    >
      {/* Logo */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid #1e2d3d' }}>
        <div className="flex items-center gap-2.5 mb-1">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#00b8d9,#006688)' }}
          >
            🐾
          </div>
          <span className="font-heading text-white font-extrabold text-lg tracking-wide">StreetGuard</span>
        </div>
        <p className="font-mono-sg text-[9px] text-muted uppercase tracking-[2px] pl-[46px]">
          Canine Monitoring System
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-4">
        {NAV.map(({ section, items }) => (
          <div key={section}>
            <p className="font-mono-sg text-[9px] text-muted uppercase tracking-[2px] px-2.5 py-1.5 mt-2 first:mt-0">
              {section}
            </p>
            {items.map(({ icon, label, badge }) => (
              <button
                key={label}
                onClick={() => setActive(label)}
                className={`
                  w-full flex items-center gap-2.5 px-3 py-2 rounded-md mb-0.5
                  text-[13px] font-medium transition-all duration-150 text-left
                  ${active === label
                    ? 'text-cyan border border-cyan/20'
                    : 'text-muted hover:text-text border border-transparent hover:bg-s2'}
                `}
                style={active === label ? { background: 'rgba(0,184,217,0.12)' } : {}}
              >
                <span className="w-5 text-center text-[15px]">{icon}</span>
                <span className="flex-1">{label}</span>
                {badge && (
                  <span className="bg-red text-white rounded-[10px] px-1.5 py-px text-[10px] font-mono-sg">
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3.5" style={{ borderTop: '1px solid #1e2d3d' }}>
        <div className="flex items-center gap-2 text-[11px] text-muted font-mono-sg">
          {/* Pulse dot */}
          <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
          All systems online
        </div>
        <p className="font-mono-sg text-[9px] mt-1.5" style={{ color: '#2a3a4a' }}>
          v3.1.0 · MQTT CONNECTED
        </p>
      </div>
    </aside>
  );
}
