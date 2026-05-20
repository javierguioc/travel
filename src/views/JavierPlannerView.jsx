import { useState, useMemo, useRef, useEffect } from 'react';
import { useItineraryStore } from '../store/store';
import { format, differenceInHours, differenceInDays, isPast, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const TIER_STYLES = {
  top: 'bg-amber-400/20 text-amber-300 border border-amber-400/30',
  secundaria: 'bg-zinc-600/40 text-zinc-300 border border-zinc-500/30',
  stories: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
};

const TIER_LABELS = {
  top: '⭐ TOP',
  secundaria: 'secundaria',
  stories: '📱 stories',
};

const GROUP_COLORS = {
  'grupo1': 'from-orange-500 to-red-500',
  'grupo2': 'from-blue-500 to-indigo-600',
  'grupo3': 'from-purple-500 to-pink-500',
  'grupo4': 'from-slate-500 to-zinc-600',
  'grupo5': 'from-emerald-500 to-teal-600',
  'grupo6': 'from-amber-500 to-orange-500',
  'grupo7': 'from-cyan-500 to-blue-500',
  'grupo8': 'from-rose-500 to-red-600',
  'stories-inicio': 'from-zinc-600 to-zinc-700',
  'stories-transito1': 'from-zinc-600 to-zinc-700',
  'stories-transito2': 'from-zinc-600 to-zinc-700',
  'stories-vaticano': 'from-zinc-600 to-zinc-700',
  'stories-cierre': 'from-zinc-600 to-zinc-700',
};

function ColorSwatch({ item, colors }) {
  const rgb = colors?.[item];
  if (!rgb) return null;
  return (
    <span
      className="shrink-0 w-3 h-3 rounded-sm border border-white/15 shadow-sm"
      style={{ backgroundColor: `rgb(${rgb})` }}
    />
  );
}

function OutfitSection({ outfit, colors }) {
  if (!outfit) return null;
  const tier = outfit.tier || 'secundaria';

  const Row = ({ emoji, item }) => item ? (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-zinc-500 shrink-0">{emoji}</span>
      <ColorSwatch item={item} colors={colors} />
      <span className="text-white">{item}</span>
    </div>
  ) : null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${TIER_STYLES[tier]}`}>
          {TIER_LABELS[tier]}
        </span>
      </div>
      <div className="bg-zinc-800/60 rounded-xl p-3 space-y-1.5">
        <Row emoji="👕" item={outfit.top} />
        <Row emoji="👖" item={outfit.bottom} />
        <Row emoji="🧥" item={outfit.layer} />
        <Row emoji="👟" item={outfit.shoes} />
        <Row emoji="🎩" item={outfit.accessories} />
        {outfit.outfitChange && (
          <div className="mt-2 pt-2 border-t border-zinc-700">
            <p className="text-xs text-indigo-300 font-semibold mb-1">+ Cambio de tarde/noche</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-zinc-500 shrink-0">👕</span>
              <ColorSwatch item={outfit.outfitChange.top} colors={colors} />
              <span className="text-zinc-300">{outfit.outfitChange.top}</span>
            </div>
            <p className="text-xs text-zinc-500 mt-1 ml-6">{outfit.outfitChange.when}</p>
          </div>
        )}
        {outfit.note && (
          <p className="text-xs text-zinc-500 mt-2 italic border-t border-zinc-700/50 pt-2">{outfit.note}</p>
        )}
      </div>
    </div>
  );
}

function DayCard({ dayData, group, onSelectGroup, isGroupActive, colors, isToday }) {
  const [tab, setTab] = useState('outfit');
  const gradientClass = GROUP_COLORS[dayData.instagramGroup] || 'from-zinc-600 to-zinc-700';

  return (
    <div className={`bg-zinc-900 rounded-2xl overflow-hidden shadow-xl flex flex-col transition-all ${
      isToday
        ? 'ring-2 ring-white shadow-[0_0_20px_2px_rgba(255,255,255,0.12)]'
        : 'border border-zinc-800'
    }`}>
      {/* Header — click para abrir grupo */}
      <button
        onClick={() => onSelectGroup(dayData.instagramGroup)}
        className={`w-full text-left bg-gradient-to-r ${gradientClass} px-4 py-3 transition-opacity hover:opacity-90`}
      >
        <div className="flex items-center gap-2">
          <span className="bg-black/30 text-white font-bold text-xs px-2 py-0.5 rounded-full shrink-0">
            Día {dayData.day}
          </span>
          {isToday && (
            <span className="bg-white text-black font-bold text-xs px-2 py-0.5 rounded-full shrink-0 animate-pulse">
              HOY
            </span>
          )}
          <h3 className="text-white font-bold text-sm leading-tight truncate flex-1">{dayData.destination}</h3>
          {group && (
            <span className={`text-white/70 text-xs shrink-0 transition-all ${isGroupActive ? 'opacity-100' : 'opacity-50'}`}>
              {group.emoji}
            </span>
          )}
        </div>
        {group && (
          <p className="text-white/50 text-xs mt-1 text-left">
            {isGroupActive ? '▲ grupo abierto' : `toca para ver captions & música`}
          </p>
        )}
      </button>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800">
        {[
          { key: 'outfit', label: '👕 Outfit' },
          { key: 'photos', label: '📸 Fotos' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2 text-xs font-semibold transition-colors ${
              tab === t.key
                ? 'text-white border-b-2 border-indigo-500 bg-zinc-800/50'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4 flex-1">
        {tab === 'outfit' && <OutfitSection outfit={dayData.outfit} colors={colors} />}

        {tab === 'photos' && (
          <div className="flex flex-wrap gap-2">
            {dayData.photoTypes?.map((photo, i) => (
              <span
                key={i}
                className="text-xs bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-full border border-zinc-700"
              >
                {photo}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FlightCheckInCard({ flight, now }) {
  const checkInDateTime = parseISO(`${flight.checkInOpens}T${flight.checkInOpensTime}:00`);
  const flightDateTime  = parseISO(`${flight.date}T${flight.departureTime}:00`);
  const flightDate      = parseISO(flight.date);

  const flightPast      = isPast(flightDateTime);
  const checkInOpen     = isPast(checkInDateTime);
  const hoursToFlight   = differenceInHours(flightDateTime, now);
  const hoursToCheckIn  = differenceInHours(checkInDateTime, now);
  const daysToCheckIn   = differenceInDays(checkInDateTime, now);

  let status, statusLabel, cardBorder, badgeCls;
  if (flightPast) {
    status = 'past';
    statusLabel = 'Vuelo completado';
    cardBorder = 'border-zinc-700';
    badgeCls = 'bg-zinc-700 text-zinc-400';
  } else if (checkInOpen && hoursToFlight <= 2) {
    status = 'urgent';
    statusLabel = '⚠️ ¡Última hora de check-in!';
    cardBorder = 'border-red-500 shadow-red-500/20 shadow-lg';
    badgeCls = 'bg-red-500 text-white animate-pulse';
  } else if (checkInOpen) {
    status = 'open';
    statusLabel = '✅ Check-in ABIERTO';
    cardBorder = 'border-emerald-500 shadow-emerald-500/20 shadow-lg';
    badgeCls = 'bg-emerald-500 text-white';
  } else if (hoursToCheckIn <= 24) {
    status = 'soon';
    statusLabel = `🔔 Check-in abre en ${hoursToCheckIn}h`;
    cardBorder = 'border-amber-400 shadow-amber-400/10 shadow-md';
    badgeCls = 'bg-amber-400 text-black';
  } else {
    status = 'upcoming';
    statusLabel = `Check-in en ${daysToCheckIn}d ${hoursToCheckIn % 24}h`;
    cardBorder = 'border-zinc-700';
    badgeCls = 'bg-zinc-700 text-zinc-300';
  }

  return (
    <div className={`bg-zinc-900 border ${cardBorder} rounded-2xl p-4 transition-all`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-white font-bold text-sm">{flight.code}</span>
            <span className="text-zinc-500 text-xs">{flight.airline}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeCls}`}>
              {statusLabel}
            </span>
          </div>
          <p className="text-zinc-300 text-sm">
            ✈️ {flight.from} → {flight.to}
          </p>
          <p className="text-zinc-400 text-xs mt-1">
            Vuelo: {format(flightDate, "d MMM yyyy", { locale: es })} a las {flight.departureTime}
          </p>
          {!flightPast && (
            <p className="text-zinc-500 text-xs mt-1">
              Check-in abre: {format(checkInDateTime, "d MMM yyyy", { locale: es })} a las {flight.checkInOpensTime}
            </p>
          )}
          <p className="text-zinc-600 text-xs mt-1 italic">{flight.checkInNote}</p>
        </div>
        <a
          href={flight.ticketUrl}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg border border-zinc-700 transition-colors"
        >
          🎫 Ticket
        </a>
      </div>
    </div>
  );
}

