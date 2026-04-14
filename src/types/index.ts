export interface TrailLayers {
  wanderwege: boolean;      // hiking trails
  fernwanderwege: boolean;  // long-distance trails
  radwege: boolean;         // cycling paths
  reitwege: boolean;        // horse riding trails
  skistrecken: boolean;     // ski runs
}

export const DEFAULT_TRAIL_LAYERS: TrailLayers = {
  wanderwege: true,
  fernwanderwege: false,
  radwege: false,
  reitwege: false,
  skistrecken: false,
};

export interface Station {
  name: string;
  searchName: string;
  lat: number;
  lng: number;
  id?: string;
  travelMinutes?: number;
  loading?: boolean;
  error?: boolean;
}

export type TimeFilter = 60 | 120 | 180 | 240 | 300;

export const TIME_COLORS: Record<number, string> = {
  60: '#22c55e',   // green  — within 1h
  120: '#84cc16',  // lime   — 1–2h
  180: '#eab308',  // yellow — 2–3h
  240: '#f97316',  // orange — 3–4h
  300: '#ef4444',  // red    — 4–5h
};

export function getBucketColor(minutes: number): string {
  if (minutes <= 60) return TIME_COLORS[60];
  if (minutes <= 120) return TIME_COLORS[120];
  if (minutes <= 180) return TIME_COLORS[180];
  if (minutes <= 240) return TIME_COLORS[240];
  return TIME_COLORS[300];
}
