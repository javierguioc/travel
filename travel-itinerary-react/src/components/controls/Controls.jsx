// Componente Controls - Barra de navegación y filtros
import { useItineraryStore } from '../../store/store';
import { Toggle } from '../ui';
import useCalendar from '../../hooks/useCalendar';

export function Controls() {
  const itineraryData = useItineraryStore((state) => state.itineraryData);
  const currentView = useItineraryStore((state) => state.currentView);
  const currentDay = useItineraryStore((state) => state.currentDay);
  const searchTerm = useItineraryStore((state) => state.searchTerm);
  const showTransportOnly = useItineraryStore((state) => state.showTransportOnly);
  const useRealisticCosts = useItineraryStore((state) => state.useRealisticCosts);
  const showRecommendations = useItineraryStore((state) => state.showRecommendations);

  const setCurrentView = useItineraryStore((state) => state.setCurrentView);
  const setCurrentDay = useItineraryStore((state) => state.setCurrentDay);
  const setSearchTerm = useItineraryStore((state) => state.setSearchTerm);
  const toggleTransportOnly = useItineraryStore((state) => state.toggleTransportOnly);
  const toggleCostMode = useItineraryStore((state) => state.toggleCostMode);
  const toggleRecommendations = useItineraryStore((state) => state.toggleRecommendations);

  const { getShortDate } = useCalendar();

  if (!itineraryData) return null;

  const days = itineraryData.days || [];

  const dayOptions = [
    { value: 'summary', label: '🏠 Resumen General' },
    { value: 'all', label: '📅 Ver todos los días' },
    { value: 'separator', label: '--- Días individuales ---', disabled: true },
    ...days.map((day) => ({
      value: `day-${day.day}`,
      label: `Día ${day.day} - ${day.city} (${getShortDate(day.day)})`,
    })),
  ];

  const handleDayChange = (e) => {
    const value = e.target.value;
    if (value === 'summary') {
      setCurrentView('summary');
    } else if (value === 'all') {
      setCurrentView('all');
    } else if (value.startsWith('day-')) {
      const dayNum = parseInt(value.split('-')[1]);
      setCurrentDay(dayNum);
    }
  };

  const getCurrentValue = () => {
    if (currentView === 'summary') return 'summary';
    if (currentView === 'all') return 'all';
    if (currentView === 'day') return `day-${currentDay}`;
    return 'summary';
  };

  return (
    <div className="bg-white rounded-xl p-4 md:p-6 shadow-card mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Navegación */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-light-text">Navegación:</label>
          <select
            value={getCurrentValue()}
            onChange={handleDayChange}
            className="select"
          >
            {dayOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Búsqueda */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-light-text">Buscar:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ciudad o actividad..."
            className="input"
          />
        </div>

        {/* Toggles */}
        <div className="flex flex-col gap-3">
          <Toggle
            checked={showTransportOnly}
            onChange={toggleTransportOnly}
            label="Solo días con traslado"
          />
          <Toggle
            checked={useRealisticCosts}
            onChange={toggleCostMode}
            label="Costos Realistas 2025"
          />
          <Toggle
            checked={showRecommendations}
            onChange={toggleRecommendations}
            label="Mostrar recomendaciones"
          />
        </div>
      </div>
    </div>
  );
}

export default Controls;
