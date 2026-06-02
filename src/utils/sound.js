let audioCtx = null;

function ensureAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  // Try to resume if suspended (browsers block autoplay until user gesture)
  try {
    if (audioCtx.state === 'suspended' && typeof audioCtx.resume === 'function') {
      audioCtx.resume().catch(() => {});
    }
  } catch (e) {
    // ignore
  }
}

export function playTone(freq = 440, type = 'sine', duration = 0.08, gain = 0.08) {
  try {
    ensureAudioCtx();
    const now = audioCtx.currentTime;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, now);
    g.gain.setValueAtTime(gain, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start(now);
    o.stop(now + duration + 0.02);
  } catch (err) {
    // silently ignore audio errors
  }
}

export function playSound(type) {
  // Map semantic names to tones
  switch (type) {
    case 'hover':
      playTone(880, 'sine', 0.03, 0.02);
      break;
    case 'click':
      playTone(660, 'square', 0.06, 0.06);
      break;
    case 'round-start':
      playTone(440, 'sine', 0.12, 0.08);
      break;
    case 'memory-reveal':
      playTone(520, 'sine', 0.12, 0.06);
      break;
    case 'success':
      playTone(880, 'sine', 0.18, 0.12);
      playTone(660, 'sine', 0.12, 0.08);
      break;
    case 'result':
    default:
      playTone(300, 'sine', 0.08, 0.05);
      break;
  }
}

export default playSound;