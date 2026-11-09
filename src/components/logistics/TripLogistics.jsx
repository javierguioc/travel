// Logística Chile: alojamiento por noche, traslados tramo a tramo y reservas.
// Los mapas de fondo usan OpenStreetMap (sin claves privadas); el botón abre
// las indicaciones de Google Maps para consultar el trayecto vial real.
import RoutePreview from './RoutePreview';

const linkClass = 'inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500';
const tag = (kind) => kind === 'confirmado' ? 'bg-emerald-100 text-emerald-800' : kind === 'por confirmar' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700';
const icons = { car: '🚗', bus: '🚌', flight: '✈️', boat: '🛥️', walk: '🥾', transfer: '🚐', tour: '🧭' };
const clp = (value) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value);


function cop(value) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
}

export function FlightPriceReferenceCard({ references }) {
  if (!references?.length) return null;
  return (
    <section className="mb-6 space-y-4">
      {references.map((ref, idx) => (
        <article key={idx} className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 text-white shadow-lg">
          <div className="border-b border-slate-700 bg-gradient-to-r from-slate-900 to-slate-800 p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-sky-300">✈️ Precio de vuelo guardado</p>
                <h3 className="mt-1 text-lg font-bold">{ref.title}</h3>
                <p className="mt-1 text-xs text-slate-400">{ref.source} · referencia vista {ref.observedAt}</p>
              </div>
              {ref.cheapestTabCop && <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-300">Más económicos desde {cop(ref.cheapestTabCop)}</span>}
            </div>
          </div>
          <div className="divide-y divide-slate-800">
            {ref.options?.map((flight, i) => (
              <div key={i} className={`grid gap-3 p-4 sm:grid-cols-[1.1fr_1fr_.7fr] sm:items-center ${flight.recommended ? 'bg-sky-500/10' : ''}`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{flight.airline}</span>
                    {flight.recommended && <span className="rounded bg-sky-400/15 px-2 py-0.5 text-[10px] font-bold uppercase text-sky-300">Objetivo</span>}
                  </div>
                  <p className="mt-1 text-sm text-slate-300">{flight.departure} → {flight.arrival}</p>
                </div>
                <div className="text-sm text-slate-300">
                  <p>{flight.duration}</p>
                  <p className="text-xs text-slate-500">{flight.stops}</p>
                </div>
                <p className="text-right text-lg font-extrabold text-emerald-300">{cop(flight.priceCop)}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2 border-t border-slate-800 p-4">
            <p className="text-xs leading-relaxed text-slate-400">{ref.note}</p>
            {ref.monitoring && <p className="rounded-lg bg-amber-400/10 p-3 text-xs font-semibold text-amber-200">🔔 {ref.monitoring}</p>}
            <a href={ref.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-500">
              Abrir esta búsqueda en Google Flights ↗
            </a>
          </div>
        </article>
      ))}
    </section>
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
            <RoutePreview leg={leg} />
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
          {tour.imageUrl && (
            <img src={tour.imageUrl} alt={tour.name} loading="lazy"
              className="mt-3 h-40 w-full rounded-xl bg-teal-100 object-cover"
              onError={(event) => { event.currentTarget.style.display = 'none'; }}
            />
          )}
          {(tour.priceLabel || tour.pricePerPerson) && <p className="mt-2 text-sm text-slate-800"><strong>{tour.priceLabel || `${clp(tour.pricePerPerson)} por persona`}</strong>{tour.groupPriceLabel ? ` · ${tour.groupPriceLabel}` : (tour.groupSize && tour.pricePerPerson ? ` · ${clp(tour.pricePerPerson * tour.groupSize)} para ${tour.groupSize}` : '')}</p>}
          {tour.alternatives?.length > 0 && (
            <div className="mt-2 rounded-lg border border-teal-200 bg-white/70 p-3">
              <p className="text-xs font-bold uppercase tracking-wide text-teal-800">Alternativa</p>
              {tour.alternatives.map((alt, altIndex) => (
                <p key={altIndex} className="mt-1 text-sm text-slate-700">
                  <strong>{alt.name}:</strong> {clp(alt.pricePerPerson)} pp · {clp(alt.groupPrice)} para 6 · {alt.schedule} · {alt.duration}
                </p>
              ))}
            </div>
          )}
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
      <FlightPriceReferenceCard references={day.flightPriceReferences} />
      <NightStayCard stay={day.nightStay} />
      <DayTransportCards legs={day.transportLegs} />
      <TourOperatorCard tours={day.toursToBook} />
    </>
  );
}

export function TripLogisticsOverview({ itineraryData }) {
  if (!itineraryData?.tripLogistics) return null;
  const { groupSize, operator, airport, stays, openItems, transportWarning } = itineraryData.tripLogistics;
  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">🧳 Logística de las {groupSize} personas</h2>
        <p className="mt-2 text-sm text-slate-700">Hospedajes, transporte y actividades están en cada día. Los enlaces llevan a búsquedas u operadores: todavía no equivalen a reservas. Los costos generales del resumen son estimaciones previas en USD; para tours usa las cotizaciones CLP mostradas en cada tarjeta.</p>
        {transportWarning && <p className="mt-2 text-xs font-medium text-sky-800">🗺️ {transportWarning}</p>}
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
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900">🚐 ¿Van o transfer privado para seis?</h3>
        <p className="mt-2 text-sm text-slate-700">La consulta a Viajero Austral para recogida en Balmaceda sigue pendiente. Comparar con una van de 7–9 plazas y espacio real para seis maletas; confirmar seguros, ripio, kilometraje y devolución en el mismo aeropuerto.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a className={linkClass} href="https://www.discovercars.com/chile/balmaceda/balmaceda-airport" target="_blank" rel="noopener noreferrer">Comparar autos en DiscoverCars ↗</a>
          <a className={linkClass} href="https://www.latamairlines.com/cl/es/autos/#/results?ptid=130.10" target="_blank" rel="noopener noreferrer">Autos LATAM ↗</a>
        </div>
      </div>
      {openItems?.length > 0 && <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900">📋 Pendientes antes de reservar</h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {openItems.map((item, i) => <li key={i} className="flex items-start gap-2 text-sm text-slate-700"><span aria-hidden="true" className="mt-0.5 text-amber-600">○</span>{item}</li>)}
        </ul>
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
