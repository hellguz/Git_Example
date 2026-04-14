import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Station, TrailLayers } from '../types';
import { getBucketColor } from '../types';
import { WEIMAR } from '../data/stations';

const WMS_BASE =
  'https://www.geoproxy.geoportal-th.de/geoproxy/services/forst/FORST?';

function wmsUrl(layer: string) {
  return (
    WMS_BASE +
    'SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap' +
    `&LAYERS=${encodeURIComponent(layer)}` +
    '&STYLES=&FORMAT=image%2Fpng&TRANSPARENT=true' +
    '&WIDTH=256&HEIGHT=256&SRS=EPSG%3A3857&BBOX={bbox-epsg-3857}'
  );
}

// All WMS layers we support, in render order (bottom → top)
const WMS_LAYERS: { key: keyof TrailLayers; wmsName: string }[] = [
  { key: 'skistrecken', wmsName: 'skistrecken' },
  { key: 'reitwege', wmsName: 'reitwege' },
  { key: 'radwege', wmsName: 'radwege' },
  { key: 'fernwanderwege', wmsName: 'fernwanderwege' },
  { key: 'wanderwege', wmsName: 'wanderwege' },
];

interface Props {
  stations: Station[];
  trailLayers: TrailLayers;
  showTrainTimes: boolean;
  maxMinutes: number;
  onStationClick: (s: Station) => void;
}

export default function MapView({
  stations,
  trailLayers,
  showTrainTimes,
  maxMinutes,
  onStationClick,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  // Refs so async callbacks always see the latest values without re-running the init effect
  const stationsRef = useRef(stations);
  stationsRef.current = stations;
  const trailLayersRef = useRef(trailLayers);
  trailLayersRef.current = trailLayers;

  // ── Init map ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            maxzoom: 19,
            attribution:
              '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          },
        },
        layers: [{ id: 'osm-tiles', type: 'raster', source: 'osm' }],
      },
      center: [WEIMAR.lng, WEIMAR.lat],
      zoom: 8,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.addControl(new maplibregl.ScaleControl(), 'bottom-right');

    map.on('load', () => {
      // ── Add one raster source + layer per WMS layer ─────────────────────────
      // Use trailLayersRef so we get the correct initial visibility right away,
      // without waiting for a subsequent useEffect to fire.
      for (const { key, wmsName } of WMS_LAYERS) {
        map.addSource(key, {
          type: 'raster',
          tiles: [wmsUrl(wmsName)],
          tileSize: 256,
          attribution: '© GDI-Th',
        });
        map.addLayer({
          id: `${key}-layer`,
          type: 'raster',
          source: key,
          layout: { visibility: trailLayersRef.current[key] ? 'visible' : 'none' },
          paint: { 'raster-opacity': 0.9 },
        });
      }

      // ── Weimar marker ──────────────────────────────────────────────────────
      new maplibregl.Marker({ color: '#6366f1' })
        .setLngLat([WEIMAR.lng, WEIMAR.lat])
        .setPopup(
          new maplibregl.Popup({ offset: 25 }).setHTML(
            `<strong>Weimar</strong><br/>Starting point`,
          ),
        )
        .addTo(map);

      // ── Station GeoJSON ────────────────────────────────────────────────────
      map.addSource('stations', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });
      map.addLayer({
        id: 'stations-circles',
        type: 'circle',
        source: 'stations',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 6, 6, 10, 10, 14, 14],
          'circle-color': ['get', 'color'],
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 2,
          'circle-opacity': 0.9,
        },
      });
      map.addLayer({
        id: 'stations-labels',
        type: 'symbol',
        source: 'stations',
        layout: {
          'text-field': ['get', 'name'],
          'text-size': 11,
          'text-offset': [0, 1.5],
          'text-anchor': 'top',
        },
        paint: {
          'text-color': '#1e293b',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1.5,
        },
      });

      // ── Station click ──────────────────────────────────────────────────────
      map.on('click', 'stations-circles', (e) => {
        const f = e.features?.[0];
        if (!f) return;
        const props = f.properties as { name: string; minutes: number };
        const minutes = Math.round(props.minutes);
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        const timeStr = h > 0 ? `${h}h ${m > 0 ? m + ' min' : ''}` : `${m} min`;

        if (popupRef.current) popupRef.current.remove();
        const coords = (f.geometry as GeoJSON.Point).coordinates as [number, number];
        popupRef.current = new maplibregl.Popup()
          .setLngLat(coords)
          .setHTML(`<strong>${props.name}</strong><br/>🚂 from Weimar: <strong>${timeStr}</strong>`)
          .addTo(map);

        const match = stationsRef.current.find((s) => s.name === props.name);
        if (match) onStationClick(match);
      });

      map.on('mouseenter', 'stations-circles', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'stations-circles', () => {
        map.getCanvas().style.cursor = '';
      });
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Sync WMS layer visibility ───────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const apply = () => {
      for (const { key } of WMS_LAYERS) {
        if (map.getLayer(`${key}-layer`)) {
          map.setLayoutProperty(
            `${key}-layer`,
            'visibility',
            trailLayersRef.current[key] ? 'visible' : 'none',
          );
        }
      }
    };

    if (map.isStyleLoaded()) {
      apply();
    } else {
      map.once('load', apply);
    }
  }, [trailLayers]);

  // ── Sync station GeoJSON ───────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    const source = map.getSource('stations') as maplibregl.GeoJSONSource | undefined;
    if (!source) return;

    const visible = showTrainTimes
      ? stations.filter((s) => s.travelMinutes !== undefined && s.travelMinutes <= maxMinutes)
      : [];

    source.setData({
      type: 'FeatureCollection',
      features: visible.map((s) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [s.lng, s.lat] },
        properties: {
          name: s.name,
          minutes: s.travelMinutes ?? 0,
          color: getBucketColor(s.travelMinutes ?? 0),
        },
      })),
    });
  }, [stations, showTrainTimes, maxMinutes]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
