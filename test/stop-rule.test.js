import test from 'node:test';
import assert from 'node:assert/strict';
import { alarmAt, PEAK_RATE, STOP_GAP, BACKUP_AT } from '../popcorn.js';

const steady = (from, to, gap) => Array.from({ length: Math.floor((to - from) / gap) }, (_, i) => from + i * gap);

const sparse = steady(50, 80, STOP_GAP * 2);
const peak = steady(80, 110, 1 / (PEAK_RATE * 2));
const slowing = [0.6, 0.9, 1.2, 1.4].reduce((pops, gap) => [...pops, pops.at(-1) + gap], [110]);
const lastBeforeGap = slowing.at(-1);
const bag = [...sparse, ...peak, ...slowing, lastBeforeGap + STOP_GAP + 1, lastBeforeGap + STOP_GAP + 1.5];

test('no alarm on the sparse pops at the start', () => {
  assert.equal(alarmAt(sparse), BACKUP_AT);
});

test('while popping goes on after the peak, the alarm stays a gap after the last pop', () => {
  assert.equal(alarmAt([...sparse, ...peak]), peak.at(-1) + STOP_GAP);
});

test('alarm on the first gap over STOP_GAP after the peak', () => {
  assert.equal(alarmAt(bag), lastBeforeGap + STOP_GAP);
});

test('backup alarm when no pops are heard', () => {
  assert.equal(alarmAt([]), BACKUP_AT);
});

test('backup alarm when popping never reaches the peak', () => {
  assert.equal(alarmAt(steady(30, 300, 1)), BACKUP_AT);
});

test('backup alarm when popping goes on past it', () => {
  assert.equal(alarmAt([...sparse, ...steady(80, 300, 1 / (PEAK_RATE * 2))]), BACKUP_AT);
});
