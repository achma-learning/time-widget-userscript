# time-widget-userscript
# 🏝️ Time Island — Userscript v4.7.4

> A floating island widget + sidebar dashboard for every website. Prayer times, weather, calendar, life tracker, and more — designed for Moroccan users with full Arabic/RTL support.

---

## ✨ What's New in v4.7.4

### 📐 Auto-Scale by Screen Width
Island size now defaults to **Auto** — picks Small on laptops (≤1366px), Medium on typical desktops (≤1680px), and Large on wide screens. Manual override still available in Settings.

### 🌗 OS Light/Dark Theme
Detects `prefers-color-scheme` at startup. Dark OS → existing deep-glass style. Light OS → warm white background with dark text, no configuration needed.

### 🔍 Command Palette
Press **Alt+Ctrl+Space** to open a floating search palette. Type to fuzzy-search across all 40 cities, setting toggles, and quick links. Arrow keys navigate, Enter picks, Escape dismisses.

### 📡 Weather Reconnect
Weather automatically re-fetches when the browser regains network connectivity (`window online` event).

---

## ✨ What's New in v4.7.3

### ⏱️ Prayer Glow Duration
The animated border glow at prayer time now has a **duration timeout**: choose **Short (3s)**, **Normal (8s, default)**, or **Long (42s)**. After the chosen duration the glow stops, and won't re-trigger until the next prayer — independent from the existing Glow Speed setting.

---

## 🏝️ Floating Island

A draggable pill-shaped bar at the top of every page:

| Section | Content | Hover Popup |
|---------|---------|-------------|
| 🕐 Clock | 12h time with seconds + AM/PM | Google Calendar link |
| 📅 Date | English date (Wednesday, April 1) | Monthly calendar with navigation |
| 🌙 Hijri | Hijri date (computed locally) | Hijri detail card |
| 🕌 Prayer | Next prayer countdown (bidi-safe) | Full prayer times grid |
| ⏳ Age | Live age (compact) | — |
| 🌤️ Weather | Temperature + condition emoji | Full weather popup |

**All sections can be individually shown/hidden** from Settings → Island Sections.

### Island Customization
- **Position**: Top Center / Top Left / Top Right / Bottom Center
- **Scale**: Auto (screen-width-based) / Small (0.82×) / Medium / Large (1.18×) / XL (1.38×)
- **Font Presets**: Default / Digital (Orbitron + Inter + Noto Sans Arabic + Rubik) / Papyrus
- **Background**: Default dark glass / Custom hex color / Fully transparent
- **Blur**: Adjustable 0–40px slider
- **OS Theme**: Automatically light or dark based on system preference
- **Emoji toggle**: Show/hide section icons
- **Lock position**: Prevent accidental drag
- **Auto-hide**: Windows-style — island slides off-screen, reappears when mouse approaches the edge
- **Prayer glow**: Animated border (white → purple → gold) for a configurable duration after each adhan, with independent speed and duration settings

---

## 📊 Sidebar Widgets

Toggle with **Alt+Ctrl** or the close button.

### 🕌 Prayer Times
- 35+ Moroccan cities with searchable combobox (Arabic/French/English input)
- AlAdhan API with Habous method (method=21)
- Hijri + Gregorian dates, active prayer highlighted in red
- Countdown to next prayer (bidi-safe RTL formatting)

### 🌤️ Weather
- Synced with selected prayer city
- Temperature, description, humidity, wind, feels-like
- Weather icons mapped to wttr.in conditions
- Rain alert emoji (🌧️❗) on island when rain detected
- Auto-refresh every 30 minutes; instant refresh on network reconnect

### 📅 Calendar
- Monthly view with today highlighted
- Previous/next month navigation

### 🕐 Analog Clock
- SVG clock face with hour/minute/second hands
- Digital time display below

### ⱱ️ Stopwatch
- Start/stop/reset with centisecond precision

### 📝 Quick Notes
- Auto-saved textarea via GM_setValue

### ⏳ Life Calendar
- "Your Life in Weeks" grid (inspired by [Wait But Why](http://waitbutwhy.com/2014/05/life-weeks.html) and [Bryan Braun](https://github.com/bryanbraun/your-life))
- 52 columns × N rows (one row per year of life expectancy)
- Lived weeks in blue, current week in orange, future in dim
- Decade markers every 10 years
- Stats: current age, weeks lived, weeks left, % elapsed + progress bar
- Adjustable life expectancy (40–120 years)

### 💀 Live Age
- Real-time ticking counter: `22y 0m 15d / 14h 32m 07s`
- Total days alive
- Updates every second via `requestAnimationFrame`

### 🔗 Quick Links
- Editable bookmark pills — add name + URL, delete on hover
- Persisted via GM_setValue

---

## ⚙️ Settings

| Setting | Type | Default |
|---------|------|---------|
| Show Island | Toggle | On |
| Show Clock Widget | Toggle | On |
| Show Life Calendar | Toggle | On |
| Show Live Age | Toggle | On |
| Lock Island Position | Toggle | Off |
| Show Island Emojis | Toggle | On |
| Show Hover Popups | Toggle | On |
| Auto-Hide Island | Toggle | Off |
| Island Sections (×6) | Toggles | All On except Age |
| Island Position | Select | Top Center |
| Island Scale | Select | Auto |
| Font Preset | Select | Default |
| Prayer Glow Speed | Select | Normal (3s) |
| Prayer Glow Duration | Select | Normal (8s) |
| Blur | Range 0–40px | 24px |
| Background | Color picker / Hex / Default / Transparent | Default |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Alt + Ctrl` | Toggle sidebar |
| `Alt + T` | Toggle island visibility |
| `Alt + Ctrl + Space` | Open command palette (search cities, toggles, links) |

---

## 🔧 Technical Details

- **APIs**: AlAdhan (prayer times, method=21), wttr.in (weather), Google Fonts (on-demand)
- **Storage**: `GM_getValue` / `GM_setValue` — all settings persisted per-browser
- **Rendering**: `requestAnimationFrame` for clock/age ticks, minute-boundary prayer grid re-renders
- **Bidi**: Arabic prayer names wrapped in `unicode-bidi:isolate` spans to prevent RTL/LTR reordering
- **Compatibility**: Tampermonkey / Violentmonkey on all Chromium + Firefox browsers
- **Performance**: DOM refs cached at init, intervals paused on tab hide, no polling loops
- **Theme**: `prefers-color-scheme` read once at startup; light-mode `:root` override injected conditionally

---

## 📦 Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/)
2. Click the `.user.js` file — your script manager will prompt to install
3. Open any website — the island appears at the top, press `Alt+Ctrl` for the sidebar

---

## 📝 Changelog

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
