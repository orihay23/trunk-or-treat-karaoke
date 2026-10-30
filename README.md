# 🎃 Trunk or Treat Karaoke 🎤

A touch-friendly, offline-capable web app for trunk-or-treat karaoke. Four big
tiles — **BTS**, **KPop Demon Hunters**, **Classics**, **Kid Favorites** — each
open a list of 10 songs that jump to YouTube karaoke videos.

## Use it
Hosted with GitHub Pages: https://orihay23.github.io/trunk-or-treat-karaoke/

Open it once while online on the karaoke device, then **Add to Home Screen**.
After that the app opens with no connection (the YouTube videos themselves
still need Wi-Fi or data).

## Editing songs
Songs live in the `CATEGORIES` list near the top of the script in
`index.html`. Each song links to a YouTube search for
`<title> <artist> karaoke`; add `id: "VIDEO_ID"` to a song to link one exact
video instead.

After editing any file, bump `VERSION` in `sw.js` so installed copies pick up
the change.

## Run locally
```sh
python3 -m http.server 8000
```
then open http://localhost:8000 (the offline service worker only runs over
http/https, not `file://`).
