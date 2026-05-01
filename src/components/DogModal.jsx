// src/components/DogModal.jsx

import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { buildRHistory, buildIncidentHistory } from '../utils/simulator';
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts';

const ACTIVITIES = ['Aggressive', 'Threatening', 'Running', 'Walking', 'Sniffing', 'Resting'];

const RISK_COLOR = { high: '#ff3d3d', medium: '#ffd740', low: '#00e676' };
const RISK_FILL  = {
  high:   'rgba(255,61,61,0.08)',
  medium: 'rgba(255,215,64,0.06)',
  low:    'rgba(0,230,118,0.05)',
};

function InfoBlock({ label, value, sub, valueColor = '#fff' }) {
  return (
    <div className="rounded-lg p-3.5" style={{ background: '#111820', border: '1px solid #1e2d3d' }}>
      <p className="font-mono-sg text-[9px] text-muted uppercase tracking-[2px] mb-1.5">{label}</p>
      <p className="font-heading text-[22px] font-bold" style={{ color: valueColor }}>{value}</p>
      {sub && <p className="text-[11px] text-muted mt-1">{sub}</p>}
    </div>
  );
}

export default function DogModal() {
  const {
    selectedDog,
    closeDogModal,
    openShock,
    addToast,
    focusOnDog,
    triggerShockEffect,
  } = useApp();

  const [showHistory, setShowHistory] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  // ✅ FIX: pass dog.risk to buildRHistory so history starts realistically low
  //         instead of always clustered around the current high R-value
  const rHistory = useMemo(() => {
    if (!selectedDog) return [];
    return buildRHistory(selectedDog.r, selectedDog.risk)
      .map((v, i) => ({ label: `${12 - i}h`, val: Math.round(v) }))
      .reverse();
  }, [selectedDog]);

  const incidents = useMemo(() => {
    if (!selectedDog) return [];
    return buildIncidentHistory(selectedDog.risk, selectedDog.r);
  }, [selectedDog]);

  if (!selectedDog) return null;      

  const dog       = selectedDog;
  const rColor    = RISK_COLOR[dog.risk];
  const rLevel    = dog.risk === 'high' ? 'HIGH RISK' : dog.risk === 'medium' ? 'MEDIUM RISK' : 'LOW RISK';
  const battColor = dog.batt < 40 ? '#ff3d3d' : dog.batt < 60 ? '#ffd740' : '#00e676';
  const battSub   = dog.batt < 40 ? '⚠ Replace soon' : 'Healthy';
  const now       = new Date().toLocaleTimeString('en-IN', { hour12: false });

  return (
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
        {/* Header */}
        <div
          className="flex items-center gap-3 px-6 py-4 sticky top-0 z-10"
          style={{ background: '#0c1017', borderBottom: '1px solid #1e2d3d' }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-[22px] flex-shrink-0"
            style={{ border: `2px solid ${rColor}`, background: `${rColor}18` }}
          >
            {dog.emoji}
          </div>
          <div className="flex-1">
            <p className="font-heading text-white text-[16px] font-bold">{dog.name}</p>
            <p className="font-mono-sg text-[11px] text-muted tracking-[1px]">
              {dog.id} · {dog.breed} · {dog.zone}
            </p>
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
            <InfoBlock label="Current R-Value"  value={dog.r}           sub={rLevel}           valueColor={rColor} />
            <InfoBlock label="Current Activity" value={dog.activity}    sub={dog.zone}         valueColor="#00b8d9" />
            <InfoBlock label="Belt Battery"     value={`${dog.batt}%`} sub={battSub}          valueColor={battColor} />
            <InfoBlock label="Last Detection"   value={now}             sub="Voice + Movement" valueColor="#00b8d9" />
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-3 gap-2.5 mb-4">
            {[
              {
                icon: '📍', label: 'View Location', cls: 'loc',
                action: () => { focusOnDog(dog); addToast('📍 Zooming to dog location…', 'success'); closeDogModal(); },
              },
              {
                icon: '⚡', label: 'Trigger Shock', cls: 'shock',
                action: () => { triggerShockEffect(dog); closeDogModal(); openShock(dog); },
              },
              {
                icon: '📊', label: 'Full History', cls: 'hist',
                               action: () => {
                  addToast('📊 Loading 1-month history…', 'success');
 
                  // Activity pools that match each R-value range
                  const activityFor = (r) => {
                    if (r >= 70) return ['Aggressive', 'Threatening', 'Running'][Math.floor(Math.random() * 3)];
                    if (r >= 40) return ['Walking', 'Running', 'Sniffing'][Math.floor(Math.random() * 3)];
                    return ['Resting', 'Lying', 'Walking'][Math.floor(Math.random() * 3)];
                  };
 
                  // Build a realistic 30-day trend:
                  // Start from a baseline tied to this dog's risk,
                  // drift naturally day-by-day with occasional spikes.
                  const baselineR = dog.risk === 'high' ? 72
                                  : dog.risk === 'medium' ? 52 : 20;
 
                  let current = baselineR;
                  const history = Array.from({ length: 30 }, (_, i) => {
                    // Day 0 = today, day 29 = 30 days ago
                    const date = new Date(Date.now() - i * 86400000)
                      .toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
 
                    // Drift: ±5 normal, occasional ±15 spike, gentle reversion to baseline
                    const drift    = (Math.random() - 0.5) * 10;
                    const spike    = Math.random() < 0.12 ? (Math.random() - 0.4) * 28 : 0;
                    const revert   = (baselineR - current) * 0.12;
                    current = Math.max(5, Math.min(95, Math.round(current + drift + spike + revert)));
 
                    return { date, r: current, activity: activityFor(current) };
                  });
 
                  // Make day 0 (today) match current dog R exactly
                  history[0].r        = dog.r;
                  history[0].activity = dog.activity;
 
                  setHistoryData(history);
                  setShowHistory(true);
                },
              },
            ].map(({ icon, label, cls, action }) => (
              <button
                key={label}
                onClick={action}
                className="py-2.5 rounded-lg flex flex-col items-center gap-1 transition-all hover:-translate-y-0.5"
                style={{
                  border:     cls === 'shock' ? '1px solid rgba(255,61,61,0.5)'
                            : cls === 'loc'   ? '1px solid rgba(0,184,217,0.3)'
                            :                   '1px solid rgba(0,230,118,0.3)',
                  background: cls === 'shock' ? 'rgba(255,61,61,0.08)' : '#111820',
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
                style={
                  a === dog.activity
                    ? { background: 'rgba(0,184,217,0.12)', border: '1px solid rgba(0,184,217,0.4)', color: '#00b8d9' }
                    : { background: 'transparent', border: '1px solid #1e2d3d', color: '#4a6272' }
                }
              >
                {a}
              </span>
            ))}
          </div>

          {/* R-value sparkline */}
          <div className="mb-4">
            <p className="font-heading text-white font-bold text-[12px] uppercase tracking-[1px] mb-2.5">
              R-Value — Last 12 Hours
            </p>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={rHistory} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,45,61,0.5)" />
                <XAxis dataKey="label" tick={{ fill: '#4a6272', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#4a6272', fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#0c1017', border: '1px solid #1e2d3d', borderRadius: 6, fontSize: 11 }}
                  labelStyle={{ color: '#4a6272' }}
                />
                {/* ✅ Risk zone reference lines — shows thresholds on chart */}
                <ReferenceLine y={70} stroke="#ff3d3d" strokeDasharray="4 3" strokeOpacity={0.45}
                  label={{ value: 'HIGH', position: 'insideTopRight', fill: '#ff3d3d', fontSize: 8 }} />
                <ReferenceLine y={40} stroke="#ffd740" strokeDasharray="4 3" strokeOpacity={0.45}
                  label={{ value: 'MED', position: 'insideTopRight', fill: '#ffd740', fontSize: 8 }} />
                <Line
                  type="monotone" dataKey="val"
                  stroke={rColor} strokeWidth={2}
                  fill={RISK_FILL[dog.risk]}
                  dot={{ r: 2, fill: rColor }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Incident history table */}
          <div>
            <p className="font-heading text-white font-bold text-[12px] uppercase tracking-[1px] mb-2.5">
              Incident History (Today)
            </p>
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr>
                  {['Time', 'Behavior', 'R-Value', 'Duration', 'Action'].map((h) => (
                    <th
                      key={h}
                      className="font-mono-sg text-[9px] text-muted uppercase tracking-[2px] px-2.5 py-2 text-left"
                      style={{ borderBottom: '1px solid #1e2d3d' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {incidents.map((row, i) => (
                  <tr key={i} className="hover:bg-cyan/5 transition-colors">
                    <td className="px-2.5 py-2 font-mono-sg text-muted">{row.time}</td>
                    <td className="px-2.5 py-2 text-text">{row.behavior}</td>
                    <td className="px-2.5 py-2 font-mono-sg"
                      style={{ color: row.rval > 70 ? '#ff3d3d' : row.rval > 40 ? '#ffd740' : '#00e676' }}>
                      {row.rval}
                    </td>
                    <td className="px-2.5 py-2 text-text">{row.duration}</td>
                    <td className="px-2.5 py-2 font-mono-sg text-[10px] text-muted">{row.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 1-Month History Panel */}
          {showHistory && (
            <div className="mt-5">
              <p className="font-heading text-white font-bold text-[12px] uppercase tracking-[1px] mb-2">
                📊 1-Month Behavior History
              </p>
              <div className="max-h-[200px] overflow-y-auto rounded-lg" style={{ border: '1px solid #1e2d3d' }}>
                <table className="w-full text-[11px]">
                  <thead>
                    <tr style={{ borderBottom: '1px solid #1e2d3d' }}>
                      {['Date', 'R-Value', 'Activity'].map((h) => (
                        <th key={h} className="font-mono-sg text-[9px] text-muted uppercase tracking-[1px] px-3 py-2 text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                      {historyData.map((h, i) => {
                      const rColor = h.r >= 70 ? '#ff3d3d' : h.r >= 40 ? '#ffd740' : '#00e676';
                      const rLabel = h.r >= 70 ? 'HIGH' : h.r >= 40 ? 'MED' : 'LOW';
                      return (
                        <tr key={i} style={{
                          borderBottom: '1px solid rgba(30,45,61,0.4)',
                          background: i === 0 ? 'rgba(0,184,217,0.04)' : 'transparent'
                        }}>
                          <td className="px-3 py-1.5 font-mono-sg" style={{ color: i === 0 ? '#00b8d9' : '#4a6272' }}>
                            {h.date}{i === 0 ? ' ← today' : ''}
                          </td>
                          <td className="px-3 py-1.5">
                            <span className="font-mono-sg font-bold" style={{ color: rColor }}>{h.r}</span>
                            <span
                              className="ml-2 font-mono-sg text-[8px] px-1.5 py-0.5 rounded-sm"
                              style={{ background: `${rColor}18`, color: rColor, border: `1px solid ${rColor}40` }}
                            >
                              {rLabel}
                            </span>
                          </td>
                          <td className="px-3 py-1.5 text-text text-[11px]">{h.activity}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <button onClick={() => setShowHistory(false)}
                className="mt-2 text-[11px] font-mono-sg transition-colors hover:text-white"
                style={{ color: '#00b8d9' }}>
                ✕ Close History
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}