// Componente DayCard - Tarjeta completa de un día
import { Badge } from '../ui';
import ActivityCard from '../activity/ActivityCard';
import TransportCard from '../transport/TransportCard';
import CostBreakdown from '../costs/CostBreakdown';
import useCalendar from '../../hooks/useCalendar';
import { getCountryFlag } from '../../utils/icons';

export function DayCard({ day }) {
  const { getFormattedDate } = useCalendar();

  if (!day) return null;

  const flag = getCountryFlag(day.country);
  const formattedDate = getFormattedDate(day.day);

  return (
    <div className="card p-0 overflow-hidden animate-fade-in-up">
      {/* Hero Image */}
      {day.heroImageUrl && (
        <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden bg-dark-bgTertiary">
          <img
            src={day.heroImageUrl}
            alt={day.city}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      )}

      <div className="p-responsive">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
            <h2 className="text-responsive-2xl text-dark-text">
              Día {day.day} - {day.city}
            </h2>
            <Badge variant="secondary" icon={flag}>
              {day.country}
            </Badge>
          </div>

          <p className="text-dark-textSecondary text-responsive-base mb-2">{formattedDate}</p>

          {day.stayArea && (
            <Badge variant="info" icon="📍">
              {day.stayArea}
            </Badge>
          )}
        </div>

        {/* Perks */}
        {day.perks && day.perks.length > 0 && (
          <div className="mb-6 bg-yellow-900/20 border-l-4 border-yellow-500 p-3 sm:p-4 rounded-r-lg">
            <p className="text-dark-text font-semibold mb-2 text-responsive-sm">💡 Consejos del día:</p>
            <ul className="list-disc list-inside text-dark-textSecondary space-y-1 text-sm sm:text-base">
              {day.perks.map((perk, index) => (
                <li key={index}>{perk}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Activities */}
        <div className="mb-6">
          <h3 className="text-responsive-xl text-dark-text mb-4">📍 Actividades</h3>
          <div className="space-y-3 sm:space-y-4">
            {day.mainActivities && day.mainActivities.map((activity, index) => (
              <ActivityCard key={index} activity={activity} cityName={day.city} />
            ))}
          </div>
        </div>

        {/* Transport to Next Day */}
        {day.transportToNext && day.transportToNext.mode && (
          <div className="mb-6">
            <TransportCard transport={day.transportToNext} />
          </div>
        )}

        {/* Costs */}
        <CostBreakdown day={day} />

        {/* Map Link */}
        {day.mapPoints && day.mapPoints.length > 0 && (
          <div className="mt-6 text-center">
            <a
              href={`https://www.google.com/maps/dir/${day.mapPoints.join('/')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 btn-secondary"
            >
              🗺️ Ver ruta en Google Maps
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default DayCard;
