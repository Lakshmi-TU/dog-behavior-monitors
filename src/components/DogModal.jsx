// ─────────────────────────────────────────────────────────────
// src/components/DogModal.jsx
// Full-screen overlay modal: dog profile, R-value mini chart,
// incident history table, action buttons.
// ─────────────────────────────────────────────────────────────

import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';

import { buildRHistory, buildIncidentHistory } from '../utils/simulator';
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';


const ACTIVITIES = ['Aggressive','Threatening','Running','Walking','Sniffing','Resting'];

const RISK_COLOR = { high: '#ff3d3d', medium: '#ffd740', low: '#00e676' };
const RISK_FILL  = { high: 'rgba(255,61,61,0.08)', medium: 'rgba(255,215,64,0.06)', low: 'rgba(0,230,118,0.05)' };

function InfoBlock({ label, value, sub, valueColor = '#fff' }) {
  return (
    <div className="rounded-lg p-3.5" style={{ background: '#111820', border: '1px solid #1e2d3d' }}>
      <p className="font-mono-sg text-[9px] text-muted uppercase tracking-[2px] mb-1.5">{label}</p>
      <p className="font-heading text-[22px] font-bold" style={{ color: valueColor }}>{value}</p>
      {sub && <p className="text-[11px] text-muted mt-1">{sub}</p>}
    </div>
  );
}

export default function DogModal({ onTriggerShock }) {
  const {
  selectedDog,
  closeDogModal,
  openShock,
  addToast,
  focusOnDog,
  triggerShockEffect
} = useApp();

const [showHistory, setShowHistory] = useState(false);
const [historyData, setHistoryData] = useState([]);

  const rHistory = useMemo(() => {
    if (!selectedDog) return [];
    return buildRHistory(selectedDog.r).map((v, i) => ({ label: `${12 - i}h`, val: Math.round(v) })).reverse();
  }, [selectedDog]);

  const incidents = useMemo(() => {
    if (!selectedDog) return [];
    return buildIncidentHistory();
  }, [selectedDog]);

  if (!selectedDog) return null;

  const dog      = selectedDog;
  const rColor   = RISK_COLOR[dog.risk];
  const rLevel   = dog.risk === 'high' ? 'HIGH RISK' : dog.risk === 'medium' ? 'MEDIUM RISK' : 'LOW RISK';
  const battColor = dog.batt < 40 ? '#ff3d3d' : dog.batt < 60 ? '#ffd740' : '#00e676';
  const battSub   = dog.batt < 40 ? '⚠ Replace soon' : 'Healthy';
  const now       = new Date().toLocaleTimeString('en-IN', { hour12: false });

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.8)' }}
      onClick={(e) => { if (e.target === e.currentTarget) closeDogModal(); }}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl animate-modalIn"
        style={{ background: '#0c1017', border: '1px solid #1e2d3d' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center gap-3 px-6 py-4 sticky top-0 z-10" style={{ background: '#0c1017', borderBottom: '1px solid #1e2d3d' }}>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-[22px] flex-shrink-0"
            style={{ border: `2px solid ${rColor}`, background: `${rColor}18` }}
          >
            {dog.emoji}
          </div>
          <div className="flex-1">
            <p className="font-heading text-white text-[16px] font-bold">{dog.name}</p>
            <p className="font-mono-sg text-[11px] text-muted tracking-[1px]">{dog.id} · {dog.breed} · {dog.zone}</p>
          </div>
          <button
            onClick={closeDogModal}
            className="w-8 h-8 rounded-md flex items-center justify-center text-muted transition-all hover:text-white"
            style={{ background: '#111820', border: '1px solid #1e2d3d' }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <InfoBlock label="Current R-Value" value={dog.r}          sub={rLevel}    valueColor={rColor} />
            <InfoBlock label="Current Activity" value={dog.activity}   sub={dog.zone}  valueColor="#00b8d9" />
            <InfoBlock label="Belt Battery"     value={`${dog.batt}%`} sub={battSub}   valueColor={battColor} />
            <InfoBlock label="Last Detection"   value={now}            sub="Voice + Movement" valueColor="#00b8d9" />
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-3 gap-2.5 mb-4">
  {[
    {
      icon: '📍',
      label: 'View Location',
      cls: 'loc',
      action: () => {
        focusOnDog(dog); // 🔥 focus map
        addToast('📍 Zooming to dog location…', 'success');
        closeDogModal();
      }
    },
    {
      icon: '⚡',
      label: 'Trigger Shock',
      cls: 'shock',
      action: () => {
        triggerShockEffect(dog); // 🔥 flash marker
        closeDogModal();
        openShock(dog);
      }
    },
    {
      icon: '📊',
      label: 'Full History',
      cls: 'hist',
      action: () => {
  addToast('📊 Loading 1-month history…', 'success');

  const history = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
    r: Math.floor(Math.random() * 100),
    activity: ['Resting','Walking','Aggressive'][Math.floor(Math.random()*3)]
  }));

  setHistoryData(history);
  setShowHistory(true);
}
    }
  ].map(({ icon, label, cls, action }) => (
    <button
      key={label}
      onClick={action}
      className="py-2.5 rounded-lg flex flex-col items-center gap-1 transition-all hover:-translate-y-0.5"
      style={{
        border: cls === 'shock'
          ? '1px solid rgba(255,61,61,0.5)'
          : cls === 'loc'
          ? '1px solid rgba(0,184,217,0.3)'
          : '1px solid rgba(0,230,118,0.3)',
        background: cls === 'shock'
          ? 'rgba(255,61,61,0.08)'
          : '#111820',
      }}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-[11px] font-semibold text-text">{label}</span>
    </button>
  ))}
