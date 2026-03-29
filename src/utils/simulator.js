// ─────────────────────────────────────────────────────────────
// src/utils/simulator.js
// Generates and mutates simulated dog data so the dashboard
// looks "live" even when no real Firebase data is present.
// ─────────────────────────────────────────────────────────────
const BASE_LAT = 10.070409665180874;
const BASE_LNG = 76.36798760188792;

export const INITIAL_DOGS = [
  { id:'BLT-001', name:'Rusty',   emoji:'🐕',    risk:'high',   r:87, activity:'Aggressive',  zone:'College Gate',   batt:72, lat:BASE_LAT + 0.0005, lng:BASE_LNG + 0.0003, breed:'Mixed' },
  { id:'BLT-002', name:'Shadow',  emoji:'🐩',    risk:'high',   r:81, activity:'Running',     zone:'Campus Road',    batt:55, lat:BASE_LAT - 0.0004, lng:BASE_LNG + 0.0006, breed:'Labrador' },
  { id:'BLT-003', name:'Bolt',    emoji:'🦮',    risk:'high',   r:76, activity:'Aggressive',  zone:'Ground Area',    batt:88, lat:BASE_LAT + 0.0008, lng:BASE_LNG - 0.0005, breed:'German Shepherd' },
  { id:'BLT-004', name:'Fang',    emoji:'🐕‍🦺', risk:'high',   r:74, activity:'Threatening', zone:'Main Road',      batt:34, lat:BASE_LAT - 0.0006, lng:BASE_LNG + 0.0009, breed:'Rottweiler' },

  { id:'BLT-005', name:'Biscuit', emoji:'🐶',    risk:'medium', r:62, activity:'Walking',     zone:'Nearby Shops',   batt:91, lat:BASE_LAT + 0.0003, lng:BASE_LNG - 0.0007, breed:'Beagle' },
  { id:'BLT-006', name:'Coco',    emoji:'🐕',    risk:'medium', r:58, activity:'Running',     zone:'Bus Stop',       batt:67, lat:BASE_LAT + 0.0010, lng:BASE_LNG + 0.0004, breed:'Cocker Spaniel' },
  { id:'BLT-007', name:'Duke',    emoji:'🦮',    risk:'medium', r:53, activity:'Walking',     zone:'Residential Rd', batt:78, lat:BASE_LAT - 0.0008, lng:BASE_LNG - 0.0003, breed:'Husky' },
  { id:'BLT-008', name:'Max',     emoji:'🐩',    risk:'medium', r:48, activity:'Sniffing',    zone:'Temple Side',    batt:82, lat:BASE_LAT + 0.0002, lng:BASE_LNG + 0.0010, breed:'Poodle' },

  { id:'BLT-009', name:'Pepper',  emoji:'🐕‍🦺', risk:'medium', r:42, activity:'Walking',     zone:'East Lane',      batt:45, lat:BASE_LAT - 0.0003, lng:BASE_LNG - 0.0009, breed:'Dalmatian' },
  { id:'BLT-010', name:'Buddy',   emoji:'🐶',    risk:'low',    r:28, activity:'Resting',     zone:'Hostel Area',    batt:93, lat:BASE_LAT + 0.0006, lng:BASE_LNG - 0.0004, breed:'Pomeranian' },
  { id:'BLT-011', name:'Luna',    emoji:'🐕',    risk:'low',    r:22, activity:'Resting',     zone:'Ground Area',    batt:76, lat:BASE_LAT + 0.0001, lng:BASE_LNG + 0.0002, breed:'Shih Tzu' },
  { id:'BLT-012', name:'Bruno',   emoji:'🦮',    risk:'low',    r:18, activity:'Lying',       zone:'Parking Area',   batt:60, lat:BASE_LAT - 0.0005, lng:BASE_LNG + 0.0008, breed:'Labrador' },
  { id:'BLT-013', name:'Daisy',   emoji:'🐩',    risk:'low',    r:15, activity:'Lying',       zone:'Back Side',      batt:88, lat:BASE_LAT + 0.0007, lng:BASE_LNG - 0.0006, breed:'Golden Ret.' },
  { id:'BLT-014', name:'Tiger',   emoji:'🐕',    risk:'low',    r:12, activity:'Resting',     zone:'Main Junction',  batt:51, lat:BASE_LAT - 0.0009, lng:BASE_LNG + 0.0001, breed:'Mixed' },
];

export const INITIAL_ALERTS = [
  { id:'a1', level:'high',   icon:'🔴', title:'BLT-001 Rusty — High Aggression',   msg:'R-value spiked to 87. Immediate response required.', timeLabel:'2 min ago' },
  { id:'a2', level:'high',   icon:'🔴', title:'BLT-003 Bolt — Threat Detected',    msg:'Aggressive behavior detected at Zone 7.',            timeLabel:'8 min ago' },
  { id:'a3', level:'medium', icon:'🟡', title:'BLT-004 Fang — Low Battery',        msg:'Belt battery at 34%. Replacement needed soon.',      timeLabel:'15 min ago' },
  { id:'a4', level:'info',   icon:'🔵', title:'BLT-009 Pepper — Device Alert',     msg:'Temporary signal loss. Reconnected.',                timeLabel:'22 min ago' },
  { id:'a5', level:'high',   icon:'🔴', title:'BLT-002 Shadow — Running Alert',    msg:'Unusually fast movement in residential area.',       timeLabel:'31 min ago' },
];

