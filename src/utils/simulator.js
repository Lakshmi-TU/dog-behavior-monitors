// src/utils/simulator.js

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

// ✅ Realistic initial alerts — proper level/message matching
export const INITIAL_ALERTS = [
  {
    id: 'a1', level: 'high', icon: '🔴',
    title: 'BLT-001 Rusty — Aggressive Behavior',
    msg:   'R-value critical at 87. Dog is aggressive at College Gate. Immediate action required.',
    timeLabel: '2 min ago',
  },
  {
    id: 'a2', level: 'high', icon: '🔴',
    title: 'BLT-003 Bolt — Threat Detected',
    msg:   'Aggressive behavior at Ground Area. R-value: 76. Dispatch field unit.',
    timeLabel: '8 min ago',
  },
  {
    id: 'a3', level: 'high', icon: '🔴',
    title: 'BLT-002 Shadow — R-Value Spike',
    msg:   'Sudden aggression spike to 81. Activity: Running. Zone: Campus Road.',
    timeLabel: '14 min ago',
  },
  {
    id: 'a4', level: 'medium', icon: '🟡',
    title: 'BLT-004 Fang — Low Battery',
    msg:   'Belt battery at 34%. Replace soon to avoid signal loss.',
    timeLabel: '20 min ago',
  },
  {
    id: 'a5', level: 'medium', icon: '🟡',
    title: 'BLT-006 Coco — Escalation Risk',
    msg:   'Behavior trending upward. Current R: 58. Zone: Bus Stop.',
    timeLabel: '28 min ago',
  },
  {
    id: 'a6', level: 'info', icon: '🔵',
    title: 'BLT-011 Luna — Zone Update',
    msg:   'Dog moved to Ground Area. Current activity: Resting. R: 22.',
    timeLabel: '35 min ago',
  },
];

export function calcRisk(r) {
  return r >= 70 ? 'high' : r >= 40 ? 'medium' : 'low';
}

const ACTIVITY_BY_RISK = {
  high:   ['Aggressive', 'Threatening', 'Running'],
  medium: ['Walking', 'Running', 'Sniffing'],
  low:    ['Resting', 'Lying', 'Walking'],
};

export function tickDogs(dogs) {
  let updatedDogs = dogs.map((d) => {
    let newR = d.r;

    newR += (Math.random() - 0.5) * 6;
    if (Math.random() < 0.35) newR += (Math.random() - 0.5) * 12;
    if (Math.random() < 0.08) newR += Math.random() * 25;
    if (Math.random() < 0.08) newR -= Math.random() * 25;
    if (d.r > 70 && Math.random() < 0.6) newR += Math.random() * 4;
    if (d.r < 30 && Math.random() < 0.6) newR -= Math.random() * 4;

    newR = Math.max(5, Math.min(92, Math.round(newR)));

    const newRisk       = calcRisk(newR);
    const becameHigh    = d.risk !== 'high' && newRisk === 'high';
    const spikeJump     = newR - d.r > 15;
    const riskChanged   = newRisk !== d.risk;
    const naturalChange = Math.random() < 0.20;
    let newActivity     = d.activity;

    if (riskChanged || naturalChange) {
      const pool  = ACTIVITY_BY_RISK[newRisk];
      newActivity = pool[Math.floor(Math.random() * pool.length)];
    }

    const isResting = newActivity === 'Resting' || newActivity === 'Lying';
    const isSlow    = newActivity === 'Walking'  || newActivity === 'Sniffing';
    const isFast    = newActivity === 'Running'  || newActivity === 'Aggressive' || newActivity === 'Threatening';
    const movement  = isResting ? 0 : isSlow ? 0.00008 : isFast ? 0.0002 : 0.0001;

    return {
      ...d,
      r: newR, risk: newRisk, activity: newActivity,
      lat: d.lat + (Math.random() - 0.5) * movement,
      lng: d.lng + (Math.random() - 0.5) * movement,
      alertTrigger: becameHigh || spikeJump,
    };
  });

  // Keep at least 3 medium-risk dogs for visual balance
  let mediumDogs = updatedDogs.filter(d => d.r >= 40 && d.r < 70);
  if (mediumDogs.length < 3) {
    const candidates = updatedDogs.filter(d => d.r < 40 || d.r >= 70);
    for (let i = 0; i < 3 - mediumDogs.length; i++) {
      const dog = candidates[i];
      if (!dog) break;
      dog.r    = Math.floor(45 + Math.random() * 15);
      dog.risk = 'medium';
    }
  }

  return updatedDogs;
}

