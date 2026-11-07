# 0001. Stop on the first long gap after the peak

Status: accepted, 2026-11-07

## Context

Bags say to stop when popping slows. Pop Secret gives "about 1 to 2 seconds between pops" (https://popsecret.com/faq), and Conagra (Orville Redenbacher) about 1 second. The often-quoted "2–3 seconds" comes from secondary sources and risks a burnt bag.

The first pops are sparse too, so a plain gap rule would fire within the first half-minute. And if the mic can't hear the pops, no rule based on them fires at all.

## Decision

- Arm the stop rule once the pop rate has peaked at about 3 pops/s.
- Sound the stop alarm on the first gap after that longer than about 1.5 s.
- Sound a backup alarm 4:00 after Start, whatever the detector says.
- All three numbers are constants tuned on recordings, not user settings.

Rejected: alerting when the rate drops below a share of its peak, and fitting a curve to predict the stop. Both are harder to explain and to tune.

## Consequences

The rule is the one printed on the bag, so it is easy to explain. A bag that never reaches 3 pops/s (a small bag, a weak microwave) gets only the backup alarm. The recordings will show whether that happens.
