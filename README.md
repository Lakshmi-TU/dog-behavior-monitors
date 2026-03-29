# 🐾 StreetGuard — React + Firebase Dashboard

> Dog Behavior Monitoring System — converted from plain HTML to a modern React + Vite + Tailwind CSS + Firebase stack.

---

## 📦 Folder Structure

```
streetguard/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.jsx          ← Top search bar, filter chips, live pill
│   │   ├── Sidebar.jsx         ← Navigation sidebar
│   │   ├── StatCard.jsx        ← KPI card with accent bar
│   │   ├── Charts.jsx          ← BehaviorChart, ActivityChart, WeeklyChart (Recharts)
│   │   ├── LiveTable.jsx       ← Dog card grid
│   │   ├── LiveMap.jsx         ← CSS city-block map with animated pins
│   │   ├── DangerAlert.jsx     ← Live alerts scrollable panel
│   │   ├── HistoryPanel.jsx    ← RValueMeter + BatteryStatus
│   │   ├── ControlPanel.jsx    ← Shock / Locate / Track / Dispatch buttons
│   │   ├── DogModal.jsx        ← Full dog profile modal with chart + history
│   │   ├── ShockConfirm.jsx    ← Confirmation dialog for shock trigger
│   │   └── ToastContainer.jsx  ← Bottom-right toast notifications
│   ├── pages/
│   │   └── Dashboard.jsx       ← Main page — assembles all panels
│   ├── hooks/
│   │   └── useLiveData.js      ← Central data hook (simulation or Firebase)
│   ├── context/
│   │   └── AppContext.jsx      ← Global context (toasts, modals)
│   ├── utils/
│   │   ├── simulator.js        ← INITIAL_DOGS, tick logic, chart data generators
│   │   └── alertSound.js       ← Web Audio API beep utility
│   ├── firebase/
│   │   ├── config.js           ← Firebase initialisation (add your credentials)
│   │   └── firestoreService.js ← Firestore helpers (subscribe, push, update)
│   ├── styles/
│   │   └── index.css           ← Tailwind directives + scrollbar styles
│   ├── App.jsx                 ← Root component
│   └── main.jsx                ← React entry point
├── tailwind.config.js
├── vite.config.js
├── postcss.config.js
└── package.json
```

---

## 🚀 Step-by-Step Setup

### 1. Prerequisites

Make sure you have **Node.js ≥ 18** and **npm** installed.

```bash
node -v   # should print v18.x.x or higher
npm -v
```

### 2. Install Dependencies

```bash
cd streetguard
npm install
```

This installs:
- `react`, `react-dom`
- `recharts` (charts)
- `firebase` (Firestore)
- `tailwindcss`, `vite`, `@vitejs/plugin-react` (tooling)

### 3. Run Without Firebase (Simulation Mode)

The app works out of the box with simulated live data — no Firebase needed.

```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

Every 8 seconds the dashboard ticks: R-values fluctuate, alerts fire, KPIs update — all live.

---

## 🔥 Firebase Setup (Optional — Real Data)

### 3a. Create a Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add Project** → give it a name → click through
3. In the left panel → **Build → Firestore Database**
4. Click **Create database** → choose **Start in test mode** → pick a region

### 3b. Get Your Config

1. Project Settings (gear icon) → **Your apps** → click **</>** (Web app)
2. Register the app
3. Copy the `firebaseConfig` object

### 3c. Add Your Config

Open `src/firebase/config.js` and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey:            "AIza...",
  authDomain:        "your-project.firebaseapp.com",
  projectId:         "your-project-id",
  storageBucket:     "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123:web:abc",
};
```

### 3d. Seed Firestore with Initial Data

In the Firebase console → **Firestore → Start collection**:

**Collection: `dogs`**  
Add a document with these fields:
```
beltId:   "BLT-001"
name:     "Rusty"
emoji:    "🐕"
breed:    "Mixed"
risk:     "high"
r:        87
activity: "Aggressive"
zone:     "Zone 3 – Market St"
batt:     72
mapX:     28
mapY:     32
```
Repeat for each dog (see `src/utils/simulator.js` → `INITIAL_DOGS` for all 14).

**Collection: `alerts`**  
```
level: "high"
icon:  "🔴"
title: "BLT-001 Rusty — High Aggression"
msg:   "R-value spiked to 87."
time:  <Timestamp — use serverTimestamp()>
```

### 3e. Switch to Real Firebase in the Hook

Open `src/hooks/useLiveData.js` and:

1. Uncomment the Firebase import at the top:
```js
import { subscribeToDogs, subscribeToAlerts, pushAlert } from '../firebase/firestoreService';
```

2. Replace the `useState(INITIAL_DOGS)` / `useState(INITIAL_ALERTS)` blocks with:
```js
useEffect(() => {
  const unsub1 = subscribeToDogs(setDogs);
  const unsub2 = subscribeToAlerts(setAlerts);
  setLoading(false);
  return () => { unsub1(); unsub2(); };
}, []);
```

---

## 🗄️ Firestore Data Structure

```
users/{userId}
  name:  string
  email: string
  role:  "admin" | "operator" | "viewer"

dogs/{dogId}
  beltId:    string        // "BLT-001"
  name:      string
  emoji:     string
  breed:     string
  risk:      "high" | "medium" | "low"
  r:         number        // 0-100 aggression score
  activity:  string
  zone:      string
  batt:      number        // 0-100 battery %
  mapX:      number        // 0-100 map position
  mapY:      number
  updatedAt: Timestamp

alerts/{alertId}
  level:   "high" | "medium" | "info"
  icon:    string
  title:   string
  msg:     string
  time:    Timestamp
```

---

## 🏗️ Build for Production

```bash
npm run build
```

Output goes to `/dist`. Deploy to **Firebase Hosting**, **Vercel**, or **Netlify**:

```bash
# Vercel (zero config)
npx vercel

# Firebase Hosting
npm install -g firebase-tools
firebase login
firebase init hosting   # set dist as public dir
firebase deploy
```

---

## ✨ Features

| Feature | Details |
|---|---|
| Live simulation | R-values tick every 8s, alerts auto-fire |
| Firebase ready | `onSnapshot` real-time subscriptions wired |
| Dog profile modal | Mini sparkline chart + incident history table |
| Shock confirm | Two-step confirmation dialog |
| Toast system | Bottom-right stack, auto-dismiss after 3.5s |
| CSV export | Downloads all dog data as `.csv` |
| Search + filter | Belt ID / name search, risk-level chip filter |
| Recharts | Area, Pie, StackedBar charts |
| Responsive grid | Tailwind CSS grid layout |

---

## 🎨 Colour Palette

| Token | Value |
|---|---|
| `bg` | `#07090d` |
| `s1` | `#0c1017` |
| `s2` | `#111820` |
| `s3` | `#182030` |
| `cyan` | `#00b8d9` |
| `green` | `#00e676` |
| `yellow` | `#ffd740` |
| `red` | `#ff3d3d` |
| `orange` | `#ff6d00` |

---

## 📄 License

MIT — free to use and modify.
