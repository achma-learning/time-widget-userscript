# time-widget-userscript
---
main version is this : https://github.com/achma-learning/time-widget-userscript/raw/refs/heads/main/time-island-v4.user.js
---
# 🏝️ Time Island — Userscript v4.5.0

> A floating island widget + sidebar dashboard for every website. Prayer times, weather, calendar, life tracker, and more — designed for Moroccan users with full Arabic/RTL support.

---

## ✨ What's New in v4.5.0

### 💀 Live Age Widget
Real-time age counter inspired by [Mortality](https://github.com/alphabt/mortality) — ticking every second, showing years, months, days, hours, minutes, and seconds since your birthday. Total days alive displayed below. Shares the birthday input with Life Calendar — set it once, both update.

### ⏳ Live Age on Floating Island
New toggleable island section (`⏳ Live Age` in Settings → Island Sections) displays a compact `22y 0m 15d` on the island bar.

### 🕌 Prayer Glow Speed Control
The animated white/purple/gold border glow during prayer time now has a speed selector: **Fast (1s)**, **Normal (3s, default)**, or **Slow (5s)**.

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

**All sections can be individually shown/hidden** from Settings → Island Sections.

### Island Customization
- **Position**: Top Center / Top Left / Top Right / Bottom Center
- **Scale**: Small (0.82×) / Medium / Large (1.18×) / XL (1.38×)
- **Font Presets**: Default / Digital (Orbitron + Inter + Noto Sans Arabic + Rubik) / Papyrus
- **Background**: Default dark glass / Custom hex color / Fully transparent
- **Blur**: Adjustable 0–40px slider
- **Emoji toggle**: Show/hide section icons
- **Lock position**: Prevent accidental drag
- **Auto-hide**: Windows-style — island slides off-screen, reappears when mouse approaches the edge
- **Prayer glow**: Animated border (white → purple → gold) for 15 minutes after each adhan

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

### 📅 Calendar
- Monthly view with today highlighted
- Previous/next month navigation

### 🕐 Analog Clock
- SVG clock face with hour/minute/second hands
- Digital time display below

### ⏱️ Stopwatch
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
| Island Sections (×5) | Toggles | All On except Age |
| Island Position | Select | Top Center |
| Island Scale | Select | Medium |
| Font Preset | Select | Default |
| Prayer Glow Speed | Select | Normal (3s) |
| Blur | Range 0–40px | 24px |
| Background | Color picker / Hex / Default / Transparent | Default |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Alt + Ctrl` | Toggle sidebar |
| `Alt + T` | Toggle island visibility |

---

## 🔧 Technical Details

- **APIs**: AlAdhan (prayer times, method=21), wttr.in (weather), Google Fonts (on-demand)
- **Storage**: `GM_getValue` / `GM_setValue` — all settings persisted per-browser
- **Rendering**: `requestAnimationFrame` for clock/age ticks, minute-boundary prayer grid re-renders
- **Bidi**: Arabic prayer names wrapped in `unicode-bidi:isolate` spans to prevent RTL/LTR reordering
- **Compatibility**: Tampermonkey / Violentmonkey on all Chromium + Firefox browsers
- **Performance**: DOM refs cached at init, observers only where needed, no polling loops

---

## 📦 Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/)
2. Click the `.user.js` file — your script manager will prompt to install
3. Open any website — the island appears at the top, press `Alt+Ctrl` for the sidebar

---

## 📝 Changelog

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
- 🐛 Fixed drag stuck at small zoom (#8)
- ✨ Blur slider for transparent mode (#9)

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
