// Vista SummaryView - Vista de resumen general
import { useMemo } from 'react';
import { useItineraryStore } from '../store/store';
import DayCardCompact from '../components/day/DayCardCompact';
import { Button, Badge, Input, Toggle, Spinner } from '../components/ui';
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
        <div className="card p-6">
          <h3 className="text-2xl font-bold text-dark-text mb-4">📅 Calendario del Viaje</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-dark-text mb-2 block">
                Fecha de inicio:
              </label>
              <input
                type="date"
                value={format(new Date(tripStartDate), 'yyyy-MM-dd')}
                onChange={(e) => setTripStartDate(new Date(e.target.value))}
                className="input"
              />
            </div>
            <div className="bg-dark-bgTertiary rounded-lg p-4">
              <p className="text-dark-textSecondary text-sm mb-1">Duración</p>
              <p className="text-dark-text font-bold text-xl">{stats.totalDays} días</p>
              <p className="text-dark-textMuted text-sm mt-2">
                {format(new Date(tripStartDate), "d 'de' MMMM yyyy", { locale: es })} -{' '}
                {format(endDate, "d 'de' MMMM yyyy", { locale: es })}
              </p>
            </div>
          </div>
        </div>

        {/* Configuración de moneda */}
        <div className="card p-6">
          <h3 className="text-2xl font-bold text-dark-text mb-4">💱 Configuración de Moneda</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-dark-text mb-2 block">
                Tasa de cambio USD → COP:
              </label>
              <input
                type="number"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(e.target.value)}
                className="input"
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
      <div className="bg-gradient-purple rounded-xl p-6 md:p-8 shadow-dark-lg">
        <h2 className="text-3xl font-bold text-white mb-6">📊 Resumen del Viaje</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-5xl mb-2">📅</div>
            <p className="text-white/80 text-sm mb-1">Total Días</p>
            <p className="text-white font-bold text-3xl">{stats.totalDays}</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-2">🏙️</div>
            <p className="text-white/80 text-sm mb-1">Ciudades</p>
            <p className="text-white font-bold text-3xl">{stats.totalCities}</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-2">🌍</div>
            <p className="text-white/80 text-sm mb-1">Países</p>
            <p className="text-white font-bold text-3xl">{stats.totalCountries}</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-2">💰</div>
            <p className="text-white/80 text-sm mb-1">Costo Total</p>
            <p className="text-white font-bold text-2xl">{formatCost(totalCost)}</p>
          </div>
        </div>
      </div>

      {/* Timeline de ciudades */}
      <div className="card p-6">
        <h3 className="text-2xl font-bold text-dark-text mb-4">🗺️ Recorrido por Ciudades</h3>
        <div className="space-y-4">
          {citiesTimeline.map((item, index) => {
            const days = item.endDay - item.startDay + 1;
            return (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-dark-bgTertiary rounded-lg hover:bg-dark-border transition-all"
              >
                <div className="text-3xl">{index + 1}</div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-dark-text">{item.city}</h4>
                  <p className="text-dark-textSecondary text-sm">
                    Días {item.startDay} - {item.endDay} ({days} {days === 1 ? 'día' : 'días'})
                  </p>
                </div>
                <Badge variant="primary">{days}d</Badge>
              </div>
            );
          })}
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button variant="primary" onClick={() => setCurrentView('all')}>
          📅 Ver todos los días
        </Button>
        <Button variant="secondary" onClick={() => setCurrentView('day')}>
          📍 Ver día actual
        </Button>
      </div>

      {/* Vista compacta de todos los días */}
      <div>
        <h3 className="text-2xl font-bold text-dark-text mb-4">📋 Vista Rápida de Todos los Días</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {itineraryData.days.map((day) => (
            <DayCardCompact key={day.day} day={day} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SummaryView;
