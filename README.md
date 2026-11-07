# Popcorn timer

A website that listens to microwave popcorn and says when to turn the microwave off: late enough that few kernels are left unpopped, early enough that nothing burns. The phone sits next to the microwave, and the screen stays awake while it listens.

Open https://andreasnyh.github.io/popcorn-timer/ in Safari or Chrome and keep the page in front for the whole bag. Start the microwave, press Start, and wait.

A pop is a short, wide-band click above the microwave's hum. The stop rule arms once the pop rate reaches about 3 pops/s over 10 s, then sounds the alarm on the first gap longer than about 1.5 s. A backup alarm sounds 4:00 after Start whatever the detector hears. See `CONTEXT.md` for the terms and `docs/adr/` for the decisions.

Tested against the clips below, not yet on a real bag.

## Run locally

    python3 -m http.server 8000 --bind 127.0.0.1

Open http://127.0.0.1:8000. Modules and the AudioWorklet don't load from `file://`.

## Tests

    node --test

The stop rule is tested with made-up pop times. The recording tests are a loose check against the Freesound clips below: pops are found, the alarm fires after the busiest 10 s, and it fires before the microwave goes off.

Clips are kept local in `recordings/` and never committed, so attribution isn't needed. Save each clip's HQ MP3 preview as `recordings/freesound/<id>.mp3`, then `ffmpeg -i <id>.mp3 -ac 1 -ar 48000 -f f32le <id>.f32`. `node --test` skips a clip that isn't there.

| Clip | Length | Licence |
| --- | --- | --- |
| https://freesound.org/people/harbat/sounds/344623/ | 3:48 | CC0 |
| https://freesound.org/people/JackAmadon/sounds/495928/ | 3:13 | CC BY |
| https://freesound.org/people/katfolker/sounds/426873/ | 2:33 | CC0 |
| https://freesound.org/people/BeeProductive/sounds/395598/ | 2:31 | CC0 |
| https://freesound.org/people/SRuelas/sounds/334488/ | 2:24 | CC BY |
| https://freesound.org/people/DreamArtSoundDesigners/sounds/702602/ | 2:23 | CC0 |
| https://freesound.org/people/morgantj/sounds/58850/ | 2:01 | CC BY |

Dropped, because the microwave goes off while popping is still at 70% or more of its peak, so there is no tail: 495928, 334488, 702602.
