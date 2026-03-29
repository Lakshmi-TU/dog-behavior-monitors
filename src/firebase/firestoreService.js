// ─────────────────────────────────────────────────────────────
// src/firebase/firestoreService.js
// All Firestore read/write operations live here.
// Components never import `db` directly — they use these helpers.
// ─────────────────────────────────────────────────────────────

import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from './config';

// ── Subscribe to real-time dogs collection ────────────────────
// callback receives the array of dog objects every time data changes.
export function subscribeToDogs(callback) {
  const q = query(collection(db, 'dogs'), orderBy('name'));
  return onSnapshot(q, (snap) => {
    const dogs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(dogs);
  });
}

// ── Subscribe to live alerts (newest first) ───────────────────
export function subscribeToAlerts(callback) {
  const q = query(collection(db, 'alerts'), orderBy('time', 'desc'), limit(20));
  return onSnapshot(q, (snap) => {
    const alerts = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(alerts);
  });
}

// ── Push a new alert document ─────────────────────────────────
export async function pushAlert(alertData) {
  await addDoc(collection(db, 'alerts'), {
    ...alertData,
    time: serverTimestamp(),
  });
}

// ── Update a single dog document ─────────────────────────────
export async function updateDog(docId, data) {
  await updateDoc(doc(db, 'dogs', docId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ── Push simulated dog reading ────────────────────────────────
export async function pushDogReading(dogData) {
  await addDoc(collection(db, 'dogs'), {
    ...dogData,
    createdAt: serverTimestamp(),
  });
}

/*
 ─────────────────────────────────────────────────────────────
  FIRESTORE SAMPLE DATA STRUCTURE
 ─────────────────────────────────────────────────────────────

  Collection: dogs/{dogId}
  ─────────────────────────
  {
    beltId:    "BLT-001",          // string
    name:      "Rusty",            // string
    breed:     "Mixed",            // string
    emoji:     "🐕",               // string
    risk:      "high",             // "high" | "medium" | "low"
    r:         87,                 // number 0-100 (aggression score)
    activity:  "Aggressive",       // string
    zone:      "Zone 3 – Market St",
    batt:      72,                 // number 0-100 (battery %)
    mapX:      28,                 // number 0-100 (% x on map)
    mapY:      32,                 // number 0-100 (% y on map)
    updatedAt: <Timestamp>
  }

  Collection: alerts/{alertId}
  ─────────────────────────────
  {
    level:   "high",               // "high" | "medium" | "info"
    icon:    "🔴",
    title:   "BLT-001 Rusty — High Aggression",
    msg:     "R-value spiked to 87.",
    time:    <Timestamp>
  }

  Collection: users/{userId}
  ────────────────────────────
  {
    name:  "Admin User",
    email: "admin@streetguard.io",
    role:  "admin"                 // "admin" | "operator" | "viewer"
  }
*/
