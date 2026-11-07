# 0006. Count the pop rate over 10 s, and the refractory at 20 ms

Status: accepted, 2026-11-07

## Context

The detector and stop rule started from ADR 0001's numbers: 3 pops/s arms the rule, a 1.5 s gap after the peak sounds the stop alarm, and 4:00 the backup. Tuning against the Freesound clips (ADR 0002, 0005) showed two problems with the first settings:

- With the rate counted over 2 s, chance clusters of early pops armed the rule, and clips 58850 and 395598 alarmed before their peak.
- With a 50 ms refractory, the mini bag (58850) never reached 3 pops/s, because neighbouring pops were merged into one.

## Decision

- Count the pop rate over 10 s instead of 2 s.
- Shorten the refractory from 50 ms to 20 ms.
- Leave 3 pops/s, 1.5 s and 4:00 unchanged.
- Score the clips with ADR 0005's loose check as written: pops are found, the alarm fires after the busiest 10 s, and it fires before the microwave goes off. A stronger condition, that the rate has fallen to half its peak by the alarm, was dropped because no setting met it with a 1.5 s gap.

## Consequences

Clips 58850, 344623, 395598 and 426873 all alarm after their peak and before the microwave stops. 58850 alarms at 73% of its peak rate, so its alarm comes early in the slowdown.

The mini bag only just reaches the arming rate. A smaller bag would get only the 4:00 alarm.

A 10 s window stretches the glossary's "last few seconds": 3 pops/s means 30 pops within 10 s.

The clips are from other microwaves and phones, so this shows that pops are found and that the alarm fires in the tail of the popping, not that it fires at the right moment. None of the page has run in a browser yet; that is step 6.
