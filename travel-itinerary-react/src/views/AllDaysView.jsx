// Vista AllDaysView - Vista de todos los días
import { useState, useMemo } from 'react';
import { useItineraryStore } from '../store/store';
import DayCardCompact from '../components/day/DayCardCompact';
import { Button, Spinner } from '../components/ui';
import useSearch from '../hooks/useSearch';
import useCurrency from '../hooks/useCurrency';
import { calculateTripStats } from '../utils/calculations';

export function AllDaysView() {
  const itineraryData = useItineraryStore((state) => state.itineraryData);
  const useRealisticCosts = useItineraryStore((state) => state.useRealisticCosts);
  const { filteredDays } = useSearch();
  const { formatCost } = useCurrency();

  const [selectedCity, setSelectedCity] = useState(null);

  const stats = useMemo(() => {
    if (!itineraryData) return null;
    return calculateTripStats(itineraryData);
  }, [itineraryData]);

  const cities = useMemo(() => {
    if (!itineraryData || !itineraryData.days) return [];
    const uniqueCities = [...new Set(itineraryData.days.map((d) => d.city))];
    return uniqueCities;
  }, [itineraryData]);

  const displayDays = useMemo(() => {
    if (!selectedCity) return filteredDays;
    return filteredDays.filter((day) => day.city === selectedCity);
  }, [filteredDays, selectedCity]);

  if (!itineraryData) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  const totalCost = useRealisticCosts ? stats.totalCostReal : stats.totalCostBase;

  return (
    <div>
      {/* Header con estadísticas */}
      <div className="bg-gradient-blue rounded-2xl p-6 md:p-8 shadow-elevated mb-6">
        <h2 className="text-3xl font-bold text-white mb-4">📅 Todos los Días</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center bg-white/10 rounded-xl p-3">
            <p className="text-white/80 text-sm">Total Días</p>
            <p className="text-white font-bold text-2xl">{stats.totalDays}</p>
          </div>
          <div className="text-center bg-white/10 rounded-xl p-3">
            <p className="text-white/80 text-sm">Ciudades</p>
            <p className="text-white font-bold text-2xl">{stats.totalCities}</p>
          </div>
          <div className="text-center bg-white/10 rounded-xl p-3">
            <p className="text-white/80 text-sm">Países</p>
            <p className="text-white font-bold text-2xl">{stats.totalCountries}</p>
          </div>
          <div className="text-center bg-white/10 rounded-xl p-3">
            <p className="text-white/80 text-sm">Costo Total</p>
            <p className="text-white font-bold text-2xl">{formatCost(totalCost)}</p>
          </div>
        </div>
      </div>

      {/* Filtros por ciudad */}
      <div className="mb-6 bg-white rounded-xl p-4 shadow-sm border border-light-border">
        <p className="text-light-text font-semibold mb-3 flex items-center gap-2">
          <span className="bg-gradient-to-br from-blue-500 to-indigo-600 w-7 h-7 rounded-lg flex items-center justify-center">
            <span className="text-sm">🏙️</span>
          </span>
          Filtrar por ciudad:
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCity(null)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              selectedCity === null
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                : 'bg-light-bgTertiary text-light-textSecondary hover:bg-light-border'
            }`}
          >
            Todas ({itineraryData.days.length})
          </button>
          {cities.map((city) => {
            const cityDays = itineraryData.days.filter(d => d.city === city).length;
            return (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  selectedCity === city
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                    : 'bg-light-bgTertiary text-light-textSecondary hover:bg-light-border'
                }`}
              >
                {city} ({cityDays})
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de días */}
      {displayDays.length === 0 ? (
        <div className="text-center py-12 bg-light-bgTertiary rounded-xl">
          <div className="text-5xl mb-3">🔍</div>
          <p className="text-light-textMuted text-lg">No se encontraron días</p>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <p className="text-light-textSecondary font-medium">
              Mostrando <span className="text-light-text font-bold">{displayDays.length}</span> días
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayDays.map((day) => (
              <DayCardCompact key={day.day} day={day} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AllDaysView;
