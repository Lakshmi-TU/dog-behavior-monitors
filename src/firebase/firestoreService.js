// src/firebase/firestoreService.js

// ✅ FIX: All imports at top — `setDoc` was previously mid-file (syntax error)
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  setDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { firestore } from './config';

// ── Helper: map Firestore doc → app dog object
function mapDog(docSnap) {
  const d = docSnap.data();
  return {
    id:        docSnap.id,
    beltId:    d.beltId   || docSnap.id,
    name:      d.name     || 'Unknown',
    breed:     d.breed    || 'Mixed',
    emoji:     d.emoji    || '🐕',
    risk:      d.risk     || 'low',
    r:         d.r        || 0,
    activity:  d.activity || 'Resting',
    zone:      d.zone     || 'Unknown',
    batt:      d.batt     ?? 0,
    lat:       d.lat      ?? 10.0704,
    lng:       d.lng      ?? 76.3680,
    updatedAt: d.updatedAt || null,
  };
}

// ── Subscribe to dogs (real-time)
export function subscribeToDogs(callback) {
  try {
    const q = query(collection(firestore, 'dogs'), orderBy('name'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(mapDog));
    });
  } catch (err) {
    console.error('❌ subscribeToDogs error:', err);
    return () => {}; // always return a valid unsubscribe function
  }
}

// ── Subscribe to alerts (real-time, newest first)
export function subscribeToAlerts(callback) {
  try {
    const q = query(
      collection(firestore, 'alerts'),
      orderBy('time', 'desc'),
      limit(20)
    );
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  } catch (err) {
    console.error('❌ subscribeToAlerts error:', err);
    return () => {};
  }
}

// ── Push a new alert document
export async function pushAlert(alertData) {
  try {
    await addDoc(collection(firestore, 'alerts'), {
      ...alertData,
      time: serverTimestamp(),
    });
  } catch (err) {
    console.error('❌ pushAlert error:', err);
  }
}

// ── Update an existing dog document
export async function updateDog(docId, data) {
  try {
    await updateDoc(doc(firestore, 'dogs', docId), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('❌ updateDog error:', err);
  }
}

// ── Upsert dog by beltId (create or update via merge)
export async function pushDogReading(dogData) {
  try {
    await setDoc(
      doc(firestore, 'dogs', dogData.beltId),
      { ...dogData, updatedAt: serverTimestamp() },
      { merge: true }
    );
  } catch (err) {
    console.error('❌ pushDogReading error:', err);
  }
}