export function randomTimeLabel() {
  return `${Math.floor(Math.random() * 5) + 1} min ago`;
}

// ✅ generateAlert — strict level-to-dog mapping, no "Status Update" for high-risk dogs
export function generateAlert(dogs) {
  const highDogs  = dogs.filter((d) => d.risk === 'high');
  const medDogs   = dogs.filter((d) => d.risk === 'medium');
  const lowDogs   = dogs.filter((d) => d.risk === 'low');

  const HIGH_TEMPLATES = [
    (d) => ({ level:'high', icon:'🔴', title:`${d.id} ${d.name} — Aggressive Behavior`,  msg:`R-value critical at ${d.r}. Dog is ${d.activity.toLowerCase()} at ${d.zone}. Immediate action required.` }),
    (d) => ({ level:'high', icon:'🔴', title:`${d.id} ${d.name} — Threat Detected`,       msg:`${d.activity} detected at ${d.zone}. R-value: ${d.r}. Dispatch field unit.` }),
    (d) => ({ level:'high', icon:'🔴', title:`${d.id} ${d.name} — Danger Zone`,           msg:`Belt reading ${d.r} — critically high. Last seen: ${d.zone}.` }),
    (d) => ({ level:'high', icon:'🔴', title:`${d.id} ${d.name} — R-Value Spike`,         msg:`Sudden aggression spike to ${d.r}. Activity: ${d.activity}. Zone: ${d.zone}.` }),
  ];

  const MEDIUM_TEMPLATES = [
    (d) => ({ level:'medium', icon:'🟡', title:`${d.id} ${d.name} — Elevated Activity`,  msg:`R-value at ${d.r}. ${d.activity} detected in ${d.zone}. Monitor closely.` }),
    (d) => ({ level:'medium', icon:'🟡', title:`${d.id} ${d.name} — Escalation Risk`,    msg:`Behavior trending upward. Current R: ${d.r}. Zone: ${d.zone}.` }),
    (d) => ({ level:'medium', icon:'🟡', title:`${d.id} ${d.name} — Caution`,            msg:`${d.activity} observed at ${d.zone}. R-value ${d.r} approaching threshold.` }),
  ];

  const INFO_TEMPLATES = [
    (d) => ({ level:'info', icon:'🔵', title:`${d.id} ${d.name} — Belt Check-in`,        msg:`Signal received. Battery: ${d.batt}%. Status: ${d.activity}. R: ${d.r}.` }),
    (d) => ({ level:'info', icon:'🔵', title:`${d.id} ${d.name} — Zone Update`,          msg:`Dog moved to ${d.zone}. Current activity: ${d.activity}. R: ${d.r}.` }),
  ];

  // Low battery fires as medium alert (not info) at 25% chance
  const lowBattDogs = dogs.filter((d) => d.batt < 35);
  if (lowBattDogs.length > 0 && Math.random() < 0.25) {
    const d = lowBattDogs[Math.floor(Math.random() * lowBattDogs.length)];
    return {
      id: `a${Date.now()}`,
      level: 'medium', icon: '🟡',
      title: `${d.id} ${d.name} — Low Battery`,
      msg:   `Belt battery at ${d.batt}%. Replace soon to avoid signal loss.`,
      timeLabel: 'just now',
    };
  }

  // Pick dog + template by risk priority
  let dog, tmpl;
  if (highDogs.length > 0 && Math.random() < 0.70) {
    dog  = highDogs[Math.floor(Math.random() * highDogs.length)];
    tmpl = HIGH_TEMPLATES[Math.floor(Math.random() * HIGH_TEMPLATES.length)];
  } else if (medDogs.length > 0 && Math.random() < 0.70) {
    dog  = medDogs[Math.floor(Math.random() * medDogs.length)];
    tmpl = MEDIUM_TEMPLATES[Math.floor(Math.random() * MEDIUM_TEMPLATES.length)];
  } else if (lowDogs.length > 0) {
    dog  = lowDogs[Math.floor(Math.random() * lowDogs.length)];
    tmpl = INFO_TEMPLATES[Math.floor(Math.random() * INFO_TEMPLATES.length)];
  } else {
    dog  = dogs[Math.floor(Math.random() * dogs.length)];
    tmpl = HIGH_TEMPLATES[0];
  }

  return { id: `a${Date.now()}`, ...tmpl(dog), timeLabel: 'just now' };
}

