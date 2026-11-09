// Mapas de recorridos con teselas © OpenStreetMap y rutas viales OSRM.
// No usamos capturas de Google Maps ni presentamos líneas rectas como carreteras.
import { useEffect, useMemo, useRef, useState } from 'react';

const WIDTH = 800;
const HEIGHT = 320;
const TILE = 256;
const routeCache = new Map();
const roadModes = new Set(['car', 'bus', 'transfer']);
const isPoint = (p) => Array.isArray(p) && p.length === 2 && p.every(Number.isFinite);
const radians = (n) => n * Math.PI / 180;

function straightKm(a, b) {
  const dLat = radians(b[0] - a[0]);
  const dLon = radians(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(radians(a[0])) * Math.cos(radians(b[0])) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function project([lat, lon], zoom) {
  const latClamped = Math.max(-85.0511, Math.min(85.0511, lat));
  const rad = radians(latClamped);
  const scale = TILE * (2 ** zoom);
  return [
    (lon + 180) / 360 * scale,
    (1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2 * scale,
  ];
}

function buildMap(points) {
  if (points.length < 2 || !points.every(isPoint)) return null;
  const base = points.map((p) => project(p, 0));
  const xs = base.map((p) => p[0]);
  const ys = base.map((p) => p[1]);
  const spanX = Math.max(...xs) - Math.min(...xs);
  const spanY = Math.max(...ys) - Math.min(...ys);
  const ratio = Math.min((WIDTH - 96) / Math.max(spanX, 0.001), (HEIGHT - 88) / Math.max(spanY, 0.001));
  const zoom = Math.max(2, Math.min(14, Math.floor(Math.log2(ratio))));
  const factor = 2 ** zoom;
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2 * factor;
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2 * factor;
  const left = cx - WIDTH / 2;
  const top = cy - HEIGHT / 2;
  const screen = (p) => {
    const [x, y] = project(p, zoom);
    return [x - left, y - top];
  };
  const tiles = [];
  const count = 2 ** zoom;
  const minTileX = Math.floor(left / TILE);
  const maxTileX = Math.floor((left + WIDTH) / TILE);
  const minTileY = Math.floor(top / TILE);
  const maxTileY = Math.floor((top + HEIGHT) / TILE);
  for (let tx = minTileX; tx <= maxTileX; tx += 1) {
    for (let ty = minTileY; ty <= maxTileY; ty += 1) {
      if (ty < 0 || ty >= count) continue;
      tiles.push({
        x: tx * TILE - left,
        y: ty * TILE - top,
        src: `https://tile.openstreetmap.org/${zoom}/${((tx % count) + count) % count}/${ty}.png`,
        key: `${zoom}-${tx}-${ty}`,
      });
    }
  }
  return { tiles, path: points.map((p) => screen(p).map((n) => n.toFixed(1)).join(',')).join(' '), start: screen(points[0]), end: screen(points[points.length - 1]) };
}

function directionsUrl(leg) {
  if (leg.mapUrl) return leg.mapUrl;
  const p = new URLSearchParams({ api: '1', origin: leg.from, destination: leg.to });
  if (roadModes.has(leg.mode)) p.set('travelmode', 'driving');
  if (leg.mode === 'walk') p.set('travelmode', 'walking');
  return 'https://www.google.com/maps/dir/?' + p.toString();
}

async function loadRoadRoute(start, end, signal) {
  const key = [start.join(','), end.join(',')].join('>');
  if (routeCache.has(key)) return routeCache.get(key);
  const coords = `${start[1]},${start[0]};${end[1]},${end[0]}`;
  const endpoints = [
    `https://routing.openstreetmap.de/routed-car/route/v1/driving/${coords}?overview=full&geometries=geojson`,
    `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`,
  ];
  for (const url of endpoints) {
    try {
      const response = await fetch(url, { signal });
      if (!response.ok) continue;
      const data = await response.json();
      const route = data?.routes?.[0];
      if (data.code !== 'Ok' || !route?.geometry?.coordinates?.length) continue;
      const coordsLatLon = route.geometry.coordinates.map(([lon, lat]) => [lat, lon]);
      // Preserve the first/last points, sampling dense tracks for quick SVG rendering.
      const skip = Math.max(1, Math.ceil(coordsLatLon.length / 1400));
      const points = coordsLatLon.filter((_, i) => i % skip === 0);
      points.push(coordsLatLon[coordsLatLon.length - 1]);
      const result = { points, distanceKm: route.distance / 1000, minutes: route.duration / 60 };
      routeCache.set(key, result);
      return result;
    } catch (error) {
      if (signal.aborted) throw error;
      // Try the alternative public routing service.
    }
  }
  throw new Error('No se pudo cargar la ruta vial');
}

function Marker({ point, label, color }) {
  return (
    <g transform={`translate(${point[0]} ${point[1]})`}>
      <circle r="18" fill="#fff" stroke="#fff" strokeWidth="3" />
      <circle r="15" fill={color} stroke="#fff" strokeWidth="2" />
      <text x="0" y="5" textAnchor="middle" fontSize="15" fontWeight="800" fill="#fff">{label}</text>
    </g>
  );
}

export default function RoutePreview({ leg }) {
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [roadRoute, setRoadRoute] = useState(null);
  const [routeState, setRouteState] = useState('idle');
  const start = leg.originCoords;
  const end = leg.destinationCoords;
  const hasPoints = isPoint(start) && isPoint(end);
  const isRoad = roadModes.has(leg.mode);

  useEffect(() => {
    if (!expanded || visible || !containerRef.current) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: '250px' });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [expanded, visible]);

  useEffect(() => {
    if (!visible || !hasPoints || !isRoad) return;
    const controller = new AbortController();
    setRouteState('loading');
    loadRoadRoute(start, end, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        setRoadRoute(result);
        setRouteState('ready');
      })
      .catch(() => {
        if (!controller.signal.aborted) setRouteState('error');
      });
    return () => controller.abort();
  }, [visible, hasPoints, isRoad, start, end]);

  const geometry = roadRoute?.points || (hasPoints ? [start, end] : []);
  const map = useMemo(() => buildMap(geometry), [roadRoute, start, end]);
  const distance = Number.isFinite(leg.distanceKm)
    ? `${Math.round(leg.distanceKm)} km`
    : leg.distanceLabel
      ? leg.distanceLabel
      : roadRoute?.distanceKm
        ? `${Math.round(roadRoute.distanceKm)} km`
        : hasPoints
          ? `~${Math.round(straightKm(start, end))} km`
          : 'Distancia por confirmar';
  const distanceKind = (Number.isFinite(leg.distanceKm) || leg.distanceLabel)
    ? (leg.distanceSource || 'Distancia de referencia')
    : roadRoute?.distanceKm
      ? 'Ruta por carretera · OSRM / OpenStreetMap'
      : hasPoints
        ? 'En línea recta · no equivale al recorrido'
        : 'Consultar ruta para distancia';
  const routeNote = isRoad
    ? routeState === 'ready'
      ? 'Ruta vial trazada sobre OpenStreetMap'
      : routeState === 'loading'
        ? 'Calculando recorrido por carretera…'
        : routeState === 'error'
          ? 'Ruta vial no disponible: línea orientativa, consultar Google Maps'
          : 'Línea orientativa hasta cargar la ruta vial'
    : leg.mode === 'flight'
      ? 'Línea aérea ilustrativa · no es trayectoria real del vuelo'
      : leg.mode === 'boat'
        ? 'Línea ilustrativa · no es una ruta náutica'
        : leg.mode === 'walk'
          ? 'Referencia visual · no usar como mapa de senderismo'
          : 'Referencia visual';

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-3 py-2">
        <div>
          <p className="text-sm font-bold text-slate-900">🗺️ Vista del recorrido</p>
          <p className="text-[11px] text-slate-500">{distanceKind}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-blue-50 px-2 py-1 text-sm font-extrabold text-blue-800">{distance}</span>
          <button type="button" onClick={() => setExpanded((v) => !v)}
            className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200">
            {expanded ? 'Ocultar' : 'Ver mapa'}
          </button>
        </div>
      </div>
      {expanded && (
        <div ref={containerRef} className="relative w-full overflow-hidden bg-gradient-to-br from-emerald-100 to-sky-100" style={{ aspectRatio: '800 / 320' }}>
          {map && visible ? (
            <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="xMidYMid meet"
              role="img" aria-label={`Mapa de ${leg.from} a ${leg.to}`}
              className="h-full w-full">
              {map.tiles.map((tile) => (
                <image key={tile.key} href={tile.src} x={tile.x} y={tile.y} width={TILE} height={TILE} />
              ))}
              <polyline points={map.path} fill="none" stroke="white" strokeWidth="10" strokeLinejoin="round" strokeLinecap="round" opacity="0.95" />
              <polyline points={map.path} fill="none" stroke={isRoad && roadRoute ? '#284bd7' : '#6556e8'}
                strokeWidth="6" strokeLinejoin="round" strokeLinecap="round"
                strokeDasharray={isRoad && roadRoute ? undefined : '12 9'} />
              <Marker point={map.start} label="A" color="#1c8f5e" />
              <Marker point={map.end} label="B" color="#d13e50" />
            </svg>
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-sm font-semibold text-slate-700">
              {hasPoints ? 'Cargando mapa del recorrido…' : 'Abre Google Maps para consultar el trayecto y la distancia'}
            </div>
          )}
          <div className="absolute bottom-2 left-2 right-2 flex flex-wrap justify-between gap-2 text-[10px]">
            <span className="rounded bg-white/95 px-2 py-1 font-medium text-slate-700 shadow">{routeNote}</span>
            {map && <span className="rounded bg-white/95 px-2 py-1 font-medium text-slate-700 shadow">© OpenStreetMap contributors</span>}
          </div>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-3">
        <div>
          <p className="text-sm font-bold text-slate-900">⏱️ {leg.mapDuration || leg.duration || 'Tiempo por confirmar'}</p>
          <p className="text-[11px] text-slate-500">Tiempo orientativo; no incluye esperas ni imprevistos</p>
        </div>
        <a href={directionsUrl(leg)} target="_blank" rel="noopener noreferrer"
          className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700">
          Ver ruta en Google Maps ↗
        </a>
      </div>
    </div>
  );
}
