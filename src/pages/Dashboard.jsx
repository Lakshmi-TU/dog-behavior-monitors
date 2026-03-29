// ─────────────────────────────────────────────────────────────
// src/pages/Dashboard.jsx
// Main dashboard page — composes all panels in the exact
// same grid layout as the original HTML dashboard.
// ─────────────────────────────────────────────────────────────

import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';

import Header       from '../components/Header';
import StatCard     from '../components/StatCard';
import LiveTable    from '../components/LiveTable';
import LiveMap      from '../components/LiveMap';
import { RValueMeter, BatteryStatus } from '../components/HistoryPanel';
import { BehaviorChart, ActivityChart, WeeklyChart } from '../components/Charts';
import DangerAlert  from '../components/DangerAlert';
import ControlPanel from '../components/ControlPanel';

export default function Dashboard({ data }) {
  const { selectedDog } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const { dogs, alerts, kpi, behaviorData, activityData, weeklyData, lastShock, exportCSV, dispatchTeam, triggerShock } = data;

  // Filtered dogs for the dog grid
  const filteredDogs = useMemo(() => {
    const q = search.toLowerCase();
    return dogs.filter((d) => {
      const matchFilter = filter === 'all' || d.risk === filter;
      const matchSearch = !q || d.id.toLowerCase().includes(q) || d.name.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [dogs, search, filter]);

  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      {/* Top bar */}
      <Header
        search={search}
        onSearch={setSearch}
        filter={filter}
        onFilter={setFilter}
        onExport={exportCSV}
      />

      {/* Page content */}
      <div className="p-5 px-6 flex-1">

        {/* ── KPI Row ── */}
        <div className="grid grid-cols-6 gap-3 mb-5">
          <StatCard label="Total Dogs"    value={kpi.total}  sub="Active belts"       color="cyan"   barWidth="100%"               delay={0.05} />
          <StatCard label="High Risk"     value={kpi.high}   sub="R-value ≥ 70"       color="red"    barWidth={`${(kpi.high/kpi.total)*100}%`}   delay={0.10} />
          <StatCard label="Medium Risk"   value={kpi.medium} sub="R-value 40–69"      color="yellow" barWidth={`${(kpi.medium/kpi.total)*100}%`} delay={0.15} />
          <StatCard label="Safe"          value={kpi.low}    sub="R-value < 40"       color="green"  barWidth={`${(kpi.low/kpi.total)*100}%`}    delay={0.20} />
          <StatCard label="Today's Alerts" value={kpi.alerts} sub="+4 in last hour"   color="red"    barWidth="60%"                delay={0.25} />
          <StatCard label="ML Confidence" value="91.4%"      sub="Ensemble model"     color="white"  barWidth="91.4%"              delay={0.30} />
        </div>

        {/* ── Row 1: Dog Grid (2fr) + Right column (1fr) ── */}
        <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: '2fr 1fr' }}>

          {/* Dog Identification */}
          <div className="rounded-xl p-4 animate-fadeUp" style={{ background: '#111820', border: '1px solid #1e2d3d' }}>
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="font-heading text-white font-bold text-[13px] uppercase tracking-[1px]">🐕 Dog Identification</h3>
              <span
                className="font-mono-sg text-[9px] px-2 py-0.5 rounded-sm tracking-[1px]"
                style={{ background: 'rgba(0,184,217,0.12)', border: '1px solid rgba(0,184,217,0.3)', color: '#00b8d9' }}
              >
                {filteredDogs.length} ACTIVE
              </span>
            </div>
            <LiveTable dogs={filteredDogs} selectedDog={selectedDog} />
          </div>

          {/* Right column: Map + R-Meter */}
          <div className="flex flex-col gap-4">
            <LiveMap dogs={dogs} />
            <RValueMeter dogs={dogs} />
          </div>
        </div>

        {/* ── Row 2: Behavior chart + Activity + Alerts ── */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <BehaviorChart data={behaviorData} />
          <ActivityChart data={activityData} />
          <DangerAlert   alerts={alerts} />
        </div>

        {/* ── Row 3: Weekly + Battery + Control ── */}
        <div className="grid grid-cols-3 gap-4">
          <WeeklyChart    data={weeklyData} />
          <BatteryStatus  dogs={dogs} />
          <ControlPanel   lastShock={lastShock} onDispatch={dispatchTeam} />
        </div>

      </div>
    </div>
  );
}
