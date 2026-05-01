// src/App.jsx
//
// Fix: DogModal no longer receives `onTriggerShock` prop — it was removed
// from the component signature (it read from context directly instead).

import { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';

import Sidebar        from './components/Sidebar';
import Dashboard      from './pages/Dashboard';
import DogModal       from './components/DogModal';
import ShockConfirm   from './components/ShockConfirm';
import ToastContainer from './components/ToastContainer';

import useLiveData from './hooks/useLiveData';

function AppInner() {
  const data = useLiveData();
  const { addToast } = useApp();

  useEffect(() => {
    const t1 = setTimeout(() => addToast('✓ System connected. 14 belts online.', 'success'), 800);
    const t2 = setTimeout(() => addToast('⚡ 3 high-risk dogs require attention.', 'error'), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (data.loading) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: '#07090d' }}>
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">🐾</div>
          <p className="font-heading text-white text-xl font-bold tracking-widest">StreetGuard</p>
          <p className="font-mono-sg text-[11px] tracking-[3px] mt-2 uppercase" style={{ color: '#4a6272' }}>
            Initialising systems…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#07090d' }}>
      <Sidebar />
      <Dashboard data={data} />

      {/* ✅ DogModal needs no props — reads context directly */}
      <DogModal />
      <ShockConfirm onConfirm={data.triggerShock} />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
