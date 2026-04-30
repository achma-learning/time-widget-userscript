## v4.7.7 — Hardening pass

### Settings cleanup
- Removed *Mode-Change Toast 🤲* and *Toast Duration* settings rows. The toast
  itself stays on with a sensible default; the surface area in the sidebar is
  back to essentials.

### Fixes / hardening
- **Security — `rel="noopener noreferrer"` on all external links.** Quick
  Links, the Habous monthly button, the Google Calendar popup button, and the
  Command Palette `window.open` now all opt out of `window.opener` access and
  referrer leakage.
- **SPA / iframe re-injection guard.** Bail out at startup if `#ti-island`
  or `#ti-sb` already exists, and skip cross-frame contexts (`window.top !==
  window.self`).
- **Weather city encoding.** Replaced `replace(/\s+/g,'+')` with
  `encodeURIComponent()` so accented Moroccan city names (Kénitra, Tétouan,
  Béni Mellal, Fès, Méknes, Laâyoune…) are URL-safe.
- **Command Palette closes on outside click.** Capture-phase document
  `mousedown` listener (registered on next tick to avoid swallowing the open
  event), removed on close.
- **Auto-scale follows window resize.** Debounced 150 ms `resize` handler
  re-evaluates `autoScale()` and only re-applies classes when the tier
  actually changes.

---

## v4.7.6 — Mode-Change Toast (#27)

A custom-duration message popup, anchored top-right, with prayer emoji 🤲 — fired
when the user changes mode via the existing shortcuts:

- `Alt+T` toggles the island → **Island shown** / **Island hidden**
- `Alt+Ctrl` toggles the sidebar → **Sidebar opened** / **Sidebar closed**
- `Alt+Ctrl+Space` opens the command palette → **Command Palette**

### Design (iOS Dynamic Island-inspired)
- Capsule pill with vibrant glass blur, hairline border, soft inner highlight.
- Spring inflate-in `cubic-bezier(.34,1.56,.64,1)` and quick deflate-out.
- Emoji bubble with radial accent + gentle pulse.
- Title + uppercase caption hierarchy (SF Pro stack).
- Tri-color progress bar (purple → cyan → green) counts down the duration
  visually so the user always knows how long the message will linger.

### Settings (Sidebar → ⚙️ Settings)
- **Mode-Change Toast 🤲** — enable / disable toggle.
- **Toast Duration** — `1s`, `3s`, `5s`, `15s`, or **Custom…**
- **Custom (sec)** — number input (1–600) revealed only when *Custom* is chosen,
  with a **Preview** button to feel the timing before committing.
