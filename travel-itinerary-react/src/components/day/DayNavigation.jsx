// Componente DayNavigation - Navegación entre días
import { useItineraryStore } from '../../store/store';
import { Button } from '../ui';

export function DayNavigation() {
  const currentDay = useItineraryStore((state) => state.currentDay);
  const itineraryData = useItineraryStore((state) => state.itineraryData);
  const setCurrentDay = useItineraryStore((state) => state.setCurrentDay);

  if (!itineraryData) return null;

  const totalDays = itineraryData.days?.length || 0;
  const prevDay = itineraryData.days?.find((d) => d.day === currentDay - 1);
  const nextDay = itineraryData.days?.find((d) => d.day === currentDay + 1);

  return (
    <div className="flex items-center justify-between gap-4 mb-6 bg-dark-bgSecondary rounded-lg p-4">
      <Button
        variant="secondary"
        icon="←"
        onClick={() => setCurrentDay(currentDay - 1)}
        disabled={currentDay <= 1}
        className="min-w-[120px]"
      >
        {prevDay ? prevDay.city : 'Anterior'}
      </Button>

      <div className="text-center">
        <p className="text-dark-textMuted text-sm">Día actual</p>
        <p className="text-dark-text font-bold text-xl">
          {currentDay} de {totalDays}
        </p>
      </div>

      <Button
        variant="secondary"
        icon="→"
        onClick={() => setCurrentDay(currentDay + 1)}
        disabled={currentDay >= totalDays}
        className="min-w-[120px] flex-row-reverse"
      >
        {nextDay ? nextDay.city : 'Siguiente'}
      </Button>
    </div>
  );
}

export default DayNavigation;
