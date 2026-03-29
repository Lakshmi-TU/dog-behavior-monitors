// ─────────────────────────────────────────────────────────────
// src/context/AppContext.jsx
// ─────────────────────────────────────────────────────────────

import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

let toastId = 0;

export function AppProvider({ children }) {

  // ✅ STATES (ALL INSIDE COMPONENT)
  const [toasts, setToasts] = useState([]);
  const [selectedDog, setSelectedDog] = useState(null);
  const [shockDog, setShockDog] = useState(undefined);

  const [focusDog, setFocusDog] = useState(null);        // 🔥 NEW
  const [shockActive, setShockActive] = useState(null);  // 🔥 NEW

  // ── Toast helpers ────────────────────────────────────────
  const addToast = useCallback((msg, type = 'success') => {
    const id = ++toastId;
    setToasts((t) => [...t, { id, msg, type }]);

    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  // ── Modal helpers ────────────────────────────────────────
  const openDogModal  = useCallback((dog) => setSelectedDog(dog), []);
  const closeDogModal = useCallback(() => setSelectedDog(null), []);
  const openShock     = useCallback((dog) => setShockDog(dog ?? null), []);
  const closeShock    = useCallback(() => setShockDog(undefined), []);

  // 🔥 NEW FEATURES
  const focusOnDog = (dog) => setFocusDog(dog);

  const triggerShockEffect = (dog) => {
    setShockActive(dog.id);
    setTimeout(() => setShockActive(null), 3000);
  };

  return (
    <AppContext.Provider value={{

      // existing
      toasts, addToast, removeToast,
      selectedDog, openDogModal, closeDogModal,
      shockDog, openShock, closeShock,

      // 🔥 NEW
      focusDog,
      shockActive,
      focusOnDog,
      triggerShockEffect,

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