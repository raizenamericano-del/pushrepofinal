/** Sound effects kecil via Web Audio API — tanpa file audio eksternal */

function ctx() {
  const AC = window.AudioContext || window.webkitAudioContext;
  return AC ? new AC() : null;
}

function tone(ac, freq, start, dur, type = "sine", gain = 0.12) {
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, ac.currentTime + start);
  g.gain.linearRampToValueAtTime(gain, ac.currentTime + start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + start + dur);
  o.connect(g).connect(ac.destination);
  o.start(ac.currentTime + start);
  o.stop(ac.currentTime + start + dur + 0.05);
}

/** Fanfare arpeggio saat build sukses 🎉 */
export function playSuccess() {
  try {
    const ac = ctx();
    if (!ac) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
    notes.forEach((f, i) => tone(ac, f, i * 0.09, 0.5, "triangle", 0.14));
    tone(ac, 1318.5, 0.36, 0.7, "sine", 0.1); // E6 sparkle
  } catch {}
}

/** Bunyi kecil saat error */
export function playError() {
  try {
    const ac = ctx();
    if (!ac) return;
    tone(ac, 220, 0, 0.25, "sawtooth", 0.07);
    tone(ac, 174, 0.16, 0.4, "sawtooth", 0.07);
  } catch {}
}
