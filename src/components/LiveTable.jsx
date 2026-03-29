// ─────────────────────────────────────────────────────────────
// src/components/LiveTable.jsx
// Grid of dog cards — each card shows avatar, name, belt ID,
// risk badge, and a colored status bar.  Click opens modal.
// ─────────────────────────────────────────────────────────────

import { useApp } from '../context/AppContext';

const RISK_STYLES = {
  high:   { border: '#ff3d3d', bg: 'rgba(255,61,61,0.10)',  badge: 'rgba(255,61,61,0.15)',  text: '#ff3d3d' },
  medium: { border: '#ffd740', bg: 'rgba(255,215,64,0.08)', badge: 'rgba(255,215,64,0.12)', text: '#ffd740' },
  low:    { border: '#00e676', bg: 'rgba(0,230,118,0.08)',  badge: 'rgba(0,230,118,0.10)',  text: '#00e676' },
};

function DogCard({ dog, selected }) {
  const { openDogModal } = useApp();
  const rs = RISK_STYLES[dog.risk];

  return (
    <button
      onClick={() => openDogModal(dog)}
      className={`
        rounded-lg p-3 relative overflow-hidden cursor-pointer
        transition-all duration-200 text-left
        hover:-translate-y-0.5
      `}
      style={{
        background:  '#182030',
        border:      `1px solid ${selected ? '#00b8d9' : '#1e2d3d'}`,
        boxShadow:   selected ? '0 0 0 2px rgba(0,184,217,0.2)' : undefined,
      }}
    >
      {/* Avatar */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-[22px] mx-auto mb-2"
        style={{ border: `2px solid ${rs.border}`, background: rs.bg }}
      >
        {dog.emoji}
      </div>

      {/* Name & ID */}
      <p className="text-[12px] font-semibold text-white text-center mb-0.5">{dog.name}</p>
      <p className="font-mono-sg text-[9px] text-muted text-center tracking-[1px] mb-2">{dog.id}</p>

      {/* Risk badge */}
      <div
        className="flex items-center justify-center gap-1 rounded px-2 py-1 font-mono-sg text-[11px] font-medium"
        style={{ background: rs.badge, color: rs.text }}
      >
        <span>R</span>
        <span>{dog.r}</span>
      </div>

      {/* Status bar */}
      <div className="h-[3px] rounded-sm mt-2" style={{ background: rs.border }} />
    </button>
  );
}

export default function LiveTable({ dogs, selectedDog }) {
  return (
    <div className="grid gap-2.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))' }}>
      {dogs.map((dog) => (
        <DogCard key={dog.id} dog={dog} selected={selectedDog?.id === dog.id} />
      ))}
      {dogs.length === 0 && (
        <p className="col-span-full text-center text-muted py-8 font-mono-sg text-[11px]">
          No dogs match the current filter.
        </p>
      )}
    </div>
  );
}
