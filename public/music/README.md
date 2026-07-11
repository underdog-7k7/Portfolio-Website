# Jukebox music

1. Drop your `.mp3` files into this folder, e.g. `public/music/lofi-nights.mp3`.
2. List them in `src/data/music.json`:

```json
{
  "tracks": ["music/lofi-nights.mp3", "music/synthwave-drive.mp3"]
}
```

The jukebox in the living room picks them up automatically — play/pause,
next/prev, and shuffle all work off this list. Track names shown in the UI
come from the file names (dashes/underscores become spaces).
