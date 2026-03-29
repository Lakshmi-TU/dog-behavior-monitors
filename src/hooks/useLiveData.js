// ─────────────────────────────────────────────────────────────
// src/hooks/useLiveData.js
// Central hook that drives all live data in the app.
// Uses local simulation by default; swap commented lines to use
// real Firebase Firestore subscriptions instead.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';
import {
  INITIAL_DOGS,
  INITIAL_ALERTS,
  tickDogs,
  generateAlert,
  buildBehaviorData,
  buildActivityData,
  buildWeeklyData,
} from '../utils/simulator';
import { playAlert } from '../utils/alertSound';

// Uncomment for real Firebase:
// import { subscribeToDogs, subscribeToAlerts, pushAlert } from '../firebase/firestoreService';

const TICK_INTERVAL = 8000; // ms between live simulation ticks

export default function useLiveData() {
  const [dogs,          setDogs]         = useState(INITIAL_DOGS);
  const [alerts,        setAlerts]       = useState(INITIAL_ALERTS);
  const [behaviorData, setBehaviorData] = useState([]);
  const [activityData]                   = useState(() => buildActivityData());
  const [weeklyData,    setWeeklyData]   = useState(() => buildWeeklyData());
  const [alertCount,    setAlertCount]   = useState(3);
  const [lastShock,     setLastShock]    = useState('None today');
  const [loading,       setLoading]      = useState(true);
  const [error,         setError]        = useState(null);

  // ── Simulate loading state ───────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

// ── Live simulation tick ─────────────────────────────────
useEffect(() => {
  const timer = setInterval(() => {

    setDogs((prev) => {

      const moved = prev.map((dog) => {

        const isResting =
          dog.activity === "Resting" ||
          dog.activity === "Lying";

        if (isResting) return dog;

        const delta = (Math.random() - 0.5) * 0.0003;

        return {
          ...dog,
          lat: dog.lat + delta,
          lng: dog.lng + delta,
        };
      });

      const updated = tickDogs(moved);

      

      // 🚨 ALERTS
      const highRiskDogs = updated.filter(d => d.risk === "high");
      if (highRiskDogs.length > 0 && Math.random() < 0.5) {
        const newAlert = generateAlert(updated);

        setAlerts((a) => [newAlert, ...a].slice(0, 20));
        setAlertCount((c) => c + 1);

        if (newAlert.level === "high") {
          playAlert("high");
        }
      }

      return updated;
    });

    setWeeklyData(buildWeeklyData());

  }, TICK_INTERVAL);

  return () => clearInterval(timer);
}, []);

useEffect(() => {

  if (!dogs || dogs.length === 0) return;

  const counts = {
    high: dogs.filter(d => d.risk === "high").length,
    medium: dogs.filter(d => d.risk === "medium").length,
    low: dogs.filter(d => d.risk === "low").length,
  };

  setBehaviorData((prev) => {

    const newPoint = {
      label: new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }),
      high: counts.high,
      medium: counts.medium,
      low: counts.low,
    };

    const MAX_POINTS = 12;

    let updated = prev && prev.length
      ? [...prev.slice(-(MAX_POINTS - 1)), newPoint]
      : [newPoint];

    updated[updated.length - 1] = newPoint;

    return updated;
  });

}, [dogs]);  // ✅ CLOSE HERE

  // ── Derived KPI values ───────────────────────────────────
  const kpi = {
    total:  dogs.length,
    high:   dogs.filter((d) => d.risk === 'high').length,
    medium: dogs.filter((d) => d.risk === 'medium').length,
    low:    dogs.filter((d) => d.risk === 'low').length,
    alerts: alertCount,
  };

  // ── Actions ──────────────────────────────────────────────
  const triggerShock = useCallback((dog) => {
    const target = dog ? dog.name : 'ALL HIGH RISK';
    const now    = new Date().toLocaleTimeString('en-IN', { hour12: false });
    setLastShock(`${target} · ${now}`);
    setAlertCount((c) => c + 1);
  }, []);

  const dispatchTeam = useCallback(() => {
    const newAlert = {
      id:        `a${Date.now()}`,
      level:     'info',
      icon:      '🔵',
      title:     'Field Team Dispatched',
      msg:       'Response unit en route to Zone 3.',
      timeLabel: 'just now',
    };
    setAlerts((a) => [newAlert, ...a].slice(0, 20));
  }, []);

  const exportCSV = useCallback(() => {
  const header =
    'Belt ID,Name,Breed,Risk Level,R-Value,Activity,Zone,Battery,Latitude,Longitude\n';

  const rows = dogs.map((d) =>
    `${d.id},${d.name},${d.breed},${d.risk.toUpperCase()},${d.r},${d.activity},"${d.zone}",${d.batt}%,${d.lat},${d.lng}`
  ).join('\n');

  const blob = new Blob([header + rows], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `streetguard_export_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
}, [dogs]);

const generateMonthlyHistory = (dogId) => {
  return Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
    r: Math.max(10, Math.min(95, dogId.includes("1") 
  ? 70 + Math.random()*20 
  : 30 + Math.random()*40)),
    activity: ["Resting","Walking","Aggressive"][Math.floor(Math.random()*3)]
  }));
};

  return {
    dogs,
    alerts,
    behaviorData,
    activityData,
    weeklyData,
    kpi,
    lastShock,
    loading,
    error,
    triggerShock,
    dispatchTeam,
    exportCSV,
    generateMonthlyHistory,
  };
}
