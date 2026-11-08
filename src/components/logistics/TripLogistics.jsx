// Logística Chile: alojamiento por noche, traslados tramo a tramo y reservas.
// Los mapas de fondo usan OpenStreetMap (sin claves privadas); el botón abre
// las indicaciones de Google Maps para consultar el trayecto vial real.
import { useState } from 'react';

const linkClass = 'inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500';
const tag = (kind) => kind === 'confirmado' ? 'bg-emerald-100 text-emerald-800' : kind === 'por confirmar' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700';
const icons = { car: '🚗', bus: '🚌', flight: '✈️', boat: '🛥️', walk: '🥾', transfer: '🚐', tour: '🧭' };
const clp = (value) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value);

function mapLink(leg) {
  if (leg.mapUrl) return leg.mapUrl;
  const params = new URLSearchParams({ api: '1', origin: leg.from, destination: leg.to });
  if (['car', 'bus', 'transfer'].includes(leg.mode)) params.set('travelmode', 'driving');
  if (leg.mode === 'walk') params.set('travelmode', 'walking');
  return 'https://www.google.com/maps/dir/?' + params.toString();
}

function osmEmbed(leg) {
  if (!leg.originCoords || !leg.destinationCoords) return null;
  const [aLat, aLon] = leg.originCoords;
  const [bLat, bLon] = leg.destinationCoords;
  if (![aLat, aLon, bLat, bLon].every(Number.isFinite)) return null;
  const marginLat = Math.max(Math.abs(aLat - bLat) * 0.25, 0.035);
  const marginLon = Math.max(Math.abs(aLon - bLon) * 0.25, 0.035);
  const bbox = [
    Math.min(aLon, bLon) - marginLon,
    Math.min(aLat, bLat) - marginLat,
    Math.max(aLon, bLon) + marginLon,
    Math.max(aLat, bLat) + marginLat,
  ].join(',');
  return 'https://www.openstreetmap.org/export/embed.html?bbox=' +
    encodeURIComponent(bbox) + '&layer=mapnik&marker=' + bLat + '%2C' + bLon;
}

