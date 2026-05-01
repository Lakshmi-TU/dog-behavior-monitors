// src/components/ControlPanel.jsx
import { useState } from 'react';
import { useApp } from '../context/AppContext';

const RISK_COLOR = {
  high:   '#ff3d3d',
  medium: '#ffd740',
  low:    '#00e676',
};

// ── Track Modal ───────────────────────────────────────────
function TrackModal({ dogs, onSelect, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <div
        className="rounded-xl p-5 w-80 max-h-[70vh] flex flex-col"
        style={{ background: '#111820', border: '1px solid #1e2d3d' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-white font-bold text-[13px] uppercase tracking-[1px]">
            📡 Select Dog to Track
          </h3>
          <button onClick={onClose} className="text-muted hover:text-white text-lg leading-none">×</button>
        </div>
        <div className="flex flex-col gap-2 overflow-y-auto">
          {dogs.map((dog) => (
            <button
              key={dog.id}
              onClick={() => onSelect(dog)}
              className="flex items-center gap-3 p-3 rounded-lg text-left transition-all hover:-translate-y-0.5"
              style={{ background: '#182030', border: `1px solid ${RISK_COLOR[dog.risk]}44` }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-[18px] flex-shrink-0"
                style={{ border: `2px solid ${RISK_COLOR[dog.risk]}`, background: `${RISK_COLOR[dog.risk]}18` }}
              >
                {dog.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-white">{dog.name}</p>
                <p className="font-mono-sg text-[9px] text-muted tracking-[1px]">{dog.id} · {dog.zone}</p>
              </div>
              <span
                className="font-mono-sg text-[10px] font-bold px-2 py-0.5 rounded"
                style={{ color: RISK_COLOR[dog.risk], background: `${RISK_COLOR[dog.risk]}18` }}
              >
                R{dog.r}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Dispatch Modal ────────────────────────────────────────
function DispatchModal({ dogs, onClose, onDispatch }) {
  const [selected, setSelected] = useState(
    // pre-select all high risk dogs by default
    dogs.filter((d) => d.risk === 'high').map((d) => d.id)
  );

  function toggleDog(id) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function selectAll()   { setSelected(dogs.map((d) => d.id)); }
  function selectHigh()  { setSelected(dogs.filter((d) => d.risk === 'high').map((d) => d.id)); }
  function clearAll()    { setSelected([]); }

  const selectedDogs = dogs.filter((d) => selected.includes(d.id));

  function buildMessage() {
    const time = new Date().toLocaleTimeString('en-IN', { hour12: false });
    const date = new Date().toLocaleDateString('en-IN');
    const lines = selectedDogs.map((d) => {
      const mapsUrl = d.lat && d.lng
        ? `https://maps.google.com/?q=${d.lat},${d.lng}`
        : 'Location unavailable';
      return (
        `🐕 ${d.name} (${d.id})\n` +
        `   Risk: ${d.risk.toUpperCase()} | R-Value: ${d.r}\n` +
        `   Activity: ${d.activity} | Zone: ${d.zone}\n` +
        `   📍 ${mapsUrl}`
      );
    });

    return (
      `🚨 STREETGUARD DISPATCH ALERT\n` +
      `📅 ${date} · ${time}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      lines.join('\n\n') +
      `\n━━━━━━━━━━━━━━━━━━━━\n` +
      `⚠️ ${selectedDogs.length} dog(s) flagged. Immediate response required.`
    );
  }

  function handleSMS() {
    const msg = encodeURIComponent(buildMessage());
    window.open(`sms:?body=${msg}`, '_blank');
    onDispatch(selectedDogs);
    onClose();
  }

  function handleWhatsApp() {
    const msg = encodeURIComponent(buildMessage());
    window.open(`https://wa.me/?text=${msg}`, '_blank');
    onDispatch(selectedDogs);
    onClose();
  }

  function handleCopy() {
    navigator.clipboard.writeText(buildMessage());
    onDispatch(selectedDogs);
    onClose();
  }

  const sortedDogs = [...dogs].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.risk] - order[b.risk];
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.75)' }}
      onClick={onClose}
    >
      <div
        className="rounded-xl p-5 w-96 max-h-[85vh] flex flex-col gap-3"
        style={{ background: '#111820', border: '1px solid #1e2d3d' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-white font-bold text-[13px] uppercase tracking-[1px]">
            🚐 Dispatch — Select Dogs
          </h3>
          <button onClick={onClose} className="text-muted hover:text-white text-lg leading-none">×</button>
        </div>

        {/* Quick filters */}
        <div className="flex gap-2">
          {[
            { label: 'All High', fn: selectHigh, color: '#ff3d3d' },
            { label: 'Select All', fn: selectAll, color: '#00b8d9' },
            { label: 'Clear', fn: clearAll, color: '#4a6272' },
          ].map(({ label, fn, color }) => (
            <button
              key={label}
              onClick={fn}
              className="font-mono-sg text-[9px] px-2 py-1 rounded tracking-[1px] transition-all hover:opacity-80"
              style={{ border: `1px solid ${color}55`, color, background: `${color}11` }}
            >
              {label}
            </button>
          ))}
          <span className="ml-auto font-mono-sg text-[9px] text-muted self-center">
            {selected.length} selected
          </span>
        </div>

        {/* Dog list */}
        <div className="flex flex-col gap-1.5 overflow-y-auto flex-1" style={{ maxHeight: '340px' }}>
          {sortedDogs.map((dog) => {
            const isSelected = selected.includes(dog.id);
            const rc = RISK_COLOR[dog.risk];
            return (
              <button
                key={dog.id}
                onClick={() => toggleDog(dog.id)}
                className="flex items-center gap-3 p-2.5 rounded-lg text-left transition-all"
                style={{
                  background: isSelected ? `${rc}11` : '#182030',
                  border: `1px solid ${isSelected ? rc : '#1e2d3d'}`,
                }}
              >
                {/* Checkbox */}
                <div
                  className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 text-[10px]"
                  style={{
                    border: `2px solid ${isSelected ? rc : '#4a6272'}`,
                    background: isSelected ? rc : 'transparent',
                  }}
                >
                  {isSelected && '✓'}
                </div>

                {/* Avatar */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[15px] flex-shrink-0"
                  style={{ border: `2px solid ${rc}`, background: `${rc}18` }}
                >
                  {dog.emoji}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-white">{dog.name}</p>
                  <p className="font-mono-sg text-[9px] text-muted tracking-[0.5px]">
                    {dog.zone} · {dog.activity}
                  </p>
                </div>

                {/* Risk + R */}
                <div className="flex flex-col items-end gap-0.5">
                  <span
                    className="font-mono-sg text-[9px] font-bold px-1.5 py-0.5 rounded"
                    style={{ color: rc, background: `${rc}18` }}
                  >
                    {dog.risk.toUpperCase()}
                  </span>
                  <span className="font-mono-sg text-[9px] text-muted">R{dog.r}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Message preview */}
        {selectedDogs.length > 0 && (
          <div
            className="rounded-lg p-3 font-mono-sg text-[9px] text-muted leading-relaxed"
            style={{ background: '#0c1017', border: '1px solid #1e2d3d', maxHeight: 90, overflowY: 'auto' }}
          >
            {selectedDogs.map((d) => (
              <div key={d.id} className="mb-1">
                🐕 <span style={{ color: RISK_COLOR[d.risk] }}>{d.name}</span>
                {' '}· {d.zone} · R{d.r}
                {d.lat && d.lng && (
                  <span className="text-cyan-400"> · 📍{d.lat.toFixed(4)},{d.lng.toFixed(4)}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Share buttons */}
        <div className="flex gap-2 mt-1">
          <button
            onClick={handleWhatsApp}
            disabled={selected.length === 0}
            className="flex-1 py-2.5 rounded-lg font-mono-sg text-[11px] font-bold tracking-[1px] transition-all hover:opacity-90 disabled:opacity-30"
            style={{ background: '#25D366', color: '#fff' }}
          >
            📱 WhatsApp
          </button>
          <button
            onClick={handleSMS}
            disabled={selected.length === 0}
            className="flex-1 py-2.5 rounded-lg font-mono-sg text-[11px] font-bold tracking-[1px] transition-all hover:opacity-90 disabled:opacity-30"
            style={{ background: 'rgba(0,184,217,0.15)', border: '1px solid rgba(0,184,217,0.4)', color: '#00b8d9' }}
          >
            💬 SMS
          </button>
          <button
            onClick={handleCopy}
            disabled={selected.length === 0}
            className="px-3 py-2.5 rounded-lg font-mono-sg text-[11px] font-bold tracking-[1px] transition-all hover:opacity-90 disabled:opacity-30"
            style={{ background: '#182030', border: '1px solid #1e2d3d', color: '#4a6272' }}
          >
            📋
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────
export default function ControlPanel({ lastShock, onDispatch, dogs = [] }) {
  const { openShock, addToast, trackedDog, startTracking, stopTracking } = useApp();
  const [showTrackModal,    setShowTrackModal]    = useState(false);
  const [showDispatchModal, setShowDispatchModal] = useState(false);

  function handleTrackSelect(dog) {
    startTracking(dog);
    setShowTrackModal(false);
    addToast(`📡 Tracking ${dog.name} — path enabled`, 'success');
  }

  function handleTrackClick() {
    if (trackedDog) {
      stopTracking();
      addToast('📡 Tracking stopped', 'success');
    } else {
      setShowTrackModal(true);
    }
  }

  function handleDispatchConfirm(selectedDogs) {
    onDispatch(selectedDogs);
    addToast(
      `🚐 Alert shared for ${selectedDogs.length} dog(s) — ${selectedDogs.map((d) => d.name).join(', ')}`,
      'success'
    );
  }

  const BUTTONS = [
    {
      icon: '⚡', label: 'Trigger Shock', sub: 'SELECTED / ALL HIGH', action: 'shock',
      style: { border: 'rgba(255,61,61,0.5)', bg: 'rgba(255,61,61,0.08)' },
    },
    {
      icon: '📍', label: 'Locate All', sub: 'REFRESH POSITIONS', action: 'locate',
      style: { border: 'rgba(0,184,217,0.3)', bg: 'transparent' },
    },
    {
      icon: '📡',
      label: trackedDog ? `Stop: ${trackedDog.name}` : 'Track Path',
      sub:   trackedDog ? 'TRACKING ACTIVE' : 'ENABLE HISTORY',
      action: 'track',
      style: {
        border: trackedDog ? 'rgba(0,230,118,0.7)' : 'rgba(0,230,118,0.3)',
        bg:     trackedDog ? 'rgba(0,230,118,0.12)' : 'transparent',
      },
    },
    {
      icon: '🚐', label: 'Dispatch Team', sub: 'ALERT FIELD UNIT', action: 'dispatch',
      style: { border: 'rgba(255,215,64,0.3)', bg: 'transparent' },
    },
  ];

  function handleAction(action) {
    if      (action === 'shock')    openShock(null);
    else if (action === 'locate')   addToast('📍 Locating all dogs…', 'success');
    else if (action === 'track')    handleTrackClick();
    else if (action === 'dispatch') setShowDispatchModal(true);
  }

  return (
    <>
      {showTrackModal && (
        <TrackModal
          dogs={dogs}
          onSelect={handleTrackSelect}
          onClose={() => setShowTrackModal(false)}
        />
      )}

      {showDispatchModal && (
        <DispatchModal
          dogs={dogs}
          onClose={() => setShowDispatchModal(false)}
          onDispatch={handleDispatchConfirm}
        />
      )}

      <div className="rounded-xl p-4 animate-fadeUp" style={{ background: '#111820', border: '1px solid #1e2d3d' }}>
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

        <div className="p-2.5 rounded-md" style={{ background: '#182030', border: '1px solid #1e2d3d' }}>
          <p className="font-mono-sg text-[9px] text-muted tracking-[1px] mb-1">LAST SHOCK TRIGGERED</p>
          <p className="font-mono-sg text-[11px] text-red">{lastShock}</p>
        </div>
      </div>
    </>
  );
}