// src/context/AppContext.jsx
import { createContext, useContext, useState, useCallback, useRef } from 'react';

const AppContext = createContext(null);
let toastId = 0;

export function AppProvider({ children }) {
  const [toasts,      setToasts]      = useState([]);
  const [selectedDog, setSelectedDog] = useState(null);
  const [shockDog,    setShockDog]    = useState(undefined);
  const [focusDog,    setFocusDog]    = useState(null);
  const [shockActive, setShockActive] = useState(null);

  // ✅ NEW — track path
  const [trackedDog,   setTrackedDog]   = useState(null);   // dog object being tracked
  const [pathHistory,  setPathHistory]  = useState({});     // { dogId: [[lat,lng], ...] }

  const addToast = useCallback((msg, type = 'success') => {
    const id = ++toastId;
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const removeToast   = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const openDogModal  = useCallback((dog) => setSelectedDog(dog), []);
  const closeDogModal = useCallback(() => setSelectedDog(null), []);
  const openShock     = useCallback((dog) => setShockDog(dog ?? null), []);
  const closeShock    = useCallback(() => setShockDog(undefined), []);
  const focusOnDog    = useCallback((dog) => setFocusDog(dog), []);
  const triggerShockEffect = useCallback((dog) => {
    setShockActive(dog.id);
    setTimeout(() => setShockActive(null), 3000);
  }, []);

  // ✅ start/stop tracking
  const startTracking = useCallback((dog) => {
    setTrackedDog(dog);
    // seed with current position
    setPathHistory((prev) => ({
      ...prev,
      [dog.id]: dog.lat && dog.lng ? [[dog.lat, dog.lng]] : [],
    }));
  }, []);

  const stopTracking = useCallback(() => {
    setTrackedDog(null);
  }, []);

  // ✅ called by useLiveData on every tick to append new position
  const appendPath = useCallback((dogId, lat, lng) => {
    if (!lat || !lng) return;
    setPathHistory((prev) => {
      const existing = prev[dogId] ?? [];
      const last = existing[existing.length - 1];
      // skip if position unchanged
      if (last && last[0] === lat && last[1] === lng) return prev;
      const updated = [...existing, [lat, lng]];
      // keep last 60 points (~8 min of history at 8s tick)
      return { ...prev, [dogId]: updated.slice(-60) };
    });
  }, []);

  return (
    <AppContext.Provider value={{
      toasts, addToast, removeToast,
      selectedDog, openDogModal, closeDogModal,
      shockDog, openShock, closeShock,
      focusDog, shockActive, focusOnDog, triggerShockEffect,
      // ✅ path tracking
      trackedDog, pathHistory, startTracking, stopTracking, appendPath,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}