function RouteMap({ leg }) {
  const [showMap, setShowMap] = useState(true);
  const embed = ['car', 'bus', 'transfer', 'walk'].includes(leg.mode) ? osmEmbed(leg) : null;
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
      {embed && showMap ? (
        <div className="relative">
          <iframe
            title={`Mapa de zona: ${leg.from} a ${leg.to}`}
            src={embed}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="h-40 w-full border-0 bg-slate-100"
          />
          <div className="absolute bottom-1 left-2 rounded bg-white/95 px-2 py-1 text-[10px] font-medium text-slate-600 shadow">
            Mapa de zona · © OpenStreetMap · no muestra ruta vial
          </div>
          <button type="button" onClick={() => setShowMap(false)}
            className="absolute right-2 top-2 rounded-md bg-white/95 px-2 py-1 text-xs font-semibold text-slate-700 shadow">
            Ocultar mapa
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-sky-50 to-indigo-50 px-4 py-4">
          <div className="flex min-w-0 flex-1 items-center gap-2 text-xs font-semibold text-slate-700">
            <span className="truncate">{leg.from}</span>
            <span className="h-0.5 min-w-5 flex-1 bg-gradient-to-r from-sky-500 to-indigo-500" aria-hidden="true" />
            <span className="truncate">{leg.to}</span>
          </div>
          {embed && <button type="button" onClick={() => setShowMap(true)} className="shrink-0 text-xs font-bold text-blue-700">Ver mapa</button>}
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
        <span className="text-xs text-slate-600">Duración estimada, no tráfico en vivo</span>
        <a href={mapLink(leg)} target="_blank" rel="noopener noreferrer"
          className="text-xs font-bold text-blue-700 underline underline-offset-2">
          Abrir recorrido en Google Maps ↗
        </a>
      </div>
    </div>
  );
}

export function NightStayCard({ stay }) {
  if (!stay) return null;
  const noNight = stay.noNight;
  return (
    <section className="mb-6 rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-4 sm:p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">🏠 ¿Dónde dormimos esta noche?</h3>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${noNight ? 'bg-slate-100 text-slate-700' : tag(stay.status || 'por confirmar')}`}>
          {noNight ? 'En tránsito' : 'Alojamiento por reservar'}
        </span>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-indigo-700">Ciudad / noche</p>
          <p className="mt-1 text-lg font-bold text-slate-900">{stay.city}</p>
          <p className="text-sm text-slate-600">{stay.dateLabel || ''}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-indigo-700">{noNight ? 'Plan' : 'Hospedaje propuesto'}</p>
          <p className="mt-1 font-semibold text-slate-900">{stay.name || 'Sin reservar — elegir Airbnb, hostal o cabaña'}</p>
          {stay.referencePrice && <p className="text-sm text-slate-600">{stay.referencePrice}</p>}
        </div>
      </div>
      {stay.notes && <p className="mt-3 text-sm leading-relaxed text-slate-700">{stay.notes}</p>}
      {!noNight && (
        <div className="mt-4 flex flex-wrap gap-2">
          {stay.airbnbUrl && <a className={linkClass} href={stay.airbnbUrl} target="_blank" rel="noopener noreferrer">🏡 Buscar Airbnb</a>}
          {stay.hotelUrl && <a className={linkClass} href={stay.hotelUrl} target="_blank" rel="noopener noreferrer">🛏️ Ver hospedajes</a>}
          {stay.contactUrl && <a className={linkClass} href={stay.contactUrl} target="_blank" rel="noopener noreferrer">💬 Consultar alojamiento</a>}
        </div>
      )}
      <p className="mt-3 text-xs text-slate-500">Ninguna propiedad aparece como reservada hasta que se confirme un enlace específico.</p>
    </section>
  );
}

export function DayTransportCards({ legs }) {
  if (!legs?.length) return null;
  return (
    <section className="mb-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xl font-bold text-slate-900">🧭 Cómo nos movemos hoy</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{legs.length} tramos / opciones</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {legs.map((leg, i) => (
          <article key={i} className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-2xl">{icons[leg.mode] || '📍'}</div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${tag(leg.status || 'por confirmar')}`}>{leg.status || 'Por confirmar'}</span>
                  {leg.option && <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-bold text-violet-800">{leg.option}</span>}
                </div>
                <h4 className="mt-2 text-base font-bold leading-snug text-slate-900">{leg.from} → {leg.to}</h4>
                <p className="mt-1 text-sm font-semibold text-slate-700">{leg.operator || 'Transporte por definir'} · {leg.duration || 'Duración por confirmar'}</p>
                {leg.departure && <p className="mt-1 text-sm text-slate-600">🕐 Salida: {leg.departure}</p>}
              </div>
            </div>
            {leg.notes && <p className="mt-3 text-sm leading-relaxed text-slate-600">{leg.notes}</p>}
            {leg.price && <p className="mt-2 text-sm font-semibold text-slate-800">💰 {leg.price}</p>}
            <RouteMap leg={leg} />
            {leg.bookingUrl && <a className={`${linkClass} mt-3 w-full`} href={leg.bookingUrl} target="_blank" rel="noopener noreferrer">Consultar / reservar transporte ↗</a>}
          </article>
        ))}
      </div>
    </section>
  );
}

