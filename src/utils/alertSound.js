// ─────────────────────────────────────────────────────────────
// src/utils/alertSound.js
//
// Chrome blocks AudioContext until a user gesture (click/key/touch).
// Strategy:
//   - Track whether a gesture has happened with `userHasInteracted`
//   - Only create + resume AudioContext AFTER that flag is true
//   - If playAlert() is called before any gesture, silently do nothing
//   - No warnings, no errors, no crashes
// ─────────────────────────────────────────────────────────────

let ctx               = null;
let userHasInteracted = false;

// ── Mark gesture and unlock audio ────────────────────────────
function onUserGesture() {
  userHasInteracted = true;

  // If context was already created, resume it now
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
}

// Register once on each gesture type — removed automatically after firing
document.addEventListener('click',    onUserGesture, { once: true });
document.addEventListener('keydown',  onUserGesture, { once: true });
document.addEventListener('touchend', onUserGesture, { once: true });

// ── Lazy AudioContext getter ──────────────────────────────────
// Only called after userHasInteracted is true, so Chrome never
// sees a context created outside a user gesture.
function getCtx() {
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (_) {
      return null;
    }
  }
  return ctx;
}

// ── Public API ───────────────────────────────────────────────
/**
 * Play a short beep. Completely silent (no warning, no error) if
 * the user has not yet interacted with the page.
 *
 * @param {'high'|'medium'|'info'} level
 */
export function playAlert(level = 'high') {
  // Hard gate — if no user gesture yet, do absolutely nothing.
  // This prevents Chrome from logging the autoplay warning.
  if (!userHasInteracted) return;

  try {
    const ac = getCtx();
    if (!ac) return;

    // Resume if somehow still suspended, then schedule the beep
    const play = () => {
      if (ac.state !== 'running') return;

      const osc = ac.createOscillator();
      const env = ac.createGain();

      osc.connect(env);
      env.connect(ac.destination);

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
    };

    if (ac.state === 'suspended') {
      ac.resume().then(play).catch(() => {});
    } else {
      play();
    }

  } catch (_) {
    // Never crash the app over a beep
  }
}