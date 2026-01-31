// Vista DayView - Vista de día individual
import { useItineraryStore } from '../store/store';
import DayCard from '../components/day/DayCard';
import DayNavigation from '../components/day/DayNavigation';
import { Spinner } from '../components/ui';

export function DayView() {
  const itineraryData = useItineraryStore((state) => state.itineraryData);
  const currentDay = useItineraryStore((state) => state.currentDay);

  if (!itineraryData) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  const day = itineraryData.days?.find((d) => d.day === currentDay);

  if (!day) {
    return (
      <div className="text-center py-12">
        <p className="text-dark-textMuted text-lg">Día no encontrado</p>
      </div>
    );
  }

  return (
    <div>
      <DayNavigation />
      <DayCard day={day} />
      <div className="mt-6">
        <DayNavigation />
      </div>
    </div>
  );
}

export default DayView;
