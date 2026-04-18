# 🏟️ Smart Event Companion

> A premium, mobile-first React + Vite companion app for large-venue attendees — combining a unified QR wallet, live crowd heatmaps, AI-powered route guidance, virtual queue management, group coordination, emergency alerts, and sustainability rewards in one seamless glassmorphism interface.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)
- [Pages & Modules](#-pages--modules)
- [Core Utilities](#-core-utilities)
- [Data Model](#-data-model)
- [Accessibility](#-accessibility)
- [Testing](#-testing)
- [Code Quality](#-code-quality)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

Smart Event Companion solves the biggest pain points attendees face at large events: crowded exits, long queues, lost friends, missed notifications, and slow payments. The app provides real-time crowd telemetry, intelligent routing, and a unified QR wallet — all running live in the browser with simulated backend data updating every 4.2 seconds.

Built for the **HACK2H** hackathon under the Google Ecosystem Integration track.

---

## ✨ Features

### 💳 Unified QR Wallet
- Single QR code covers **entry, food, merchandise, and transport** payments
- Wallet top-up via UPI, card, or Google Pay (planned)
- Transport pass purchasing (Metro Express, Shuttle, Cab priority)
- Full transaction history with credit/debit/scan activity log
- Eco reward points for sustainable actions (recycling, digital receipts, metro exits)

### 🗺️ Live Crowd Heatmap
- Simulated real-time crowd density across 8 venue zones
- Density-tone classification: `clear` → `steady` → `busy` → `critical`
- Visual heatmap overlay with animated zone markers
- Risk score tracking to identify dangerous choke points
- Check-in count per zone with live delta updates

### 🤖 AI Route Guidance
- Congestion-aware route recommendations for any destination (seat, restroom, exit)
- Two priority modes: **balanced** (fastest) and **safety** (lowest risk)
- Confidence scoring and live ETA calculation
- Emergency rerouting mode when exit zones exceed 88% density

### ⏳ Virtual Queue Management
- Book queue slots for Food, Merch, and Restroom stations without physically waiting
- AI-predicted wait times incorporating zone density + counter load
- Queue token system (e.g. `F-112`, `M-208`) with slot time
- Near-turn push alerts (≤5 minutes predicted wait)
- Sustainability bonuses per queue (e.g. "+35 pts for reusable cup")

### 📍 Friend Locator
- Live positional tracking of friends across the venue map
- Meetup route recommendation with current friend status
- Friend status updates (At seat, Getting snacks, Near restroom)

### 🔔 Smart Alerts & Notifications
- Persistent alert rail with deferred rendering for performance
- Three severity tones: `info`, `warning`, `urgent`
- Auto-generated alerts from crowd surges, queue readiness, and timeline events
- **Voice alerts** via Web Speech API for urgent emergency messages
- Maximum 7 alerts displayed (FIFO with deduplication)

### 🌱 Sustainability & Rewards
- Eco reward points system for green actions
- Curated AI recommendations personalized to user preferences (food, merch, transport)
- Sustainability label on every recommendation item

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18.3 with Concurrent Features (`startTransition`, `useDeferredValue`) |
| Build Tool | Vite 5.4 |
| Routing | React Router DOM 7 |
| Styling | Vanilla CSS with CSS Custom Properties (design tokens) |
| Code Quality | ESLint + Prettier |
| Testing | Jest + React Testing Library + Babel |
| Font System | Inter (body) + Outfit (headings) via Google Fonts |
| State Management | React Context API + `useState`/`useEffect`/`useRef` |
| Accessibility | Web Speech API, ARIA labels, high-contrast and large-text modes |

---

## 📁 Project Structure

```
smart-event-companion/
├── public/
├── src/
│   ├── components/
│   │   ├── Dashboard/          # Financial dashboard widgets
│   │   │   ├── BalanceTrendChart.jsx
│   │   │   ├── SpendingBreakdownChart.jsx
│   │   │   └── SummaryCard.jsx
│   │   ├── Event/              # Core event feature panels
│   │   │   ├── CoordinationPanel.jsx   # Route + friend locator
│   │   │   ├── CrowdFlowPanel.jsx      # Heatmap visualization
│   │   │   ├── EngagementPanel.jsx     # Rewards + recommendations
│   │   │   ├── HeroBanner.jsx          # Event countdown banner
│   │   │   ├── NotificationRail.jsx    # Alert feed
│   │   │   ├── QueuePanel.jsx          # Virtual queue cards
│   │   │   └── WalletPanel.jsx         # QR wallet + passes
│   │   ├── Insights/
│   │   │   └── InsightsPanel.jsx
│   │   ├── Transactions/
│   │   │   ├── FilterBar.jsx
│   │   │   ├── TransactionForm.jsx
│   │   │   └── TransactionTable.jsx
│   │   ├── Navigation.jsx      # Fixed bottom tab bar
│   │   └── RoleToggle.jsx
│   ├── context/
│   │   ├── EventContext.jsx    # Global event state + actions
│   │   └── AppContext.jsx      # App-wide settings context
│   ├── data/
│   │   └── eventData.js        # Static seed data & mock profiles
│   ├── pages/
│   │   ├── HomePage.jsx        # Dashboard + hero stats
│   │   ├── WalletPage.jsx      # QR Wallet page
│   │   ├── HeatmapPage.jsx     # Crowd heatmap page
│   │   ├── QueuePage.jsx       # Virtual queues page
│   │   ├── LocatorPage.jsx     # Group locator page
│   │   └── AlertsPage.jsx      # Alerts + rewards page
│   ├── utils/
│   │   ├── eventEngine.js      # Pure utility functions (AI logic)
│   │   └── dataHelpers.js      # Generic data transformers
│   ├── App.jsx                 # Root router + lazy loading
│   ├── main.jsx                # React DOM entry point
│   └── index.css               # Global design tokens + utility classes
├── tests/
│   └── eventEngine.test.js     # Jest unit tests for utilities
├── .eslintrc.cjs               # ESLint rules
├── .prettierrc                 # Prettier formatting config
├── babel.config.cjs            # Babel config for Jest
├── jest.config.cjs             # Jest test environment config
├── jest.setup.js               # Testing Library setup
├── vite.config.js              # Vite + React plugin
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/tamilamudhan182/HACK2H.git
cd HACK2H

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Visit **http://localhost:5173** in your browser.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR at `localhost:5173` |
| `npm run build` | Build the production bundle to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run the full Jest test suite |
| `npm run lint` | Lint all source files with ESLint |
| `npm run format` | Auto-format all source files with Prettier |

---

## 📱 Pages & Modules

### 🏠 Home (`/`)
The main dashboard showing:
- Personalized greeting with live route status
- Wallet balance, active queue count, and eco reward points at a glance
- Quick-access navigation tiles to all major features
- Departure suggestion (best transport mode based on live exit load)

### 💳 Wallet (`/wallet`)
- Unified QR token display for multi-channel payments
- Wallet balance and top-up options (UPI, Card, Google Pay)
- Active passes (entry, transport) with validity status
- Transaction history with credit/debit/scan classification
- Metro Express pass purchase (₹140 deducted from balance)
- Accessibility toggles: high contrast, large text, voice alerts

### 🗺️ Heatmap (`/heatmap`)
- SVG-based venue map with 8 interactive zones
- Color-coded density indicators (green → yellow → orange → red)
- Live check-in count and density percentage per zone
- Zone type classification: entry, circulation, service, seating, restroom, merch, exit

### ⏳ Queue (`/queue`)
- Virtual queue cards for Food, Merch, and Restroom
- Real-time predicted wait in minutes
- Join/leave queue with instant slot reservation
- Token number and scheduled slot time
- Sustainability bonus callout per queue station

### 📍 Locator (`/locator`)
- Friend position map with animated markers
- Friend selector with live status
- Meetup route recommendation with ETA
- Active destination switcher (seat / restroom / exit)

### 🔔 Alerts (`/alerts`)
- Live notification feed sorted by recency
- Severity-toned cards: info (white), warning (gold), urgent (red)
- Engagement panel with AI-personalized recommendations
- Sustainability action log to earn eco points

---

## 🧠 Core Utilities (`src/utils/eventEngine.js`)

All business logic is isolated as **pure functions** — fully testable with no DOM or React dependencies.

| Function | Description |
|---|---|
| `clamp(value, min, max)` | Bounds a number between min and max |
| `formatCurrency(value)` | Formats INR currency using `Intl.NumberFormat` |
| `buildQrToken({ userId, venueId, channel })` | Generates a deterministic QR token string |
| `getDensityTone(density)` | Returns `clear`/`steady`/`busy`/`critical` classification |
| `predictWaitMinutes(queue, zoneDensity)` | AI wait prediction factoring counters + congestion |
| `recommendRoute({ destination, zones, priority })` | Sorts zones by risk/density, builds advisory path |
| `buildAiAlert({ zoneName, density, alternateZone, emergency })` | Generates human-readable advisory text |
| `createWalletActivity(history, activity)` | Prepends new transaction, caps at 6 items |
| `selectRecommendations(catalog, preferences, limit)` | Scores catalog items by tag match with user preferences |
| `suggestDepartureOption(options, zones)` | Ranks transport options by exit load + travel time |

---

## 📊 Data Model

### Attendee Profile
```js
{
  id: "attendee-27",
  name: "Aarav Mehta",
  venueId: "stadium-neo",
  seatLabel: "Block A · Row 12 · Seat 08",
  groupName: "Weekend Crew",
  preferences: ["vegetarian", "spicy", "retro", "sustainable"]
}
```

### Zone (Heatmap)
```js
{
  id: "exit-c",
  label: "Exit Gate C",
  density: 38,        // 0–100 crowd density percentage
  checkIns: 74,       // cumulative check-ins
  type: "exit",       // entry | exit | seating | service | restroom | merch | circulation
  x: 82, y: 86,       // map position (percentage)
  riskScore: 22       // 0–100 risk classification
}
```

### Queue
```js
{
  id: "queue-food-1",
  label: "Spice Bowl Express",
  type: "Food",
  zoneId: "food-court",
  peopleAhead: 18,
  counters: 3,
  serviceMinutes: 2.1,
  slot: "17:28",
  sustainabilityBonus: "+35 pts for reusable cup",
  joined: true,
  token: "F-112"
}
```

### Alert
```js
{
  id: "alert-1",
  tone: "info",       // info | warning | urgent
  title: "Wallet ready",
  message: "Unified QR is active for entry, food, merch, and transport scans.",
  timestamp: "Now"
}
```

---

## ♿ Accessibility

The app includes built-in accessibility features toggled from the Wallet settings panel:

| Feature | Implementation |
|---|---|
| **High Contrast Mode** | CSS variable overrides via `.app-shell--high-contrast` class |
| **Large Text Mode** | Font scaling via `.app-shell--large-text` class |
| **Voice Alerts** | Web Speech API (`SpeechSynthesisUtterance`) reads urgent alerts aloud |
| **Focus States** | Native browser focus rings preserved across all interactive elements |
| **Semantic HTML** | `<nav>`, `<main>`, `<section>`, `<strong>` used throughout |

---

## 🧪 Testing

Tests are located in the `tests/` directory and use **Jest** with **React Testing Library**.

```bash
npm test
```

### Current Test Coverage (`tests/eventEngine.test.js`)

| Test | Status |
|---|---|
| `predictWaitMinutes` grows with crowd density | ✅ Pass |
| `recommendRoute` prioritizes lower-risk exits in safety mode | ✅ Pass |
| `buildAiAlert` escalates emergency messaging | ✅ Pass |
| Wallet activity prepends latest item | ✅ Pass |
| QR token generation is stable for identical payloads | ✅ Pass |
| Recommendations favor matching user preferences | ✅ Pass |

**Target coverage:** 80–90% across wallet, queue, alert, and routing logic.

---

## 🔧 Code Quality

| Tool | Purpose | Config File |
|---|---|---|
| **ESLint** | Linting React + hooks rules | `.eslintrc.cjs` |
| **Prettier** | Consistent code formatting | `.prettierrc` |
| **Babel** | JSX transpilation for Jest | `babel.config.cjs` |
| **Jest** | Unit test runner with jsdom | `jest.config.cjs` |

---

## 🗺️ Roadmap

### Planned (Phase 2)
- [ ] **Firebase Auth** — Replace mock attendee with real Google Sign-In
- [ ] **Firestore** — Real-time crowd and queue data via WebSocket listeners
- [ ] **Google Maps API** — Replace SVG map with interactive venue navigation
- [ ] **Google Pay Integration** — Native wallet top-up with GPay UPI
- [ ] **Google Cloud Run** — Deploy Node/Express backend with JWT + rate limiting

### Planned (Phase 3)
- [ ] ARIA labels on all interactive elements
- [ ] Keyboard navigation + skip links
- [ ] Lighthouse accessibility audit target ≥ 95
- [ ] CI/CD pipeline with GitHub Actions + automated test runs

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "feat: describe your change"`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please run `npm run lint` and `npm test` before submitting a PR.

---

## 📄 License

This project was built for the **HACK2H** hackathon. All rights reserved.

---

<div align="center">
  <strong>Built with ❤️ for HACK2H · Google Ecosystem Track</strong>
</div>
