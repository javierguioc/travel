import { useMemo } from 'react';
import { useItineraryStore } from '../store/store';
import { isTransportActivity } from '../utils/transport';

export function useSearch() {
  const itineraryData = useItineraryStore((state) => state.itineraryData);
  const searchTerm = useItineraryStore((state) => state.searchTerm);
  const showTransportOnly = useItineraryStore((state) => state.showTransportOnly);

  const filteredDays = useMemo(() => {
    if (!itineraryData || !itineraryData.days) return [];

    let days = [...itineraryData.days];

    // Filtrar por término de búsqueda
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      days = days.filter((day) => {
        // Buscar en ciudad, país
        if (day.city.toLowerCase().includes(term)) return true;
        if (day.country.toLowerCase().includes(term)) return true;

        // Buscar en actividades
        return day.mainActivities.some((activity) =>
          activity.name.toLowerCase().includes(term) ||
          activity.notes.toLowerCase().includes(term)
        );
      });
    }

    // Filtrar por solo transportes
    if (showTransportOnly) {
      days = days.filter((day) =>
        day.mainActivities.some((activity) =>
          isTransportActivity(activity.name)
        ) || (day.transportToNext && day.transportToNext.mode)
      );
    }

    return days;
  }, [itineraryData, searchTerm, showTransportOnly]);

  return {
    filteredDays,
    hasFilters: searchTerm || showTransportOnly,
  };
}

export default useSearch;