</div>

          {/* Behavior chips */}
          <div className="flex gap-1.5 flex-wrap mb-4">
            {ACTIVITIES.map((a) => (
              <span
                key={a}
                className="px-3 py-1 rounded-[20px] font-mono-sg text-[11px] tracking-[0.5px]"
                style={a === dog.activity
                  ? { background: 'rgba(0,184,217,0.12)', border: '1px solid rgba(0,184,217,0.4)', color: '#00b8d9' }
                  : { background: 'transparent', border: '1px solid #1e2d3d', color: '#4a6272' }}
              >
                {a}
              </span>
            ))}
          </div>

          {/* R-value sparkline */}
          <div className="mb-4">
            <p className="font-heading text-white font-bold text-[12px] uppercase tracking-[1px] mb-2.5">R-Value — Last 12 Hours</p>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={rHistory} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,45,61,0.5)" />
                <XAxis dataKey="label" tick={{ fill: '#4a6272', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#4a6272', fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#0c1017', border: '1px solid #1e2d3d', borderRadius: 6, fontSize: 11 }}
                  labelStyle={{ color: '#4a6272' }}
                />
                <Line
                  type="monotone" dataKey="val"
                  stroke={rColor} strokeWidth={2}
                  fill={RISK_FILL[dog.risk]}
                  dot={{ r: 2, fill: rColor }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Incident history table */}
          <div>
            <p className="font-heading text-white font-bold text-[12px] uppercase tracking-[1px] mb-2.5">Incident History (Today)</p>
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr>
                  {['Time','Behavior','R-Value','Duration','Action'].map((h) => (
                    <th key={h} className="font-mono-sg text-[9px] text-muted uppercase tracking-[2px] px-2.5 py-2 text-left" style={{ borderBottom: '1px solid #1e2d3d' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {incidents.map((row, i) => (
                  <tr key={i} className="hover:bg-cyan/5 transition-colors">
                    <td className="px-2.5 py-2 font-mono-sg text-muted">{row.time}</td>
                    <td className="px-2.5 py-2 text-text">{row.behavior}</td>
                    <td className="px-2.5 py-2 font-mono-sg" style={{ color: row.rval > 70 ? '#ff3d3d' : row.rval > 40 ? '#ffd740' : '#00e676' }}>{row.rval}</td>
                    <td className="px-2.5 py-2 text-text">{row.duration}</td>
                    <td className="px-2.5 py-2 font-mono-sg text-[10px] text-muted">{row.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {showHistory && (
  <div className="mt-5">
    <p className="font-heading text-white font-bold text-[12px] uppercase tracking-[1px] mb-2">
      📊 1-Month Behavior History
    </p>

    <div className="max-h-[200px] overflow-y-auto">
      <table className="w-full text-[11px]">
        <thead>
          <tr>
            <th>Date</th>
            <th>R-Value</th>
            <th>Activity</th>
          </tr>
        </thead>
        <tbody>
          {historyData.map((h, i) => (
            <tr key={i}>
              <td>{h.date}</td>
              <td style={{
                color: h.r > 70 ? '#ff3d3d' :
                       h.r > 40 ? '#ffd740' : '#00e676'
              }}>
                {h.r}
              </td>
              <td>{h.activity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <button
      onClick={() => setShowHistory(false)}
      className="mt-2 text-sm text-cyan"
    >
      Close History
    </button>
  </div>
)}
        </div>
      </div>
    </div>
    
  );
  
}
