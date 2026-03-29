// ─────────────────────────────────────────────────────────────
// src/utils/alertSound.js
// Lightweight Web Audio API beep — no external audio files needed.
// ─────────────────────────────────────────────────────────────

let ctx = null;

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

/**
 * Play a short alert beep.
 * @param {'high'|'medium'|'info'} level
 */
export function playAlert(level = 'high') {
  try {
    const ac  = getCtx();
    const osc = ac.createOscillator();
    const env = ac.createGain();

    osc.connect(env);
    env.connect(ac.destination);

    // Pitch & wave shape based on severity
    if (level === 'high') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, ac.currentTime);
      osc.frequency.setValueAtTime(660, ac.currentTime + 0.1);
    } else if (level === 'medium') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(550, ac.currentTime);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ac.currentTime);
    }

    env.gain.setValueAtTime(0.15, ac.currentTime);
    env.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.3);

    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + 0.3);
  } catch (_) {
    // Silently fail if audio context is blocked by browser policy
  }
}