// ── Legacy exports ────────────────────────────────────────────
export function buildBehaviorData() {
  const hours = Array.from({ length: 12 }, (_, i) => `${String(i * 2).padStart(2,'0')}:00`);
  return hours.map((h) => ({
    time: h,
    High:   Math.floor(Math.random() * 5 + 1),
    Medium: Math.floor(Math.random() * 8 + 2),
    Low:    Math.floor(Math.random() * 6 + 3),
  }));
}

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

export function buildWeeklyData() {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  return days.map((d) => ({
    day:    d,
    High:   Math.floor(Math.random() * 10 + 6),
    Medium: Math.floor(Math.random() * 12 + 8),
  }));
}

// ── Real-data chart functions ─────────────────────────────────
export function snapshotFromDogs(dogs) {
  const now = new Date();
  return {
    time:   `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`,
    High:   dogs.filter((d) => d.risk === 'high').length,
    Medium: dogs.filter((d) => d.risk === 'medium').length,
    Low:    dogs.filter((d) => d.risk === 'low').length,
  };
}

export function seedBehaviorHistory(dogs) {
  const highNow = dogs.filter((d) => d.risk === 'high').length;
  const medNow  = dogs.filter((d) => d.risk === 'medium').length;
  const lowNow  = dogs.filter((d) => d.risk === 'low').length;
  const total   = dogs.length;
  const history = Array.from({ length: 11 }, (_, i) => {
    const past   = new Date(Date.now() - (11 - i) * 8000);
    const time   = `${String(past.getHours()).padStart(2,'0')}:${String(past.getMinutes()).padStart(2,'0')}`;
    const offset = Math.round(Math.sin((i / 11) * Math.PI) * 2);
    return {
      time,
      High:   Math.max(0, Math.min(total, highNow + offset)),
      Medium: Math.max(0, Math.min(total, medNow  - offset)),
      Low:    Math.max(0, Math.min(total, lowNow  + (offset > 0 ? 0 : 1))),
    };
  });
  return [...history, snapshotFromDogs(dogs)];
}

export function deriveWeeklyData(dogs) {
  const days  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const TOTAL = dogs.length || 10;
  return days.map((day) => {
    let high = 0, medium = 0, low = 0;
    dogs.forEach(dog => {
      if (dog.r >= 70) high++;
      else if (dog.r >= 40) medium++;
      else low++;
    });
    const variation = Math.floor((Math.random() - 0.5) * 3);
    high   = Math.max(1, high   + variation);
    medium = Math.max(1, medium + variation);
    low    = Math.max(1, low    - variation);
    if (day === 'Fri' || day === 'Sat') { high += 1; medium += 1; }
    if (day === 'Sun') { high = Math.max(1, high - 1); low += 1; }
    let total = high + medium + low;
    while (total > TOTAL) { if (low > 1) low--; else if (medium > 1) medium--; else if (high > 1) high--; total--; }
    while (total < TOTAL) { low++; total++; }
    return { day, High: high, Medium: medium, Low: low };
  });
}

export function deriveActivityData(dogs) {
  const COLOR_MAP = {
    Resting:     '#00e676',
    Walking:     '#00b8d9',
    Running:     '#ffd740',
    Aggressive:  '#ff3d3d',
    Sniffing:    '#ff6d00',
    Threatening: '#9c27b0',
    Lying:       '#4a6272',
  };
  const counts = {};
  dogs.forEach((d) => { counts[d.activity] = (counts[d.activity] ?? 0) + 1; });
  return Object.entries(counts).map(([name, value]) => ({
    name, value, color: COLOR_MAP[name] ?? '#4a6272',
  }));
}

