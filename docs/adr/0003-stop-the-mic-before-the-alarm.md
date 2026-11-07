# 0003. Turn the mic off, then sound the alarm

Status: accepted, 2026-11-07

## Context

On iOS, while the mic is open, a web page's sound can get quieter or be routed to the earpiece. That was still reported on iOS 26.4 (https://bugs.webkit.org/show_bug.cgi?id=218012, https://bugs.webkit.org/show_bug.cgi?id=311451). iOS does not support vibration from a web page at all.

The user is assumed to be in the kitchen, within earshot of the phone.

## Decision

When the stop alarm or the backup alarm fires, stop the mic first, then play a loud alarm and flash the full screen. Vibrate where the phone supports it (Android). No notifications to a watch or another device.

## Consequences

Not yet verified: that stopping the mic brings iOS back to full volume. One test on a real iPhone settles it. If it fails, revisit the choice of platform, since a native app can force the loudspeaker.

Once the alarm has fired the app no longer listens, so the session ends there.