// Risk category derived from score
export function calcRisk(r) {
  return r >= 70 ? 'high' : r >= 40 ? 'medium' : 'low';
}

// Tick all dog R-values slightly and re-derive risk
export function tickDogs(dogs) {
  return dogs.map((d) => {
    const newR = Math.max(
      5,
      Math.min(99, d.r + Math.round((Math.random() - 0.45) * 4))
    );

    // 🧠 Activity-based movement logic
    const isResting =
      d.activity === "Resting" ||
      d.activity === "Lying";

    const isSlow =
      d.activity === "Walking" ||
      d.activity === "Sniffing";

    const isFast =
      d.activity === "Running" ||
      d.activity === "Aggressive" ||
      d.activity === "Threatening";

    let movement = 0;

    if (isResting) {
      movement = 0; // ❌ no movement
    } else if (isSlow) {
      movement = 0.00008; // 🐾 slow movement
    } else if (isFast) {
      movement = 0.0002; // ⚡ fast movement
    } else {
      movement = 0.0001; // default
    }

    return {
      ...d,
      r: newR,
      risk: calcRisk(newR),

      // 📍 movement applied here
      lat: d.lat + (Math.random() - 0.5) * movement,
      lng: d.lng + (Math.random() - 0.5) * movement,
    };
  });
}

// Generate a random time label string
export function randomTimeLabel() {
  const mins = Math.floor(Math.random() * 5) + 1;
  return `${mins} min ago`;
}

// Randomly generate a new alert from current dog list
export function generateAlert(dogs) {
  const highDogs  = dogs.filter((d) => d.risk === 'high');
  const medDogs   = dogs.filter((d) => d.risk === 'medium');
  const templates = [
    (d) => ({ level:'high',   icon:'🔴', title:`${d.id} ${d.name} — High Aggression`,  msg:`R-value spiked to ${d.r}. Immediate response required.` }),
    (d) => ({ level:'high',   icon:'🔴', title:`${d.id} ${d.name} — Threat Detected`,  msg:`${d.activity} detected at ${d.zone}.` }),
    (d) => ({ level:'medium', icon:'🟡', title:`${d.id} ${d.name} — Monitor Closely`,  msg:`R-value at ${d.r}. Elevated risk in ${d.zone}.` }),
    (d) => ({ level:'info',   icon:'🔵', title:`${d.id} ${d.name} — Status Update`,    msg:`Belt check-in received. Battery: ${d.batt}%.` }),
  ];

  const pool = highDogs.length ? highDogs : medDogs.length ? medDogs : dogs;
  const dog  = pool[Math.floor(Math.random() * pool.length)];
  const tmpl = templates[Math.floor(Math.random() * templates.length)];
  return { id: `a${Date.now()}`, ...tmpl(dog), timeLabel: 'just now' };
}

// Build 24h behavior trend data for Recharts
export function buildBehaviorData() {
  const hours = Array.from({ length: 12 }, (_, i) => `${String(i * 2).padStart(2,'0')}:00`);
  return hours.map((h) => ({
    time: h,
    High:   Math.floor(Math.random() * 5 + 1),
    Medium: Math.floor(Math.random() * 8 + 2),
    Low:    Math.floor(Math.random() * 6 + 3),
  }));
}

// Build donut chart data (activity split)
export function buildActivityData() {
  return [
    { name: 'Resting',     value: 28, color: '#00e676' },
    { name: 'Walking',     value: 22, color: '#00b8d9' },
    { name: 'Running',     value: 18, color: '#ffd740' },
    { name: 'Aggressive',  value: 16, color: '#ff3d3d' },
    { name: 'Sniffing',    value: 10, color: '#ff6d00' },
    { name: 'Threatening', value: 6,  color: '#9c27b0' },
  ];
}

// Build weekly stacked bar data
export function buildWeeklyData() {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  return days.map((d) => ({
    day:    d,
    High:   Math.floor(Math.random() * 10 + 6),
    Medium: Math.floor(Math.random() * 12 + 8),
  }));
}

// Generate R-value sparkline history for a single dog
export function buildRHistory(baseR) {
  return Array.from({ length: 12 }, (_, i) =>
    Math.max(0, Math.min(100, baseR + (Math.random() - 0.5) * 20 + Math.sin(i) * 5))
  );
}

// Generate incident history rows for dog modal
export function buildIncidentHistory() {
  const behaviors = ['Resting','Walking','Running','Sniffing','Threatening','Aggressive'];
  const actions   = ['Monitored','Alert Sent','Shock Triggered','Dispatched','Resolved'];
  return Array.from({ length: 6 }, () => {
    const h   = String(Math.floor(Math.random() * 12 + 6)).padStart(2, '0');
    const m   = String(Math.floor(Math.random() * 59)).padStart(2, '0');
    const rr  = Math.floor(Math.random() * 80 + 10);
    const dur = Math.floor(Math.random() * 30 + 2) + ' min';
    return {
      time:     `${h}:${m}`,
      behavior: behaviors[Math.floor(Math.random() * behaviors.length)],
      rval:     rr,
      duration: dur,
      action:   actions[Math.floor(Math.random() * actions.length)],
    };
  });
}
