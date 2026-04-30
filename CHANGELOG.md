# 📝 Changelog

### v4.7.6 — Mode-Change Toast (#27)

A custom-duration message popup, anchored top-right, with prayer emoji 🤲 — fired
when the user changes mode via the existing shortcuts:

- `Alt+T` toggles the island → **Island shown** / **Island hidden**
- `Alt+Ctrl` toggles the sidebar → **Sidebar opened** / **Sidebar closed**
- `Alt+Ctrl+Space` opens the command palette → **Command Palette**

#### Design (iOS Dynamic Island-inspired)
- Capsule pill with vibrant glass blur, hairline border, soft inner highlight.
- Spring inflate-in `cubic-bezier(.34,1.56,.64,1)` and quick deflate-out.
- Emoji bubble with radial accent + gentle pulse.
- Title + uppercase caption hierarchy (SF Pro stack).
- Tri-color progress bar (purple → cyan → green) counts down the duration
  visually so the user always knows how long the message will linger.

#### Settings (Sidebar → ⚙️ Settings)
- **Mode-Change Toast 🤲** — enable / disable toggle.
- **Toast Duration** — `1s`, `3s`, `5s`, `15s`, or **Custom…**
- **Custom (sec)** — number input (1–600) revealed only when *Custom* is chosen,
  with a **Preview** button to feel the timing before committing.

---

### v4.7.5
- ⚡ Replaced `requestAnimationFrame` clock loop with 1-second `setInterval`
- ⚡ Tick pauses on `visibilitychange` (tab hidden) and resumes instantly on return
- ⚡ Life-weeks grid migrated from DOM (~4,000+ nodes) to a single `<canvas>`
- 🧹 Removed obsolete `.ti-lc-grid` / `.ti-lc-wk` CSS

### v4.7.4
- ✨ Auto-scale island by screen width (`autoScale()`); `islandScale` defaults to `'auto'`
- ✨ OS light/dark theme detection via `prefers-color-scheme`
- ✨ Command palette (Alt+Ctrl+Space) — fuzzy search cities, settings, links
- ✨ Weather re-fetches automatically on network reconnect (`window online`)

### v4.7.3
- ✨ Prayer Glow Duration setting (3s / 8s / 42s) — glow auto-stops after chosen time, suppressed until next prayer
- 🔧 Glow suppression state (`glowSuppressed`, `lastGlowPrayer`) prevents re-trigger within same prayer window

### v4.5.0
- ✨ Live Age widget (sidebar + island section)
- ✨ Prayer glow speed selector (1s / 3s / 5s)
- 🔧 Glow uses inline `animationDuration` instead of hardcoded CSS

### v4.4.1
- ✨ Life Calendar widget (your life in weeks)
- 🔧 Compact grid (3px rows, no scroll)

### v4.3.1
- ✨ Auto-hide island (Windows-style)
- 🐛 Fixed Quick Links add button (ID collision)
- 🐛 Fixed `escHtml` quote escaping

### v4.3.0
- ✨ Island section toggles (show/hide clock, date, hijri, prayer)
- ✨ Editable Quick Links (add/remove, persisted)
- 🐛 Fixed drag stuck at small zoom
- ✨ Blur slider for transparent mode

### v4.2.2
- ✨ Prayer time border glow (animated white/purple/gold)

### v4.2.1
- ✨ Custom island background color (hex + picker + transparent)

### v4.2.0
- ✨ Emoji visibility toggle
- ✨ Prayer times hover popup on countdown
- ✨ Master "Show Hover Popups" toggle

### v4.1.0
- ✨ Lock island position
- ✨ Island scale (4 presets)
- ✨ Font presets (Default / Digital / Papyrus)
- 🐛 Fixed RTL bidi in prayer countdown

### v4.0.1
- 🐛 Fixed popup positioning when island is at bottom

### v4.0
- 🎉 Initial release
