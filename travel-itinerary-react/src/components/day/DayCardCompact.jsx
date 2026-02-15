// Componente DayCardCompact - Tarjeta compacta de un día
import { useState } from 'react';
import { useItineraryStore } from '../../store/store';
import useCalendar from '../../hooks/useCalendar';
import useCurrency from '../../hooks/useCurrency';
import { calculateDayTotal } from '../../utils/calculations';
import { getCountryFlag, getActivityIcon } from '../../utils/icons';
import { isTransportActivity, getTransportType } from '../../utils/transport';

// Componente para imagen de actividad con fallback
function ActivityImage({ activity, icon }) {
  const [error, setError] = useState(false);

  if (!activity.imageUrl || error) {
    return (
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
        <span className="text-sm">{icon}</span>
      </div>
    );
  }

  return (
    <img
      src={activity.imageUrl}
      alt={activity.name}
      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
      loading="lazy"
      onError={() => setError(true)}
    />
  );
}

export function DayCardCompact({ day }) {
  const [imageError, setImageError] = useState(false);
  const setCurrentDay = useItineraryStore((state) => state.setCurrentDay);
  const setCurrentView = useItineraryStore((state) => state.setCurrentView);
  const useRealisticCosts = useItineraryStore((state) => state.useRealisticCosts);
  const { getShortDate } = useCalendar();
  const { formatCost } = useCurrency();

  if (!day) return null;

  const flag = getCountryFlag(day.country);
  const shortDate = getShortDate(day.day);
  const dayTotal = calculateDayTotal(day, useRealisticCosts);

  // Fallback: usar primera actividad con imagen si no hay heroImageUrl
  const firstActivityWithImage = day.mainActivities?.find(a => a.imageUrl);
  const imageUrl = day.heroImageUrl || firstActivityWithImage?.imageUrl;
  const hasImage = imageUrl && !imageError;

  const handleClick = () => {
    setCurrentDay(day.day);
    setCurrentView('day');
  };

  // Colores por país para dar variedad
  const countryColors = {
    'España': 'from-red-500 to-yellow-500',
    'Francia': 'from-blue-500 to-red-500',
    'Países Bajos': 'from-orange-500 to-blue-600',
    'Suiza': 'from-red-600 to-white',
    'Italia': 'from-green-500 to-red-500',
  };
  const gradientColor = countryColors[day.country] || 'from-blue-500 to-indigo-600';

  // Contar transportes
  const transportCount = day.mainActivities?.filter(a => isTransportActivity(a.name)).length || 0;

  return (
    <div
      className="group bg-white rounded-xl shadow-card overflow-hidden hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-light-border"
      onClick={handleClick}
    >
      {/* Header con imagen pequeña */}
      <div className="relative h-28 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
        {hasImage ? (
          <>
            <img
              src={imageUrl}
              alt={day.city}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradientColor} opacity-90`}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}

        {/* Info sobre imagen */}
        <div className="absolute inset-0 p-3 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="bg-white/95 text-slate-800 px-2 py-1 rounded-md text-xs font-bold shadow">
              Día {day.day}
            </span>
            <span className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-bold shadow">
              {formatCost(dayTotal)}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white drop-shadow-lg leading-tight">
              {day.city}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-sm">{flag}</span>
              <span className="text-white/90 text-xs">{shortDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actividades con imágenes */}
      <div className="p-3">
        <div className="space-y-2">
          {day.mainActivities && day.mainActivities.slice(0, 4).map((activity, index) => {
            const isTransport = isTransportActivity(activity.name);

            if (isTransport) {
              const transportInfo = getTransportType(activity.name, activity.notes);
              return (
                <div key={index} className="flex items-center gap-2 p-1.5 rounded-lg bg-emerald-50">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">{transportInfo.emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-700 truncate">{activity.name}</p>
                    <p className="text-xs text-emerald-600">{activity.start} • {transportInfo.label}</p>
                  </div>
                </div>
              );
            }

            const icon = getActivityIcon(activity.name);
            return (
              <div key={index} className="flex items-center gap-2">
                <ActivityImage activity={activity} icon={icon} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 truncate">{activity.name}</p>
                  <p className="text-xs text-slate-400">{activity.start}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer con resumen */}
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>📍 {day.mainActivities?.length || 0} actividades</span>
            {transportCount > 0 && <span>• 🚌 {transportCount}</span>}
          </div>
          {day.mainActivities && day.mainActivities.length > 4 && (
            <span className="text-blue-600 text-xs font-semibold">
              +{day.mainActivities.length - 4} más
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default DayCardCompact;
