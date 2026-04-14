# Thuringia Hike Planner

An interactive map app to explore hiking trails in Thuringia and plan day-trips using public transport from Weimar.

## Features

- **Wanderwege layer** — official hiking trails from the Thuringia forestry/tourism WMS service (GDI-Th)
- **Chronotrain layer** — train stations colored by travel time from Weimar (1–5 hours), using Deutsche Bahn live data

## Setup

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## How to use

1. The map opens centered on Thuringia with hiking trails already visible (blue lines from the WMS)
2. Toggle trails on/off with the **Show Wanderwege** switch
3. Click **Load Train Times** — the app queries the DB API for travel times from Weimar to ~35 stations. This takes ~2 minutes to load all stations (to stay within rate limits)
4. Once loaded, stations appear as colored dots:
   - 🟢 Green — within 1 hour
   - 🟡 Lime — 1–2 hours
   - 🟡 Yellow — 2–3 hours
   - 🟠 Orange — 3–4 hours
   - 🔴 Red — 4–5 hours
5. Use the **time slider** to filter which stations are visible
6. Click any station dot for travel time details

## Data sources

| Layer | Source |
|-------|--------|
| Hiking trails (WMS) | ThüringenForst AöR — GDI-Th, Datenlizenz Deutschland Namensnennung 2.0 |
| Train data | Deutsche Bahn via [bahn.guru](https://bahn.guru) |
| Base map | OpenStreetMap contributors |

## Build for production

```bash
npm run build
```

Output goes to `dist/`.
