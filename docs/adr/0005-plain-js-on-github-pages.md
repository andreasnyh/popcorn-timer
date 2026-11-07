# 0005. Plain JavaScript on GitHub Pages, tested against local recordings

Status: accepted, 2026-11-07

## Context

The app is one screen and one detector. Phones only allow the mic on HTTPS pages, and the laptop's local address isn't HTTPS. The recordings may contain people talking.

## Decision

- Plain HTML and JavaScript, with no framework, no TypeScript, no build step and no packages.
- The detector and the stop rule are plain functions in one module that runs in both the browser and Node: samples in, pops out, then pops in, alarm decision out.
- In the browser the mic feeds an AudioWorklet, which sees every sample. AnalyserNode can miss a pop that falls between two snapshots.
- The mic opens with `echoCancellation`, `noiseSuppression` and `autoGainControl` off, because those filters treat short clicks as noise.
- Tests use `node --test`. The stop rule is tested with made-up pop times.
- ffmpeg turns each recording into raw mono float samples. Until the user records bags, the recordings are the Freesound clips listed in the README. A clip passes if pops are found and the alarm fires after the peak, in the tail of the popping.
- Once the user's own recordings exist, a stop alarm passes if it fires no more than 5 s before the user's own stop and no more than 1 s after it. Both bounds are tuned on the recordings.
- `recordings/` is gitignored and its tests run only on the laptop. No CI.
- A public repo `andreasnyh/popcorn-timer`, with GitHub Pages serving `main`. Phone testing happens on the live Pages address.

## Consequences

There is nothing to install or build. A push is all it takes to test on the phone, so every phone test goes through a public deploy. Nobody else can run the recording tests.
