// ─────────────────────────────────────────────────────────────
// src/components/Charts.jsx
// All charts receive data derived from dogs[] — never random.
// Data keys used:
//   BehaviorChart: { time, High, Medium, Low }   ← exact dog counts
//   WeeklyChart:   { day, High, Medium }          ← hash-bucketed counts
//   ActivityChart: { name, value, color }         ← activity counts
// ─────────────────────────────────────────────────────────────

import {
  ResponsiveContainer,
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

/* ── shared tooltip style ── */
const TT_STYLE = {
  contentStyle: { background: '#0c1017', border: '1px solid #1e2d3d', borderRadius: 6, fontSize: 11 },
  labelStyle:   { color: '#4a6272' },
  itemStyle:    { color: '#c8d8e8' },
};

/* ── Panel wrapper ── */
function Panel({ title, badge, badgeColor = 'cyan', children }) {
  const badgeStyles = {
    cyan:  { background: 'rgba(0,184,217,0.12)',  border: '1px solid rgba(0,184,217,0.3)',  color: '#00b8d9' },
    green: { background: 'rgba(0,230,118,0.10)',  border: '1px solid rgba(0,230,118,0.3)',  color: '#00e676' },
    red:   { background: 'rgba(255,61,61,0.12)',  border: '1px solid rgba(255,61,61,0.3)',  color: '#ff3d3d' },
  };
  return (
    <div className="rounded-xl p-4 animate-fadeUp" style={{ background: '#111820', border: '1px solid #1e2d3d' }}>
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="font-heading text-white font-bold text-[13px] uppercase tracking-[1px]">{title}</h3>
        <span className="font-mono-sg text-[9px] px-2 py-0.5 rounded-sm tracking-[1px]" style={badgeStyles[badgeColor]}>
          {badge}
        </span>
      </div>
      {children}
    </div>
  );
}

/* ── Custom dot: only renders on the last (live) data point ── */
function LiveDot({ cx, cy, index, dataLength, color }) {
  if (index !== dataLength - 1) return null;
  return <circle cx={cx} cy={cy} r={5} fill={color} stroke="#07090d" strokeWidth={2} />;
}

/* ── 1. Behavior Trend ── */
// data shape: [{ time: "HH:MM", High: n, Medium: n, Low: n }, ...]
// The rightmost point always equals the KPI card values.
export function BehaviorChart({ data }) {
  const len = data.length;
  return (
    <Panel title="📈 Behavior Trends" badge="LIVE · 12PT" badgeColor="cyan">
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gHigh"   x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#ff3d3d" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#ff3d3d" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gMedium" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#ffd740" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ffd740" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gLow"    x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#00e676" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#00e676" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,45,61,0.5)" />
          <XAxis
            dataKey="time"
            tick={{ fill: '#4a6272', fontSize: 9 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: '#4a6272', fontSize: 9 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            domain={[0, 'dataMax + 1']}
          />
          <Tooltip {...TT_STYLE} />
          <Legend wrapperStyle={{ fontSize: 10, color: '#4a6272' }} />
          <Area
            type="monotone" dataKey="High"
            stroke="#ff3d3d" fill="url(#gHigh)" strokeWidth={2}
            dot={<LiveDot dataLength={len} color="#ff3d3d" />}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />
          <Area
            type="monotone" dataKey="Medium"
            stroke="#ffd740" fill="url(#gMedium)" strokeWidth={2}
            dot={<LiveDot dataLength={len} color="#ffd740" />}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />
          <Area
            type="monotone" dataKey="Low"
            stroke="#00e676" fill="url(#gLow)" strokeWidth={2}
            dot={<LiveDot dataLength={len} color="#00e676" />}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Panel>
  );
}

/* ── 2. Activity Split (Pie/Donut) ── */
// data shape: [{ name: "Running", value: 3, color: "#ffd740" }, ...]
// Values are real counts of dogs[].activity — not hardcoded percentages.
const RADIAN = Math.PI / 180;
function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.07) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={9}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export function ActivityChart({ data }) {
  return (
    <Panel title="🏃 Activity Split" badge="TODAY" badgeColor="green">
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="50%"
            innerRadius={48} outerRadius={72}
            dataKey="value"
            labelLine={false}
            label={<CustomLabel />}
            isAnimationActive={false}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Legend wrapperStyle={{ fontSize: 9, color: '#4a6272' }} iconSize={8} />
          <Tooltip {...TT_STYLE} />
        </PieChart>
      </ResponsiveContainer>
    </Panel>
  );
}

/* ── 3. Weekly Aggression (Stacked Bar) ── */
// data shape: [{ day: "Mon", High: n, Medium: n }, ...]
// Each dog's belt ID is hashed to a stable day bucket — no randomness.
// Values change only when dog risk levels change.
export function WeeklyChart({ data }) {
  return (
    <Panel title="📊 Weekly Risk Distribution" badge="REAL DATA" badgeColor="cyan">
      <ResponsiveContainer width="100%" height={160}>
        <BarChart 
          data={data} 
          margin={{ top: 4, right: 4, left: -20, bottom: 0 }} 
          barSize={14}
          barCategoryGap="30%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,45,61,0.5)" vertical={false} />

          <XAxis
            dataKey="day"
            tick={{ fill: '#4a6272', fontSize: 9 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: '#4a6272', fontSize: 9 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />

          <Tooltip 
            {...TT_STYLE}
            formatter={(value) => `${value} dogs`}
          />

          <Legend wrapperStyle={{ fontSize: 10, color: '#4a6272' }} />

          {/* 🔴 HIGH */}
          <Bar 
            dataKey="High" 
            stackId="a" 
            fill="#c94a4a" 
            radius={[0,0,3,3]} 
            isAnimationActive={false} 
          />

          {/* 🟡 MEDIUM */}
          <Bar 
            dataKey="Medium" 
            stackId="a" 
            fill="#c9a84a" 
            isAnimationActive={false} 
          />

          {/* 🟢 LOW (NEW) */}
          <Bar 
            dataKey="Low" 
            stackId="a" 
            fill="#4aa36b" 
            radius={[3,3,0,0]} 
            isAnimationActive={false} 
          />

        </BarChart>
      </ResponsiveContainer>
    </Panel>
  );
}
