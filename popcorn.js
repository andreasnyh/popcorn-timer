// Pop detector and stop rule (ADR 0001, 0002), shared by the page, worklet.js and the tests.

export const PEAK_RATE = 3; // pops/s that arms the stop rule
export const RATE_WINDOW = 10; // s the pop rate is counted over; shorter, and a chance cluster of early pops arms it
export const STOP_GAP = 1.5; // s without a pop, after the peak, that sounds the stop alarm
export const BACKUP_AT = 240; // s after Start

const HUM_CUTOFF = 1500; // Hz
const FRAME = 0.005; // s
const NOISE_WINDOW = 1; // s
const NOISE_PERCENTILE = 0.2;
const OVER_NOISE = 10; // energy ratio a pop rises above the noise level
const OVER_BEFORE = 10; // energy ratio a pop rises above 10 ms earlier, so a louder hum is not a pop
const REFRACTORY = 0.02; // s, so a pop straddling two frames counts once

// Returns push(samples): feed it consecutive blocks of mono samples and it calls
// onPop(t) for each pop, t in seconds since the first sample.
export function createDetector(sampleRate, onPop) {
  // Second-order Butterworth high-pass, RBJ cookbook.
  const w = (2 * Math.PI * HUM_CUTOFF) / sampleRate, alpha = Math.sin(w) / Math.SQRT2, cos = Math.cos(w);
  const b0 = (1 + cos) / 2 / (1 + alpha), b1 = -2 * b0, a1 = (-2 * cos) / (1 + alpha), a2 = (1 - alpha) / (1 + alpha);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;

  const frameLen = Math.round(FRAME * sampleRate);
  const history = new Float64Array(Math.round(NOISE_WINDOW / FRAME));
  const sorted = new Float64Array(history.length);
  let sum = 0, n = 0, frames = 0, lastPop = -Infinity;

  return function push(samples) {
    for (const x of samples) {
      const y = b0 * x + b1 * x1 + b0 * x2 - a1 * y1 - a2 * y2;
      x2 = x1; x1 = x; y2 = y1; y1 = y;
      sum += y * y;
      if (++n < frameLen) continue;

      const energy = sum / frameLen, t = (frames * frameLen) / sampleRate;
      sum = n = 0;
      if (frames >= history.length && t - lastPop >= REFRACTORY) {
        sorted.set(history);
        sorted.sort();
        const noise = sorted[Math.floor(NOISE_PERCENTILE * sorted.length)];
        const before = history[(frames - 2) % history.length];
        if (energy > OVER_NOISE * noise && energy > OVER_BEFORE * before) {
          lastPop = t;
          onPop(t);
        }
      }
      history[frames++ % history.length] = energy;
    }
  };
}

// When the alarm fires, in seconds since Start, given the pops heard so far (ascending).
// A pop arriving before then can still push it back, so the page asks again as pops come in.
export function alarmAt(pops) {
  const peakPops = Math.ceil(PEAK_RATE * RATE_WINDOW);
  for (let i = peakPops - 1; i < pops.length; i++) {
    if (pops[i] - pops[i - peakPops + 1] > RATE_WINDOW) continue;
    let last = i;
    while (last + 1 < pops.length && pops[last + 1] - pops[last] <= STOP_GAP) last++;
    return Math.min(pops[last] + STOP_GAP, BACKUP_AT);
  }
  return BACKUP_AT;
}
