import { ref, onValue, off } from "firebase/database";
import { db } from "./config";

export function subscribeToLiveDog(callback) {
  const dogRef = ref(db, "current");

  const unsubscribe = onValue(dogRef, (snapshot) => {
    if (!snapshot.exists()) {
      console.warn("⚠️ No live dog data");
      return;
    }

    const data = snapshot.val();

    callback({
      id: data.id || "unknown",
      name: data.name || "Dog",
      lat: data.lat ?? 10.0704,
      lng: data.lng ?? 76.3680,
      risk: data.risk || "low",
      r: data.heart_rate ?? 0,
      activity: data.activity || "Idle",
      batt: data.battery ?? 0,
    });
  });

  // ✅ cleanup function
  return () => off(dogRef, "value", unsubscribe);
}