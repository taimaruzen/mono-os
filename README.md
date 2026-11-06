# MONO OS

MONO OS is a browser-based fictional operating system inspired by 1-bit retro computer interfaces. It runs as a static app with local persistence and can be served by Cloudflare Workers Static Assets.

## Included in 1.1

- Boot screen, desktop icons, clock, taskbar and context menu
- Draggable, resizable, minimizable and maximizable windows
- Responsive touch-friendly mobile layout
- File Manager with folders, text files, rename and delete
- Notepad with autosave and localStorage persistence
- Pixel Paint with pen, eraser, clear and PNG export
- Safe virtual Terminal commands without server command execution
- Calculator, Retro Browser, Snake/Mines demo Arcade and Settings
- Workers `/api/health` endpoint and static asset deployment config

## Local run

Use any static server from this directory, for example `python3 -m http.server 4173`, then open `http://localhost:4173`.

## Tests

`node --check app.js` validates JavaScript syntax. The application uses browser APIs, so feature checks should be run in a browser with the static server running.

## Cloudflare

Install Wrangler, authenticate locally with `wrangler login`, then run `wrangler deploy`. The current worker exposes only a health endpoint and intentionally does not enable user cloud storage until authentication and per-user data isolation are configured. Add D1 after choosing an auth provider and setting the database ID. Do not commit secrets.
