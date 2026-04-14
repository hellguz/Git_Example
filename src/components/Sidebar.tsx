import { FaMountain, FaTrain, FaInfoCircle } from 'react-icons/fa';
import type { Station, TrailLayers } from '../types';
import { TIME_COLORS } from '../types';

interface Props {
  trailLayers: TrailLayers;
  onToggleTrail: (key: keyof TrailLayers) => void;
  showTrainTimes: boolean;
  onToggleTrainTimes: () => void;
  maxMinutes: number;
  onChangeMaxMinutes: (m: number) => void;
  loading: boolean;
  onLoadTimes: () => void;
  stations: Station[];
  selectedStation: Station | null;
}

const TIME_OPTIONS = [
  { label: '1 hour',  value: 60  },
  { label: '2 hours', value: 120 },
  { label: '3 hours', value: 180 },
  { label: '4 hours', value: 240 },
  { label: '5 hours', value: 300 },
];

const TRAIL_CONFIGS: { key: keyof TrailLayers; label: string; color: string }[] = [
  { key: 'wanderwege',     label: 'Wanderwege (hiking)',         color: '#2563eb' },
  { key: 'fernwanderwege', label: 'Fernwanderwege (long-dist.)', color: '#7c3aed' },
  { key: 'radwege',        label: 'Radwege (cycling)',           color: '#16a34a' },
  { key: 'reitwege',       label: 'Reitwege (horse)',            color: '#b45309' },
  { key: 'skistrecken',    label: 'Skistrecken (ski)',           color: '#0891b2' },
];

export default function Sidebar({
  trailLayers,
  onToggleTrail,
  showTrainTimes,
  onToggleTrainTimes,
  maxMinutes,
  onChangeMaxMinutes,
  loading,
  onLoadTimes,
  stations,
  selectedStation,
}: Props) {
  const loadedCount = stations.filter((s) => s.travelMinutes !== undefined).length;
  const totalCount = stations.length;

  return (
    <aside
      style={{
        width: 280,
        minWidth: 280,
        background: '#fff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.25rem',
        gap: '1.5rem',
        overflowY: 'auto',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Title */}
      <div>
        <h1 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>
          Thuringia Hike Planner
        </h1>
        <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>
          Trails + train connections from Weimar
        </p>
      </div>

      {/* ── Trail Layers ── */}
      <section>
        <SectionHeader icon={<FaMountain />} title="Trail Layers" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {TRAIL_CONFIGS.map(({ key, label, color }) => (
            <Toggle
              key={key}
              label={label}
              checked={trailLayers[key]}
              onChange={() => onToggleTrail(key)}
              color={color}
            />
          ))}
        </div>
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.72rem', color: '#94a3b8' }}>
          Source: ThüringenForst — GDI-Th
        </p>
      </section>

      {/* ── Chronotrain ── */}
      <section>
        <SectionHeader icon={<FaTrain />} title="Train Travel Time" />
        <p style={{ margin: '0 0 0.75rem', fontSize: '0.78rem', color: '#475569' }}>
          Where can you reach from <strong>Weimar</strong> by train?
        </p>

        <button
          onClick={onLoadTimes}
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.5rem',
            background: loading ? '#cbd5e1' : '#6366f1',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: '0.85rem',
            marginBottom: '0.6rem',
          }}
        >
          {loading
            ? `Loading… (${loadedCount}/${totalCount})`
            : loadedCount > 0
              ? 'Reload Train Times'
              : 'Load Train Times'}
        </button>

        {loadedCount > 0 && (
          <Toggle
            label="Show on map"
            checked={showTrainTimes}
            onChange={onToggleTrainTimes}
            color="#6366f1"
          />
        )}

        {loadedCount > 0 && showTrainTimes && (
          <div style={{ marginTop: '0.75rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#374151', fontWeight: 600 }}>
              Show within:{' '}
              <span style={{ color: '#6366f1' }}>{maxMinutes / 60}h</span>
            </label>
            <input
              type="range"
              min={60}
              max={300}
              step={60}
              value={maxMinutes}
              onChange={(e) => onChangeMaxMinutes(Number(e.target.value))}
              style={{ width: '100%', marginTop: 4 }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.7rem',
                color: '#94a3b8',
              }}
            >
              {['1h', '2h', '3h', '4h', '5h'].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── Legend ── */}
      {showTrainTimes && loadedCount > 0 && (
        <section>
          <SectionHeader icon={<FaInfoCircle />} title="Legend" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {TIME_OPTIONS.map(({ label, value }) => (
              <LegendRow
                key={value}
                color={TIME_COLORS[value]}
                label={value === 60 ? '≤ 1 hour' : `≤ ${label}`}
              />
            ))}
            <LegendRow color="#6366f1" label="Weimar (start)" />
          </div>
        </section>
      )}

      {/* ── Selected Station ── */}
      {selectedStation?.travelMinutes !== undefined && (
        <section
          style={{
            background: '#f8fafc',
            borderRadius: 8,
            padding: '0.75rem',
            border: '1px solid #e2e8f0',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>
            {selectedStation.name}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: 4 }}>
            🚂 {formatMinutes(selectedStation.travelMinutes)} from Weimar
          </div>
        </section>
      )}

      <div style={{ marginTop: 'auto', fontSize: '0.68rem', color: '#94a3b8' }}>
        Trail data: © GDI-Th, Datenlizenz Deutschland Namensnennung 2.0
        <br />
        Train data: Deutsche Bahn / bahn.guru
      </div>
    </aside>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatMinutes(m: number) {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return h > 0 ? `${h}h ${min > 0 ? min + ' min' : ''}` : `${min} min`;
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: '0.6rem',
        fontWeight: 700,
        fontSize: '0.82rem',
        color: '#374151',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}
    >
      <span style={{ color: '#6366f1' }}>{icon}</span>
      {title}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
  color,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  color: string;
}) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        cursor: 'pointer',
        fontSize: '0.82rem',
        color: '#374151',
      }}
    >
      <div
        onClick={onChange}
        style={{
          width: 36,
          height: 20,
          borderRadius: 10,
          background: checked ? color : '#cbd5e1',
          position: 'relative',
          transition: 'background 0.2s',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 2,
            left: checked ? 18 : 2,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#fff',
            transition: 'left 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        />
      </div>
      {label}
    </label>
  );
}

function LegendRow({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: '50%',
          background: color,
          border: '2px solid #fff',
          boxShadow: '0 0 0 1px #cbd5e1',
          flexShrink: 0,
        }}
      />
      <span style={{ fontSize: '0.78rem', color: '#374151' }}>{label}</span>
    </div>
  );
}
