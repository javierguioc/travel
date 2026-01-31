// Componente DayCardCompact - Tarjeta compacta de un día
import { useItineraryStore } from '../../store/store';
import { Badge } from '../ui';
import useCalendar from '../../hooks/useCalendar';
import useCurrency from '../../hooks/useCurrency';
import { calculateDayTotal } from '../../utils/calculations';
import { getCountryFlag } from '../../utils/icons';

export function DayCardCompact({ day }) {
  const setCurrentDay = useItineraryStore((state) => state.setCurrentDay);
  const useRealisticCosts = useItineraryStore((state) => state.useRealisticCosts);
  const { getShortDate } = useCalendar();
  const { formatCost } = useCurrency();

  if (!day) return null;

  const flag = getCountryFlag(day.country);
  const shortDate = getShortDate(day.day);
  const dayTotal = calculateDayTotal(day, useRealisticCosts);

  const handleClick = () => {
    setCurrentDay(day.day);
  };

  return (
    <div
      className="card-compact cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-xl font-bold text-dark-text mb-1">
            Día {day.day} - {day.city}
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" icon={flag}>
              {day.country}
            </Badge>
            <span className="text-dark-textMuted text-sm">{shortDate}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-dark-textMuted text-sm">Costo</p>
          <p className="text-purple-400 font-bold">{formatCost(dayTotal)}</p>
        </div>
      </div>

      {/* Primeras 3 actividades */}
      <div className="space-y-2">
        {day.mainActivities && day.mainActivities.slice(0, 3).map((activity, index) => (
          <div key={index} className="text-dark-textSecondary text-sm flex items-center gap-2">
            <span className="text-xs">•</span>
            <span className="truncate">{activity.name}</span>
            <Badge variant="secondary" className="text-xs">
              {activity.start}
            </Badge>
          </div>
        ))}
        {day.mainActivities && day.mainActivities.length > 3 && (
          <p className="text-dark-textMuted text-xs italic">
            +{day.mainActivities.length - 3} actividades más...
          </p>
        )}
      </div>
    </div>
  );
}

export default DayCardCompact;
