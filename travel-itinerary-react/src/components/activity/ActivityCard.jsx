// Componente ActivityCard - Tarjeta de actividad individual
import { Badge } from '../ui';
import { getActivityIcon } from '../../utils/icons';
import { isTransportActivity, getTransportType } from '../../utils/transport';

export function ActivityCard({ activity, cityName }) {
  const isTransport = isTransportActivity(activity.name);

  if (isTransport) {
    const transportInfo = getTransportType(activity.name, activity.notes);
    return (
      <div className="bg-dark-bgTertiary border-l-4 border-green-500 rounded-r-lg p-3 sm:p-4 hover:bg-dark-border transition-all duration-200">
        <div className="flex flex-col sm:flex-row items-start gap-3">
          <div className="text-3xl sm:text-4xl flex-shrink-0">{transportInfo.emoji}</div>
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
              <h4 className="text-base sm:text-lg font-semibold text-dark-text">{activity.name}</h4>
              <Badge variant="success" icon="🕐" className="self-start">
                {activity.start} • {activity.durationMin}min
              </Badge>
            </div>
            {activity.notes && (
              <p className="text-dark-textSecondary text-sm mb-2 leading-relaxed">{activity.notes}</p>
            )}
            {activity.link && (
              <a
                href={activity.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 text-sm underline inline-block"
              >
                🔗 Ver detalles
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  const icon = getActivityIcon(activity.name);

  return (
    <div className="bg-dark-bgTertiary border-l-4 border-purple-600 rounded-r-lg p-3 sm:p-4 hover:bg-dark-border transition-all duration-200">
      <div className="flex flex-col sm:flex-row items-start gap-3">
        <div className="text-2xl sm:text-3xl flex-shrink-0">{icon}</div>
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
            <h4 className="text-base sm:text-lg font-semibold text-dark-text">{activity.name}</h4>
            <Badge variant="primary" icon="🕐" className="self-start">
              {activity.start} • {activity.durationMin}min
            </Badge>
          </div>
          {activity.notes && (
            <p className="text-dark-textSecondary text-sm mb-2 leading-relaxed">{activity.notes}</p>
          )}
          {activity.link && (
            <a
              href={activity.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 text-sm underline inline-block"
            >
              🔗 Ver más información
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActivityCard;
