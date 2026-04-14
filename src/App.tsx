import { useState, useRef, useCallback } from 'react';
import MapView from './components/MapView';
import Sidebar from './components/Sidebar';
import type { Station, TrailLayers } from './types';
import { DEFAULT_TRAIL_LAYERS } from './types';
import { STATIONS, WEIMAR } from './data/stations';
import { findStop, getJourneyMinutes } from './api/dbApi';

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function App() {
  const [stations, setStations] = useState<Station[]>(STATIONS);
  const [trailLayers, setTrailLayers] = useState<TrailLayers>(DEFAULT_TRAIL_LAYERS);
  const [showTrainTimes, setShowTrainTimes] = useState(false);
  const [maxMinutes, setMaxMinutes] = useState(180);
  const [loading, setLoading] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const weimarIdRef = useRef<string | null>(null);

  const toggleTrail = useCallback((key: keyof TrailLayers) => {
    setTrailLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const loadTimes = useCallback(async () => {
    setLoading(true);
    setShowTrainTimes(true);
    setStations(STATIONS.map((s) => ({ ...s, travelMinutes: undefined, loading: true, error: false })));

    if (!weimarIdRef.current) {
      const stop = await findStop(WEIMAR.searchName);
      if (!stop) { setLoading(false); return; }
      weimarIdRef.current = stop.id;
    }
    const weimarId = weimarIdRef.current!;

    for (let i = 0; i < STATIONS.length; i++) {
      const station = STATIONS[i];
      const stop = await findStop(station.searchName);
      if (!stop) {
        setStations((prev) => prev.map((s, idx) => idx === i ? { ...s, loading: false, error: true } : s));
        await sleep(150);
        continue;
      }
      const minutes = await getJourneyMinutes(weimarId, stop.id);
      setStations((prev) =>
        prev.map((s, idx) =>
          idx === i
            ? {
                ...s,
                id: stop.id,
                lat: stop.location?.latitude ?? s.lat,
                lng: stop.location?.longitude ?? s.lng,
                travelMinutes: minutes ?? undefined,
                loading: false,
                error: minutes === null,
              }
            : s,
        ),
      );
      await sleep(250);
    }

    setLoading(false);
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Sidebar
        trailLayers={trailLayers}
        onToggleTrail={toggleTrail}
        showTrainTimes={showTrainTimes}
        onToggleTrainTimes={() => setShowTrainTimes((v) => !v)}
        maxMinutes={maxMinutes}
        onChangeMaxMinutes={setMaxMinutes}
        loading={loading}
        onLoadTimes={loadTimes}
        stations={stations}
        selectedStation={selectedStation}
      />
      <div style={{ flex: 1, position: 'relative' }}>
        <MapView
          stations={stations}
          trailLayers={trailLayers}
          showTrainTimes={showTrainTimes}
          maxMinutes={maxMinutes}
          onStationClick={setSelectedStation}
        />
      </div>
    </div>
  );
}