export function TourOperatorCard({ tours }) {
  if (!tours?.length) return null;
  return (
    <section className="mb-6 space-y-3">
      <h3 className="text-xl font-bold text-slate-900">🎟️ Tours y reservas del día</h3>
      {tours.map((tour, i) => (
        <div key={i} className="rounded-2xl border border-teal-200 bg-teal-50 p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-teal-800">{tour.operator || 'Operador por confirmar'}</p>
              <h4 className="mt-1 text-lg font-bold text-slate-900">{tour.name}</h4>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${tag(tour.status || 'por confirmar')}`}>{tour.status || 'Por confirmar'}</span>
          </div>
          {tour.pricePerPerson && <p className="mt-2 text-sm text-slate-800"><strong>{clp(tour.pricePerPerson)} por persona</strong>{tour.groupSize ? ` · ${clp(tour.pricePerPerson * tour.groupSize)} para ${tour.groupSize}` : ''}</p>}
          {tour.details && <p className="mt-2 text-sm leading-relaxed text-slate-700">{tour.details}</p>}
          {tour.checkin && <p className="mt-2 rounded-lg bg-white/70 p-3 text-sm font-semibold text-teal-900">⚠️ {tour.checkin}</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            {tour.url && <a className={linkClass} href={tour.url} target="_blank" rel="noopener noreferrer">Ver tour oficial ↗</a>}
            {tour.whatsappUrl && <a className={linkClass} href={tour.whatsappUrl} target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>}
          </div>
        </div>
      ))}
    </section>
  );
}

export function DayLogistics({ day }) {
  if (!day) return null;
  return (
    <>
      <NightStayCard stay={day.nightStay} />
      <DayTransportCards legs={day.transportLegs} />
      <TourOperatorCard tours={day.toursToBook} />
    </>
  );
}

export function TripLogisticsOverview({ itineraryData }) {
  if (!itineraryData?.tripLogistics) return null;
  const { groupSize, operator, airport, stays } = itineraryData.tripLogistics;
  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">🧳 Logística de las {groupSize} personas</h2>
        <p className="mt-2 text-sm text-slate-700">Hospedajes, transporte y actividades están en cada día. Los enlaces llevan a búsquedas u operadores: todavía no equivalen a reservas.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {stays?.map((s, i) => <div key={i} className="rounded-xl border border-sky-100 bg-white p-3">
            <p className="text-xs font-bold text-sky-800">{s.dates}</p>
            <p className="mt-1 font-bold text-slate-900">{s.city}</p>
            <p className="mt-1 text-xs text-slate-600">{s.nights} noche{s.nights === 1 ? '' : 's'} · por reservar</p>
          </div>)}
        </div>
      </div>
      {operator && <div className="rounded-2xl border border-teal-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900">📞 Contacto de excursiones: {operator.name}</h3>
        <p className="mt-2 text-sm text-slate-700">{operator.notes}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a className={linkClass} href={operator.whatsappUrl} target="_blank" rel="noopener noreferrer">💬 WhatsApp {operator.phone}</a>
          <a className={linkClass} href={operator.sanRafaelUrl} target="_blank" rel="noopener noreferrer">Glaciar San Rafael ↗</a>
          <a className={linkClass} href={operator.raftingUrl} target="_blank" rel="noopener noreferrer">Rafting Baker ↗</a>
        </div>
      </div>}
      {airport && <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 shadow-sm">
        <h3 className="text-lg font-bold text-amber-950">✈️ Puerto Natales (PNT): cierre parcial por obras de pista</h3>
        <p className="mt-2 text-sm text-amber-950">{airport.explanation}</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-white p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-red-700">🔴 Cerrado en enero 2027</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{airport.closed.join(' · ')}</p>
          </div>
          <div className="rounded-xl bg-white p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-green-700">🟢 Abierto en enero 2027</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{airport.open.join(' · ')}</p>
          </div>
        </div>
        <p className="mt-3 text-sm font-semibold text-amber-950">{airport.plan}</p>
        <p className="mt-2 text-xs text-amber-900">Calendario sujeto a NOTAM y cambios operativos; aeródromo abierto no garantiza vuelos ni cupos.</p>
        {airport.sourceUrl && <a className="mt-2 inline-block text-sm font-semibold text-blue-700 underline" href={airport.sourceUrl} target="_blank" rel="noopener noreferrer">Consultar información oficial ↗</a>}
      </div>}
    </section>
  );
}
