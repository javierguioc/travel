// Vista SummaryView - Vista de resumen general
import { useMemo } from 'react';
import { useItineraryStore } from '../store/store';
import DayCardCompact from '../components/day/DayCardCompact';
import { Button, Badge, Toggle, Spinner } from '../components/ui';
import useCurrency from '../hooks/useCurrency';
import useCalendar from '../hooks/useCalendar';
import { calculateTripStats } from '../utils/calculations';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function SummaryView() {
  const itineraryData = useItineraryStore((state) => state.itineraryData);
  const useRealisticCosts = useItineraryStore((state) => state.useRealisticCosts);
  const tripStartDate = useItineraryStore((state) => state.tripStartDate);
  const setTripStartDate = useItineraryStore((state) => state.setTripStartDate);
  const exchangeRate = useItineraryStore((state) => state.exchangeRate);
  const setExchangeRate = useItineraryStore((state) => state.setExchangeRate);
  const showCOPConversion = useItineraryStore((state) => state.showCOPConversion);
  const toggleCOPConversion = useItineraryStore((state) => state.toggleCOPConversion);
  const setCurrentView = useItineraryStore((state) => state.setCurrentView);

  const { formatCost } = useCurrency();
  const { calculateDayDate } = useCalendar();

  const stats = useMemo(() => {
    if (!itineraryData) return null;
    return calculateTripStats(itineraryData);
  }, [itineraryData]);

  const citiesTimeline = useMemo(() => {
    if (!itineraryData || !itineraryData.days) return [];

    const timeline = [];
    let currentCity = null;
    let startDay = null;

    itineraryData.days.forEach((day, index) => {
      if (day.city !== currentCity) {
        if (currentCity) {
          timeline.push({
            city: currentCity,
            startDay,
            endDay: itineraryData.days[index - 1].day,
          });
        }
        currentCity = day.city;
        startDay = day.day;
      }

      if (index === itineraryData.days.length - 1) {
        timeline.push({
          city: currentCity,
          startDay,
          endDay: day.day,
        });
      }
    });

    return timeline;
  }, [itineraryData]);

  if (!itineraryData) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  const totalCost = useRealisticCosts ? stats.totalCostReal : stats.totalCostBase;
  const lastDay = itineraryData.days[itineraryData.days.length - 1];
  const endDate = calculateDayDate(lastDay.day);

  return (
    <div className="space-y-6">
      {/* Calendario y configuración */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendario */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 shadow-card border border-indigo-100">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-2xl">📅</span>
            </div>
            <h3 className="text-2xl font-bold text-light-text">Calendario del Viaje</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-indigo-700 mb-2 block">
                Fecha de inicio:
              </label>
              <input
                type="date"
                value={format(new Date(tripStartDate), 'yyyy-MM-dd')}
                onChange={(e) => setTripStartDate(new Date(e.target.value))}
                className="input border-indigo-200 focus:border-indigo-400 focus:ring-indigo-300"
              />
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm">
              <p className="text-indigo-600 text-sm font-medium mb-1">Duración</p>
              <p className="text-light-text font-bold text-2xl">{stats.totalDays} días</p>
              <p className="text-light-textMuted text-sm mt-2">
                {format(new Date(tripStartDate), "d 'de' MMMM yyyy", { locale: es })} -{' '}
                {format(endDate, "d 'de' MMMM yyyy", { locale: es })}
              </p>
            </div>
          </div>
        </div>

        {/* Configuración de moneda */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 shadow-card border border-emerald-100">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-2xl">💱</span>
            </div>
            <h3 className="text-2xl font-bold text-light-text">Configuración de Moneda</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-emerald-700 mb-2 block">
                Tasa de cambio USD → COP:
              </label>
              <input
                type="number"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(e.target.value)}
                className="input border-emerald-200 focus:border-emerald-400 focus:ring-emerald-300"
                step="100"
              />
            </div>
            <Toggle
              checked={showCOPConversion}
              onChange={toggleCOPConversion}
              label="Mostrar conversión a pesos colombianos"
            />
          </div>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="bg-gradient-blue rounded-2xl p-6 md:p-8 shadow-elevated">
        <h2 className="text-3xl font-bold text-white mb-6">📊 Resumen del Viaje</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center bg-white/10 rounded-xl p-4">
            <div className="text-4xl mb-2">📅</div>
            <p className="text-white/80 text-sm mb-1">Total Días</p>
            <p className="text-white font-bold text-3xl">{stats.totalDays}</p>
          </div>
          <div className="text-center bg-white/10 rounded-xl p-4">
            <div className="text-4xl mb-2">🏙️</div>
            <p className="text-white/80 text-sm mb-1">Ciudades</p>
            <p className="text-white font-bold text-3xl">{stats.totalCities}</p>
          </div>
          <div className="text-center bg-white/10 rounded-xl p-4">
            <div className="text-4xl mb-2">🌍</div>
            <p className="text-white/80 text-sm mb-1">Países</p>
            <p className="text-white font-bold text-3xl">{stats.totalCountries}</p>
          </div>
          <div className="text-center bg-white/10 rounded-xl p-4">
            <div className="text-4xl mb-2">💰</div>
            <p className="text-white/80 text-sm mb-1">Costo Total</p>
            <p className="text-white font-bold text-2xl">{formatCost(totalCost)}</p>
          </div>
        </div>
      </div>

      {/* Timeline de ciudades - Compacto */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-light-border">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🗺️</span>
          <h3 className="text-sm font-bold text-light-text">Recorrido</h3>
          <span className="ml-auto text-xs text-light-textMuted bg-light-bgTertiary px-2 py-0.5 rounded-full">
            {citiesTimeline.length} destinos · {stats.totalDays} días
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {citiesTimeline.map((item, index) => {
            const days = item.endDay - item.startDay + 1;
            const dayLabel = item.startDay === item.endDay
              ? `Día ${item.startDay}`
              : `Días ${item.startDay}–${item.endDay}`;
            return (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-light-bgTertiary rounded-full text-sm hover:bg-light-border transition-colors"
                title={dayLabel}
              >
                <span className="text-blue-500 font-bold text-xs">{dayLabel}</span>
                <span className="font-medium text-light-text">{item.city}</span>
                <span className="text-light-textMuted text-xs">({days}d)</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => setCurrentView('all')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
        >
          📅 Ver todos los días
        </button>
        <button
          onClick={() => setCurrentView('day')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-light-text font-semibold rounded-xl shadow-md border border-light-border hover:shadow-lg hover:bg-light-bgTertiary transition-all duration-200"
        >
          📍 Ver día actual
        </button>
      </div>

      {/* Vista compacta de todos los días */}
      <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-gradient-to-br from-slate-500 to-gray-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-2xl">📋</span>
          </div>
          <h3 className="text-2xl font-bold text-light-text">Vista Rápida de Todos los Días</h3>
          <span className="ml-auto bg-white px-3 py-1 rounded-full text-sm font-semibold text-light-textSecondary shadow-sm">
            {itineraryData.days.length} días
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {itineraryData.days.map((day) => (
            <DayCardCompact key={day.day} day={day} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SummaryView;
