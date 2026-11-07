import { createDetector } from './popcorn.js';

// Runs the detector on every mic sample and posts each pop's time on the AudioContext clock.
registerProcessor('pops', class extends AudioWorkletProcessor {
  push = createDetector(sampleRate, (t) => this.port.postMessage(this.startedAt + t));

  process([input]) {
    if (!input[0]) return true;
    this.startedAt ??= currentTime;
    this.push(input[0]);
    return true;
  }
});
