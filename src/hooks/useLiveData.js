// ─────────────────────────────────────────────
// src/hooks/useLiveData.js (FINAL HYBRID VERSION)
// ─────────────────────────────────────────────
import { useApp } from '../context/AppContext';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  INITIAL_DOGS, INITIAL_ALERTS, tickDogs, generateAlert,
  seedBehaviorHistory, deriveWeeklyData, deriveActivityData,
} from '../utils/simulator';
import { playAlert } from '../utils/alertSound';
import { subscribeToLiveDog } from "../firebase/realtimeService";

const TICK_INTERVAL = 8000;
const MAX_POINTS    = 12;

export default function useLiveData() {

  const [realDog,  setRealDog]  = useState(null);
  const [demoDogs, setDemoDogs] = useState(INITIAL_DOGS);
  const [alerts,   setAlerts]   = useState(INITIAL_ALERTS);
  const [alertCount, setAlertCount] = useState(4);
  const [lastShock,  setLastShock]  = useState('None today');
  const [loading,    setLoading]    = useState(true);

  const [behaviorData, setBehaviorData] = useState(() => seedBehaviorHistory(INITIAL_DOGS));
  const [weeklyData,   setWeeklyData]   = useState(() => deriveWeeklyData(INITIAL_DOGS));
  const [activityData, setActivityData] = useState(() => deriveActivityData(INITIAL_DOGS));

  const prevDogsRef    = useRef([]);
  const lastAlertTime  = useRef(0);

  // seed 4 past high-risk dog events so it starts at "+4 dogs in last hour"
  const highRiskHistory = useRef([
    { dogId: 'seed1', time: Date.now() - 1000 * 60 * 10 },
    { dogId: 'seed2', time: Date.now() - 1000 * 60 * 20 },
    { dogId: 'seed3', time: Date.now() - 1000 * 60 * 30 },
    { dogId: 'seed4', time: Date.now() - 1000 * 60 * 40 },
  ]);

  // ── Firebase Real Dog ──────────────────────────────────────────────────────
  useEffect(() => {
    let unsub;
    try {
      unsub = subscribeToLiveDog((data) => {
        setRealDog(data ? { ...data, source: 'real', emoji: '🐶' } : null);
        setLoading(false);
      });
    } catch (err) {
      console.error('Realtime DB error:', err);
      setLoading(false);
    }
    const fallback = setTimeout(() => setLoading(false), 3000);
    return () => { if (unsub) unsub(); clearTimeout(fallback); };
  }, []);

  // ── Demo Simulation ────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => setDemoDogs((prev) => tickDogs(prev)), TICK_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  // ── Merge real + demo ──────────────────────────────────────────────────────
  const dogs = useMemo(() => {
    const demoWithSource = demoDogs.map((d) => ({ ...d, source: 'demo' }));
    if (!realDog) return demoWithSource;
    return [
      { ...realDog, source: 'real' },
      ...demoWithSource.filter((d) => d.id !== realDog.id),
    ];
  }, [realDog, demoDogs]);

  // ── Charts Update ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!dogs.length) return;
    setBehaviorData((prev) => {
      const now  = new Date();
      const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
      const snap = {
        time,
        High:   dogs.filter((d) => d.risk === 'high').length,
        Medium: dogs.filter((d) => d.risk === 'medium').length,
        Low:    dogs.filter((d) => d.risk === 'low').length,
      };
      const updated = [...prev, snap];
      return updated.length > MAX_POINTS ? updated.slice(updated.length - MAX_POINTS) : updated;
    });
  
    setActivityData(deriveActivityData(dogs));
  }, [dogs]);

// ── Path History Recording ─────────────────────────────────
// Add this import at the top:
// import { useApp } from '../context/AppContext';

// Inside useLiveData(), add:
const { trackedDog, appendPath } = useApp();

