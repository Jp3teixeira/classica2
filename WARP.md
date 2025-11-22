# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project overview

This is a purely static website for the graphic studio **Clássica 2**. It simulates a minimal macOS-like desktop with a centered logotype and a dock at the bottom with three entries (Livros, Embalagens, Caixas). Clicking a dock item opens a corresponding modal with an image and short descriptive text.

There is no build pipeline, package manager, or backend. Development is done directly against the static assets.

Important information from `README.md`:
- To use or preview the site, open `index.html` in a modern browser.
- Main files: `index.html` (markup), `styles.css` (styling), `main.js` (interaction logic for modals).

## How to run and develop

### Run locally

- Open `index.html` directly in a browser, or
- Serve the folder with a simple static HTTP server, for example in PowerShell:
  - `pwsh`: `python -m http.server 8000` (from the repo directory, if Python is installed)

There are no npm/yarn/pnpm scripts or build steps.

### Testing and linting

- There is no test suite or lint configuration in this repo.
- If you introduce tests or tooling (e.g. Jest, ESLint, Prettier), document the commands in this file under a new section.

## High-level architecture and structure

### HTML structure (`index.html`)

- Root layout is a `main.desktop` container that fills the viewport and centers content.
- The company name is rendered as `.company-name`, absolutely positioned near the vertical center.
- A fixed `.dock` at the bottom contains three `.dock-item` buttons:
  - Each button has a `data-modal` attribute (`livros`, `embalagens`, `caixas`).
  - Each button shows an emoji icon and a label.
- Three corresponding modal sections exist:
  - `<section class="modal" id="modal-<key>">` with keys matching the `data-modal` values.
  - Each modal contains a `.modal-window` with:
    - `.modal-header` containing a title and a close button (`[data-close]`).
    - `.modal-body` with an image (`assets/*-placeholder.jpg`) and descriptive text.
- The modals are always present in the DOM; visibility is controlled via `aria-hidden` and CSS.

### Styling (`styles.css`)

- Defines a small design system via CSS custom properties (`:root`) for background, dock background, borders, text color, and shadow.
- The `.desktop` container uses flexbox to center content vertically and horizontally, with fixed-positioned elements for the name and dock.
- The `.dock` implements a macOS-like glassmorphism effect using:
  - Semi-transparent white background, border, box-shadow, and `backdrop-filter: blur(...)`.
- `.dock-item` buttons are unstyled button elements arranged vertically (icon + label) with a hover animation that lifts and scales the icon.
- `.modal` acts as a full-screen overlay:
  - Hidden by default via `opacity: 0` and `pointer-events: none`.
  - Becomes visible when `aria-hidden="false"` is set on the element.
- `.modal-window` defines a centered card with constrained width, rounded corners, border, and shadow.
- Responsive tweaks are defined under `@media (max-width: 600px)` to adjust font sizes and spacing on small screens.

### Interaction logic (`main.js`)

- On `DOMContentLoaded`, the script queries:
  - All `.dock-item` buttons.
  - All `.modal` sections.
- `openModal(key)`:
  - Looks up `#modal-${key}` by ID.
  - If found, sets `aria-hidden` to `"false"` to show it (CSS handles visibility).
- `closeModal(modal)`:
  - Sets `aria-hidden` back to `"true"`.
- Event wiring:
  - Each `.dock-item` listens for `click` and calls `openModal()` with its `data-modal` value.
  - Each `.modal` listens for `click` on the backdrop (when `event.target === modal`) to close on outside click.
  - Each `[data-close]` element inside the modal window closes its parent modal on click.
  - A global `keydown` listener closes all modals when `Escape` is pressed.

### Architectural considerations for future changes

- New dock items and modals:
  - Follow the existing pattern: add a new `.dock-item` with `data-modal="<key>"` and a `<section class="modal" id="modal-<key>">` block.
  - No JavaScript changes are needed as long as the `id` and `data-modal` remain consistent.
- Accessibility:
  - Modals use `aria-hidden` to indicate visibility; if you extend behavior, consider managing focus (e.g. trapping focus within visible modal and returning focus to the triggering dock item).
- Assets:
  - Modal images are currently placeholders under `assets/*.jpg`. If you add real artwork, keep file paths and alt text aligned with the modal content.

## Agent-specific notes

- This repo is intentionally minimal; do not assume the presence of Node, bundlers, or frameworks.
- When adding build tools or a more complex structure, update this file with:
  - How to install dependencies.
  - How to build, run, lint, and test.
  - Any non-obvious architectural conventions introduced (e.g. component folder layout, asset pipeline).