function GroupPanel({ group }) {
  const gradientClass = GROUP_COLORS[group.id] || 'from-zinc-600 to-zinc-700';
  const [captionTab, setCaptionTab] = useState('captions');

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      {/* Group header */}
      <div className={`bg-gradient-to-r ${gradientClass} px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">
              {group.tier === 'post' ? 'Post Instagram' : 'Stories'}
            </p>
            <h3 className="text-white font-bold text-xl">{group.emoji} {group.name}</h3>
            <p className="text-white/80 text-sm mt-1">{group.theme}</p>
          </div>
          <div className="text-right shrink-0 ml-4">
            <p className="text-white/60 text-xs">
              {group.days.length === 1
                ? `Día ${group.days[0]}`
                : `Días ${group.days[0]}–${group.days[group.days.length - 1]}`}
            </p>
            <p className="text-white/40 text-xs mt-0.5">{group.aesthetic}</p>
          </div>
        </div>
      </div>

      {/* Captions + Music tabs */}
      <div className="flex border-b border-zinc-800">
        {[
          { key: 'captions', label: '✍️ Captions' },
          { key: 'music', label: '🎵 Música' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setCaptionTab(t.key)}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
              captionTab === t.key
                ? 'text-white border-b-2 border-indigo-500 bg-zinc-800/40'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-5">
        {captionTab === 'captions' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {group.captions?.map((c, i) => (
              <div
                key={i}
                className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-sm text-zinc-200 italic"
              >
                "{c}"
              </div>
            ))}
          </div>
        )}

        {captionTab === 'music' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {group.music?.map((track, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-zinc-300 bg-zinc-800/40 rounded-xl px-4 py-2.5">
                <span className="text-indigo-400 text-base shrink-0">♪</span>
                <span>{track}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GroupChip({ group, isActive, onClick }) {
  const gradientClass = GROUP_COLORS[group.id] || 'from-zinc-600 to-zinc-700';
  const dayRange = group.days.length === 1
    ? `Día ${group.days[0]}`
    : `Días ${group.days[0]}–${group.days[group.days.length - 1]}`;

  return (
    <button
      onClick={onClick}
      className={`shrink-0 snap-start rounded-xl overflow-hidden text-left transition-all duration-200 w-44 ${
        isActive ? 'ring-2 ring-white/60 scale-[1.03]' : 'opacity-60 hover:opacity-90'
      }`}
    >
      <div className={`bg-gradient-to-br ${gradientClass} p-3.5`}>
        <div className="text-xl mb-1">{group.emoji}</div>
        <p className="text-white font-bold text-xs leading-tight">{group.name}</p>
        <p className="text-white/60 text-xs mt-1">{dayRange}</p>
      </div>
      <div className="bg-zinc-900 px-3 py-1.5">
        <span className={`text-xs ${group.tier === 'post' ? 'text-amber-400' : 'text-zinc-500'}`}>
          {group.tier === 'post' ? '● Post' : '◦ Stories'}
        </span>
      </div>
    </button>
  );
}

export function JavierPlannerView() {
  const javierData     = useItineraryStore((s) => s.javierData);
  const tripStartDate  = useItineraryStore((s) => s.tripStartDate);
  const setCurrentView = useItineraryStore((s) => s.setCurrentView);
  const setJavierUnlocked = useItineraryStore((s) => s.setJavierUnlocked);
  const [activeGroup, setActiveGroup] = useState(null);
  const [showInventory, setShowInventory] = useState(false);
  const [now, setNow] = useState(new Date());
  const groupPanelRef = useRef(null);
  const groupScrollRef = useRef(null);

  // Refresh clock every minute so status badges stay live
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const todayDayIndex = useMemo(() => {
    if (!tripStartDate) return -1;
    const start = new Date(tripStartDate);
    start.setHours(0, 0, 0, 0);
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    return Math.floor((today - start) / 86_400_000);
  }, [tripStartDate, now]);

  const groupMap = useMemo(() => {
    if (!javierData?.instagramGroups) return {};
    return Object.fromEntries(javierData.instagramGroups.map((g) => [g.id, g]));
  }, [javierData]);

  // Count how many days each clothing item is actually worn
  const usageStats = useMemo(() => {
    if (!javierData?.days) return {};
    const counts = {};
    const reg = (item) => {
      if (!item) return;
      const key = item.replace(' ⭐', '').trim().toLowerCase();
      counts[key] = (counts[key] || 0) + 1;
    };
    javierData.days.forEach(({ outfit }) => {
      if (!outfit) return;
      reg(outfit.top);
      reg(outfit.bottom);
      reg(outfit.layer);
      reg(outfit.shoes);
      reg(outfit.accessories);
      if (outfit.outfitChange?.top) reg(outfit.outfitChange.top);
    });
    return counts;
  }, [javierData]);

  const getUsage = (item) =>
    usageStats[item.replace(' ⭐', '').trim().toLowerCase()] || 0;

  const filteredDays = useMemo(() => {
    if (!javierData?.days) return [];
    if (!activeGroup) return javierData.days;
    return javierData.days.filter((d) => d.instagramGroup === activeGroup);
  }, [javierData, activeGroup]);

  const selectedGroup = activeGroup ? groupMap[activeGroup] : null;

  const handleGroupClick = (groupId) => {
    const next = activeGroup === groupId ? null : groupId;
    setActiveGroup(next);
    if (next) {
      setTimeout(() => groupPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    }
  };

  const handleDayCardGroupClick = (groupId) => {
    const next = activeGroup === groupId ? null : groupId;
    setActiveGroup(next);
    if (next) {
      setTimeout(() => groupPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    }
  };

  const handleExit = () => {
    setJavierUnlocked(false);
    setCurrentView('summary');
  };

  if (!javierData) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400 text-center">
          <div className="text-4xl mb-3">⏳</div>
          <p>Cargando planner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-zinc-950/95 backdrop-blur border-b border-zinc-800 px-4 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-white font-bold text-base sm:text-lg truncate">Travel Visual Planner</h1>
          <p className="text-zinc-500 text-xs">
            {javierData.meta?.traveler} · {javierData.meta?.totalDays} días · {javierData.meta?.totalInstagramPosts} posts
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowInventory(!showInventory)}
            className="text-xs text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 px-3 py-1.5 rounded-lg transition-colors"
          >
            👕 Ropa
          </button>
          <button
            onClick={handleExit}
            className="text-xs text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 px-3 py-1.5 rounded-lg transition-colors"
          >
            ← Volver
          </button>
        </div>
      </div>

      <div className="px-4 py-6 max-w-6xl mx-auto space-y-8">

        {/* Inventario (colapsable) */}
        {showInventory && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-base">👕 Inventario de ropa</h2>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-zinc-600 inline-block"/>0 días</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block"/>1–2</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"/>3–4</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block"/>5+</span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                ['Camisetas TOP ⭐', javierData.inventory?.camisetasTop],
                ['Camisetas secundarias', javierData.inventory?.camisetasSecundarias],
                ['Pantalones largos', javierData.inventory?.pantalonesLargos],
                ['Pantalonetas', javierData.inventory?.pantalonetas],
                ['Calzado', javierData.inventory?.calzado],
                ['Ropa frío / capas', javierData.inventory?.ropaFrio],
                ['Ropa avión', javierData.inventory?.airplaneOutfit],
                ['Interior', javierData.inventory?.interior],
              ].map(([label, items]) => (
                <div key={label} className="bg-zinc-800/50 rounded-xl p-3">
                  <p className="text-zinc-400 text-xs font-bold uppercase tracking-wide mb-2">{label}</p>
                  <ul className="space-y-1.5">
                    {items?.map((item, i) => {
                      const uses = getUsage(item);
                      const rgb = javierData.inventory?.colors?.[item];
                      return (
                        <li key={i} className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            {rgb ? (
                              <span
                                className="shrink-0 w-3.5 h-3.5 rounded-sm border border-white/15 shadow-sm"
                                style={{ backgroundColor: `rgb(${rgb})` }}
                              />
                            ) : (
                              <span className="shrink-0 w-3.5 h-3.5 rounded-sm border border-dashed border-zinc-600" />
                            )}
                            <span className="text-zinc-300 text-xs leading-snug truncate">{item}</span>
                          </div>
                          <span className={`shrink-0 text-xs font-bold px-1.5 py-0.5 rounded-full ${
                            uses === 0
                              ? 'text-zinc-600 bg-zinc-800'
                              : uses <= 2
                                ? 'text-blue-300 bg-blue-500/20'
                                : uses <= 4
                                  ? 'text-emerald-300 bg-emerald-500/20'
                                  : 'text-amber-300 bg-amber-400/20'
                          }`}>
                            {uses}d
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
            {javierData.inventory?.noLlevar?.length > 0 && (
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span className="text-red-400 text-xs font-bold">❌ No llevar:</span>
                {javierData.inventory.noLlevar.map((item, i) => (
                  <span key={i} className="text-xs text-red-300 line-through">{item}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Vuelos & Check-in */}
        {javierData.flights?.length > 0 && (
          <div>
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-3">
              ✈️ Vuelos — recordatorio check-in
            </p>
            <div className="space-y-3">
              {javierData.flights.map((flight, i) => (
                <FlightCheckInCard key={i} flight={flight} now={now} />
              ))}
            </div>
          </div>
        )}

        {/* Grupos — horizontal scroll */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
              Grupos — toca uno para filtrar y ver captions + música
            </p>
            {activeGroup && (
              <button onClick={() => setActiveGroup(null)} className="text-xs text-indigo-400 hover:text-indigo-300 shrink-0 ml-3">
                Ver todos
              </button>
            )}
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x" style={{ scrollbarWidth: 'none' }}>
            {javierData.instagramGroups?.map((group) => (
              <GroupChip
                key={group.id}
                group={group}
                isActive={activeGroup === group.id}
                onClick={() => handleGroupClick(group.id)}
              />
            ))}
          </div>
        </div>

        {/* Group Panel — captions + música del grupo seleccionado */}
        {selectedGroup && (
          <div ref={groupPanelRef}>
            <GroupPanel group={selectedGroup} />
          </div>
        )}

        {/* Days grid */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
              {selectedGroup
                ? `${selectedGroup.emoji} Días del grupo`
                : 'Todos los días'}
            </p>
            <span className="text-zinc-600 text-xs">{filteredDays.length} días</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDays.map((day) => (
              <DayCard
                key={day.day}
                dayData={day}
                group={groupMap[day.instagramGroup]}
                onSelectGroup={handleDayCardGroupClick}
                isGroupActive={activeGroup === day.instagramGroup}
                colors={javierData.inventory?.colors}
                isToday={day.day === todayDayIndex}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default JavierPlannerView;
