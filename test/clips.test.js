// The loose check of ADR 0005 against the Freesound clips in recordings/freesound/ (README).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createDetector, alarmAt } from '../popcorn.js';

const SAMPLE_RATE = 48000;
const MIN_POPS = 50;
const PEAK_SPAN = 10; // s, the busiest stretch of popping counts as the peak
// Seconds into each clip where the microwave starts and stops, read off the hum. Start is pressed as it starts.
const CLIPS = { 58850: [14, 101], 344623: [62, 215], 395598: [0, 137], 426873: [11, 147] };

const clock = (s) => `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, '0')}`;
const popsIn = (pops, from, to) => pops.filter((t) => t > from && t <= to).length;

for (const [id, [on, off]] of Object.entries(CLIPS)) {
  const file = new URL(`../recordings/freesound/${id}.f32`, import.meta.url);
  test(`clip ${id}`, { skip: !fs.existsSync(file) && 'not downloaded' }, (t) => {
    const raw = fs.readFileSync(file);
    const samples = new Float32Array(raw.buffer, raw.byteOffset, raw.length / 4).subarray(on * SAMPLE_RATE, off * SAMPLE_RATE);
    const pops = [];
    createDetector(SAMPLE_RATE, (p) => pops.push(p))(samples);
    const at = alarmAt(pops);
    const busiest = Math.max(...pops.map((p) => popsIn(pops, p - PEAK_SPAN, p)));
    const peakEnd = pops.find((p) => popsIn(pops, p - PEAK_SPAN, p) === busiest);
    const share = popsIn(pops, at - PEAK_SPAN, at) / busiest;
    t.diagnostic(`${pops.length} pops, peak ending ${clock(on + peakEnd)}, alarm ${clock(at)} after Start (${clock(on + at)} in the clip, microwave off ${clock(off)}), pop rate at alarm ${Math.round(share * 100)}% of peak`);

    assert.ok(pops.length >= MIN_POPS, 'pops found');
    assert.ok(at > peakEnd, 'alarm after the peak');
    assert.ok(at <= off - on, 'alarm in the tail, before the microwave went off');
  });
}
