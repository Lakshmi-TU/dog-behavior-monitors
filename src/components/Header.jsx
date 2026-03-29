// ─────────────────────────────────────────────────────────────
// src/components/Header.jsx
// Sticky top bar with search, filter chips, live pill, clock.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';

const FILTER_OPTIONS = [
  { label: 'All',        value: 'all',    cls: '' },
  { label: '🔴 High Risk', value: 'high',  cls: 'danger' },
  { label: '🟡 Medium',   value: 'medium', cls: 'warn' },
  { label: '🟢 Safe',     value: 'low',    cls: 'safe' },
];

export default function Header({ search, onSearch, filter, onFilter, onExport }) {
  const [clock, setClock] = useState('');

  useEffect(() => {
    const tick = () => {
      setClock(new Date().toLocaleTimeString('en-IN', { hour12: false }) + ' IST');
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header
      className="flex items-center gap-4 px-6 py-3 sticky top-0 z-40 flex-shrink-0"
      style={{ background: '#0c1017', borderBottom: '1px solid #1e2d3d' }}
    >
      {/* Title */}
      <h1 className="font-heading text-white font-bold text-[17px] tracking-[0.5px] whitespace-nowrap">
        Dog Behavior Monitor
      </h1>

      {/* Search */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-md flex-1 max-w-xs"
        style={{ background: '#111820', border: '1px solid #1e2d3d' }}
      >
        <span className="text-muted">🔍</span>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search by Belt ID or name…"
          className="bg-transparent border-none outline-none text-text text-[13px] w-full placeholder-muted"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        />
      </div>

      {/* Filter chips */}
      <div className="flex gap-1.5">
        {FILTER_OPTIONS.map(({ label, value, cls }) => (
          <button
            key={value}
            onClick={() => onFilter(value)}
            className={`
              px-3 py-1 rounded-[20px] text-[11px] font-mono-sg tracking-[0.5px]
              border transition-all duration-150 cursor-pointer
              ${filter === value
                ? cls === 'danger'
                  ? 'border-red text-red bg-red/15'
                  : cls === 'warn'
                    ? 'border-yellow text-yellow bg-yellow/10'
                    : cls === 'safe'
                      ? 'border-green text-green bg-green/10'
                      : 'border-cyan text-cyan bg-cyan/15'
                : 'border-border1 text-muted hover:border-cyan hover:text-cyan bg-s2'}
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 ml-auto">
        {/* LIVE pill */}
        <div
          className="flex items-center gap-1.5 rounded-[20px] px-3 py-1 font-mono-sg text-[10px] text-red tracking-[1px]"
          style={{ background: 'rgba(255,61,61,0.10)', border: '1px solid rgba(255,61,61,0.35)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red animate-blink" />
          LIVE
        </div>

        {/* Clock */}
        <span className="font-mono-sg text-[12px] text-muted whitespace-nowrap">{clock}</span>

        {/* Export */}
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-[12px] font-medium
                     transition-all duration-150 hover:border-cyan hover:text-cyan"
          style={{ background: '#111820', border: '1px solid #1e2d3d', color: '#c8d8e8' }}
        >
          ⬇ Export CSV
        </button>
      </div>
    </header>
  );
}
