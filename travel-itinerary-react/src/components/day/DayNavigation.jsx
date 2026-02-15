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

  const progress = (currentDay / totalDays) * 100;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-card border border-light-border mb-6">
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => setCurrentDay(currentDay - 1)}
          disabled={currentDay <= 1}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
            currentDay <= 1
              ? 'bg-light-bgTertiary text-light-textMuted cursor-not-allowed'
              : 'bg-gradient-to-r from-slate-100 to-gray-100 text-light-text hover:shadow-md hover:scale-105'
          }`}
        >
          <span>←</span>
          <span className="hidden sm:inline">{prevDay ? prevDay.city : 'Anterior'}</span>
        </button>

        <div className="flex-1 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">{currentDay}</span>
            </div>
            <div className="text-left">
              <p className="text-light-textMuted text-xs font-medium uppercase tracking-wide">Día actual</p>
              <p className="text-light-text font-bold">
                {currentDay} de {totalDays}
              </p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-light-bgTertiary rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          onClick={() => setCurrentDay(currentDay + 1)}
          disabled={currentDay >= totalDays}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
            currentDay >= totalDays
              ? 'bg-light-bgTertiary text-light-textMuted cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-md hover:scale-105'
          }`}
        >
          <span className="hidden sm:inline">{nextDay ? nextDay.city : 'Siguiente'}</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}

export default DayNavigation;