export function buildRHistory(baseR, risk = 'high') {
  const startMap = {
    high:   Math.max(20, baseR - 50 - Math.random() * 15),
    medium: Math.max(15, baseR - 20 - Math.random() * 10),
    low:    Math.max(5,  baseR - 8  - Math.random() * 8),
  };
  const startR = startMap[risk] ?? startMap.medium;
  const points = [];
  let current  = startR;
  for (let i = 0; i < 12; i++) {
    const progress = i / 11;
    const target   = startR + (baseR - startR) * progress;
    const noise    = (Math.random() - 0.5) * 10;
    const spike    = Math.random() < 0.15 ? (Math.random() - 0.3) * 22 : 0;
    current = current * 0.45 + target * 0.55 + noise + spike;
    current = Math.max(5, Math.min(99, Math.round(current)));
    points.push(current);
  }
  points[11] = baseR;
  return points;
}

export function buildIncidentHistory(dogRisk = 'high', currentR = 80) {
  const TEMPLATES = {
    high: [
      { behavior: 'Aggressive',  rMin: 72, rMax: 95, actions: ['Shock Triggered', 'Dispatched', 'Alert Sent'] },
      { behavior: 'Threatening', rMin: 70, rMax: 90, actions: ['Alert Sent', 'Dispatched', 'Shock Triggered'] },
      { behavior: 'Running',     rMin: 68, rMax: 88, actions: ['Alert Sent', 'Dispatched', 'Monitored'] },
      { behavior: 'Running',     rMin: 65, rMax: 85, actions: ['Monitored', 'Alert Sent'] },
    ],
    medium: [
      { behavior: 'Walking',     rMin: 42, rMax: 65, actions: ['Monitored', 'Alert Sent'] },
      { behavior: 'Running',     rMin: 50, rMax: 68, actions: ['Monitored', 'Alert Sent', 'Dispatched'] },
      { behavior: 'Sniffing',    rMin: 40, rMax: 60, actions: ['Monitored'] },
      { behavior: 'Walking',     rMin: 45, rMax: 62, actions: ['Monitored', 'Resolved'] },
    ],
    low: [
      { behavior: 'Resting',     rMin: 10, rMax: 35, actions: ['Monitored', 'Resolved'] },
      { behavior: 'Lying',       rMin: 8,  rMax: 30, actions: ['Monitored'] },
      { behavior: 'Walking',     rMin: 15, rMax: 38, actions: ['Monitored', 'Resolved'] },
      { behavior: 'Sniffing',    rMin: 12, rMax: 32, actions: ['Monitored'] },
    ],
  };

  const pool    = TEMPLATES[dogRisk] ?? TEMPLATES.medium;
  const results = [];
  let minutesAgo = 0;

  for (let i = 0; i < 6; i++) {
    minutesAgo += Math.floor(15 + Math.random() * 35);
    const past     = new Date(Date.now() - minutesAgo * 60000);
    const time     = `${String(past.getHours()).padStart(2,'0')}:${String(past.getMinutes()).padStart(2,'0')}`;
    const tmpl     = pool[Math.floor(Math.random() * pool.length)];
    const rval     = Math.floor(tmpl.rMin + Math.random() * (tmpl.rMax - tmpl.rMin));
    const isActive = tmpl.behavior === 'Aggressive' || tmpl.behavior === 'Threatening';
    const duration = isActive
      ? Math.floor(1  + Math.random() * 8)  + ' min'
      : Math.floor(5  + Math.random() * 25) + ' min';
    const action   = rval >= 75
      ? ['Shock Triggered', 'Dispatched', 'Alert Sent'][Math.floor(Math.random() * 3)]
      : tmpl.actions[Math.floor(Math.random() * tmpl.actions.length)];

    results.push({ time, behavior: tmpl.behavior, rval, duration, action });
  }

  return results;
}