# 0004. v1 is a single-screen website in the browser

Status: accepted, 2026-11-07

## Context

A personal, free project, shared with friends on both iPhone and Android. A mobile website can use the mic and keep the screen awake on both, as long as the page stays in front. A home-screen web app on iOS loses the mic when it goes to the background, and Safari tabs don't (https://bugs.webkit.org/show_bug.cgi?id=226620).

Before building, the user tries the existing Popcorn Detector (https://popcorn-detector.pages.dev) on one bag. It shows whether the phone hears pops through the door and whether a web page's alarm is loud enough.

## Decision

- A website opened in Safari or Chrome. Not installed to the home screen.
- The screen stays awake and the page stays in front for the whole session.
- One screen: a Start button, the live pop count and current gap, the stop alarm and the backup alarm.
- English strings only.
- Not in v1: accounts, history, settings, tuning per microwave, stovetop popcorn.

## Consequences

One codebase covers both platforms. If the iPhone alarm is too quiet even with the mic turned off (ADR 0003), move to an Expo app, which can keep listening with the screen locked and force the loudspeaker.
