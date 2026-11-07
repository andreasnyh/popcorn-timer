# Popcorn timer

A personal, free website. A phone next to the microwave listens to the popcorn and says when to turn the microwave off: late enough that few kernels are left unpopped, early enough that nothing burns.

Decisions live in `docs/adr/`.

## Glossary

**Pop**: one kernel bursting. Heard as a short, loud click across a wide band of frequencies. A sound counts as a pop only when it clearly is one (ADR 0002).

**Hum**: the steady sound of the running microwave (fan, magnetron, turntable). Filtered out before looking for pops.

**Session**: one bag, from pressing Start until the stop alarm, the backup alarm, or the user ending it.

**Pop rate**: pops per second over the last 10 seconds (ADR 0006).

**Peak**: the pop rate reaching about 3 pops/s. The stop rule is **armed** only after the peak, because the first pops are sparse too.

**Gap**: time since the last pop.

**Stop alarm**: the alert to turn the microwave off. Fires on the first gap longer than about 1.5 s after the peak (ADR 0001).

**Backup alarm**: a fixed alarm 4:00 after Start, whatever the detector thinks.
_Avoid_: calling the stop rule a timer. The backup alarm is the only part driven by the clock.

**Unpopped kernel**: a kernel still whole when the microwave stops. A few are the accepted cost of never burning a bag.

**Recording**: a real bag recorded on a phone next to the microwave, used to tune and test the detector and the stop rule.
