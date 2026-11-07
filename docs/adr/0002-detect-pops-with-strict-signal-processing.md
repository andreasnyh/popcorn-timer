# 0002. Detect pops with signal processing, strict about what counts

Status: accepted, 2026-11-07

## Context

A pop is a short, wide-band click over the microwave's steady hum. The two ways to get it wrong fail differently:

- Missing real pops makes the gaps look longer, so the alarm comes early and leaves unpopped kernels.
- Counting kitchen noise as pops makes the gaps look shorter, so the alarm comes late and the bag burns.

Burning is the worse failure.

## Decision

Filter out the low-frequency hum, then count sudden energy spikes that rise well above a running noise level. When a sound is borderline, it is not a pop.

No machine-learning classifier unless the recordings show that voices or dishes keep fooling this.

Amended 2026-11-07: until the user records bags, test and tune against public microwave popcorn clips from Freesound (listed in the README). After that, tune the timing by trial on real bags, using the page's live pop count and gap. Record bags only if the trials keep getting the alarm wrong. From then on, the plan below applies.

The original plan, kept for when recordings are needed: tune and test the detector offline against 3–5 recorded bags plus one bag recorded with ordinary kitchen noise. For each recording the user stops the microwave as they normally would, then notes the number of unpopped kernels and any burnt smell. That stop time is what the stop alarm is scored against. The phone sits where it really would, on the counter by the door, and one bag is recorded with the phone on top of the microwave to compare.

## Consequences

Small, needs no model, and runs in a browser or an app alike. Errors lean towards an early alarm. The Freesound clips come from other microwaves and phones, and nobody noted when to stop. They can show that pops are found and that the alarm fires in the tail of the popping, but not that it fires at the right moment. That part costs a real bag per attempt.

Prior art for comparison: Popcorn Detector (https://popcorn-detector.pages.dev) uses a pop-rate rule; Popcorn Expert uses a TensorFlow model.