useEffect(() => {
  if (!trackedDog) return;
  const dog = dogs.find((d) => d.id === trackedDog.id);
  if (dog?.lat && dog?.lng) {
    appendPath(dog.id, dog.lat, dog.lng);
  }
}, [dogs, trackedDog, appendPath]);

  // ── Alert System — ONLY fires sound + UI alert, NO count/history change ───
  useEffect(() => {
    const now = Date.now();
    const newHighRiskDogs = dogs.filter((d) => d.risk === 'high' && d.r > 75);
    if (newHighRiskDogs.length > 0 && now - lastAlertTime.current > 10000) {
      lastAlertTime.current = now;
      setAlerts((a) => [generateAlert(dogs), ...a].slice(0, 20));
      // ✅ NO alertCount++ here — spike detector below owns that
      playAlert('high');
    }
  }, [dogs]);

  // ── Spike Detector — ONLY source of alertCount + highRiskHistory ──────────
  useEffect(() => {
    const prevDogs = prevDogsRef.current;

    dogs.forEach((dog) => {
      const prev = prevDogs.find((d) => d.id === dog.id);
      if (!prev) return;

      const becameHigh = prev.risk !== 'high' && dog.risk === 'high';
      // ✅ spikeJump only counts if dog is actually high risk — prevents
      //    medium/low dogs from inflating the counter on normal variance
      const spikeJump  = dog.risk === 'high' && dog.r - prev.r > 15;

      if (becameHigh || spikeJump) {
        const now = Date.now();

        // Only add if this dog isn't already in history within last 5 min
        // (prevents same dog re-triggering every 8s tick)
        const recentlyCounted = highRiskHistory.current.some(
          (e) => e.dogId === dog.id && now - e.time < 5 * 60 * 1000
        );

        if (!recentlyCounted) {
          // ✅ increment count ONLY for a genuinely new high-risk dog
          setAlertCount((c) => c + 1);

          highRiskHistory.current = [
            ...highRiskHistory.current.filter((e) => now - e.time < 3_600_000),
            { dogId: dog.id, time: now },
          ];

          setAlerts((a) => [generateAlert(dogs), ...a].slice(0, 20));
          playAlert('high');
        }
      }
    });

    prevDogsRef.current = dogs;
  }, [dogs]);

  // ── KPI ───────────────────────────────────────────────────────────────────
  const kpi = {
    total:     dogs.length,
    high:      dogs.filter((d) => d.risk === 'high').length,
    medium:    dogs.filter((d) => d.risk === 'medium').length,
    low:       dogs.filter((d) => d.risk === 'low').length,
    alerts:    alertCount,
    // ✅ unique dogs that went high-risk in the last hour
    alertText: `+${highRiskHistory.current.filter(
      (e) => Date.now() - e.time < 3_600_000
    ).length} dogs in last hour`,
  };

  // ── Actions ───────────────────────────────────────────────────────────────
  const triggerShock = useCallback((dog) => {
    const target = dog ? dog.name : 'ALL HIGH RISK';
    const now    = new Date().toLocaleTimeString('en-IN', { hour12: false });
    setLastShock(`${target} · ${now}`);
    setAlertCount((c) => c + 1);
  }, []);

  const dispatchTeam = useCallback(() => {
    setAlerts((a) => [{
      id: `a${Date.now()}`, level: 'info', icon: '🔵',
      title: 'Field Team Dispatched', msg: 'Response unit en route.', timeLabel: 'just now',
    }, ...a].slice(0, 20));
  }, []);

  const exportCSV = useCallback(() => {
    const header = 'Belt ID,Name,Risk,R-Value,Activity,Zone,Battery,Lat,Lng\n';
    const rows   = dogs.map((d) =>
      `${d.id},${d.name},${d.risk},${d.r},${d.activity},"${d.zone}",${d.batt}%,${d.lat ?? ''},${d.lng ?? ''}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `streetguard_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }, [dogs]);

  const generateMonthlyHistory = useCallback((dogId) => {
    return Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
      r: Math.max(10, Math.min(95,
        dogId.includes('1') ? 70 + Math.random() * 20 : 30 + Math.random() * 40
      )),
      activity: ['Resting', 'Walking', 'Aggressive'][Math.floor(Math.random() * 3)],
    }));
  }, []);

  return {
    dogs, alerts, behaviorData, activityData, weeklyData,
    kpi, lastShock, loading, error: null,
    triggerShock, dispatchTeam, exportCSV, generateMonthlyHistory,
  };
}