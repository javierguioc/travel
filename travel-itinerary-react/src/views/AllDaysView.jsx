// Vista AllDaysView - Vista de todos los días
import { useState, useMemo } from 'react';
import { useItineraryStore } from '../store/store';
import DayCardCompact from '../components/day/DayCardCompact';
import { Button, Badge, Spinner } from '../components/ui';
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
      <div className="bg-gradient-purple rounded-xl p-6 md:p-8 shadow-dark-lg mb-6">
        <h2 className="text-3xl font-bold text-white mb-4">📅 Todos los Días</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-white/80 text-sm">Total Días</p>
            <p className="text-white font-bold text-2xl">{stats.totalDays}</p>
          </div>
          <div className="text-center">
            <p className="text-white/80 text-sm">Ciudades</p>
            <p className="text-white font-bold text-2xl">{stats.totalCities}</p>
          </div>
          <div className="text-center">
            <p className="text-white/80 text-sm">Países</p>
            <p className="text-white font-bold text-2xl">{stats.totalCountries}</p>
          </div>
          <div className="text-center">
            <p className="text-white/80 text-sm">Costo Total</p>
            <p className="text-white font-bold text-2xl">{formatCost(totalCost)}</p>
          </div>
        </div>
      </div>

      {/* Filtros por ciudad */}
      <div className="mb-6">
        <p className="text-dark-text font-semibold mb-3">Filtrar por ciudad:</p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCity === null ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedCity(null)}
          >
            Todas
          </Button>
          {cities.map((city) => (
            <Button
              key={city}
              variant={selectedCity === city ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedCity(city)}
            >
              {city}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid de días */}
      {displayDays.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-dark-textMuted text-lg">No se encontraron días</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayDays.map((day) => (
            <DayCardCompact key={day.day} day={day} />
          ))}
        </div>
      )}
    </div>
  );
}

export default AllDaysView;
