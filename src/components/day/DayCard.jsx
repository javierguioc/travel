// Componente DayCard - Tarjeta completa de un día
import { useState } from 'react';
import { useItineraryStore } from '../../store/store';
import ActivityCard from '../activity/ActivityCard';
import TransportCard from '../transport/TransportCard';
import CostBreakdown from '../costs/CostBreakdown';
import useCalendar from '../../hooks/useCalendar';
import { getCountryFlag } from '../../utils/icons';

// Bloque de clima expandible
function WeatherBlock({ weather }) {
  const [open, setOpen] = useState(false);

  const rainColor =
    weather.rainChance?.toLowerCase().includes('muy baja') ? 'text-green-600 bg-green-50' :
    weather.rainChance?.toLowerCase().includes('baja') ? 'text-emerald-600 bg-emerald-50' :
    weather.rainChance?.toLowerCase().includes('moderada') ? 'text-amber-600 bg-amber-50' :
    'text-red-600 bg-red-50';

  const tempEmoji = weather.tempHighC >= 25 ? '☀️' : weather.tempHighC >= 18 ? '⛅' : '🌥️';

  return (
    <div className="mb-6 bg-gradient-to-r from-sky-50 to-blue-50 border-l-4 border-sky-400 rounded-r-xl shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-4 flex items-center gap-3 hover:bg-sky-100/50 transition-colors"
      >
        <div className="bg-gradient-to-br from-sky-400 to-blue-500 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
          <span className="text-xl">{tempEmoji}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-sky-800 text-lg">
              {weather.tempHighC}°C / {weather.tempLowC}°C
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${rainColor}`}>
              🌧 {weather.rainChance}
            </span>
          </div>
          <p className="text-sky-700 text-sm truncate">{weather.conditions}</p>
        </div>
        <span className="text-sky-400 text-sm flex-shrink-0">{open ? '▲' : '▼ Ropa'}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-sky-200/60">
          <p className="text-sky-800 font-semibold text-sm mb-2 flex items-center gap-2">
            👕 Recomendaciones de ropa
          </p>
          <ul className="space-y-1.5">
            {weather.clothingTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-sky-900/80">
                <span className="text-sky-400 mt-0.5 flex-shrink-0">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Colores por país para dar variedad visual
const countryGradients = {
  'España': 'from-red-500 to-yellow-500',
  'Francia': 'from-blue-600 to-red-500',
  'Países Bajos': 'from-orange-500 to-blue-600',
  'Suiza': 'from-red-600 to-gray-100',
  'Italia': 'from-green-500 to-red-500',
};

export function DayCard({ day }) {
  const { getFormattedDate } = useCalendar();
  const [imageError, setImageError] = useState(false);
  const editMode = useItineraryStore((state) => state.editMode);
  const addActivity = useItineraryStore((state) => state.addActivity);

  if (!day) return null;

  const flag = getCountryFlag(day.country);
  const formattedDate = getFormattedDate(day.day);

  // Fallback: usar primera actividad con imagen si no hay heroImageUrl
  const firstActivityWithImage = day.mainActivities?.find(a => a.imageUrl);
  const imageUrl = day.heroImageUrl || firstActivityWithImage?.imageUrl;
  const hasImage = imageUrl && !imageError;

  const gradient = countryGradients[day.country] || 'from-blue-500 to-indigo-600';

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden animate-fade-in-up hover:shadow-elevated transition-shadow duration-300">
      {/* Hero Image with overlay */}
      <div className="relative">
        {hasImage ? (
          <div className="w-full h-48 sm:h-64 md:h-72 overflow-hidden bg-light-bgTertiary">
            <img
              src={imageUrl}
              alt={day.city}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={() => setImageError(true)}
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
        ) : (
          /* Gradient fallback when no image */
          <div className={`w-full h-32 sm:h-40 bg-gradient-to-r ${gradient}`}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        )}

        {/* Header info positioned on image */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-800 shadow-sm`}>
              {flag} {day.country}
            </span>
            {day.stayArea && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/90 text-white">
                📍 {day.stayArea}
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
            Día {day.day} - {day.city}
          </h2>
          <p className="text-white/90 text-sm sm:text-base mt-1 drop-shadow">{formattedDate}</p>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Weather */}
        {day.weather && <WeatherBlock weather={day.weather} />}

        {/* Perks */}
        {day.perks && day.perks.length > 0 && (
          <div className="mb-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 p-4 rounded-r-xl shadow-sm">
            <p className="text-amber-800 font-semibold mb-2 flex items-center gap-2">
              <span className="bg-amber-400 w-7 h-7 rounded-full flex items-center justify-center text-white">💡</span>
              Consejos del día
            </p>
            <ul className="text-amber-900/80 space-y-1.5 text-sm sm:text-base ml-9">
              {day.perks.map((perk, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Accommodation Section */}
        {day.accommodation && (
          <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-400 p-4 rounded-r-xl shadow-sm">
            <div className="flex items-start gap-3">
              <div className="bg-gradient-to-br from-indigo-400 to-purple-500 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                <span className="text-xl">🏨</span>
              </div>
              <div className="flex-1">
                <h4 className="text-indigo-800 font-semibold">Hospedaje de esta noche</h4>
                <p className="text-indigo-700 font-medium">{day.accommodation.name}</p>
                {day.accommodation.neighborhood && (
                  <p className="text-indigo-600/80 text-sm">📍 Barrio: {day.accommodation.neighborhood}</p>
                )}
                {day.accommodation.notes && (
                  <p className="text-indigo-600/70 text-sm mt-1">{day.accommodation.notes}</p>
                )}
                {day.accommodation.link && (
                  <a
                    href={day.accommodation.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mt-2 inline-flex items-center gap-1"
                  >
                    🔗 Ver reserva →
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Activities Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-xl">📍</span>
            </div>
            <h3 className="text-xl sm:text-2xl text-light-text font-bold">Actividades</h3>
            <span className="ml-auto text-sm text-light-textMuted bg-light-bgSecondary px-3 py-1 rounded-full">
              {day.mainActivities?.length || 0} actividades
            </span>
          </div>
          <div className="space-y-4">
            {day.mainActivities && day.mainActivities.map((activity, index) => (
              <ActivityCard
                key={index}
                activity={activity}
                cityName={day.city}
                dayNum={day.day}
                activityIndex={index}
              />
            ))}
          </div>
          {/* Add activity button in edit mode */}
          {editMode && (
            <button
              onClick={() => addActivity(day.day)}
              className="mt-4 w-full py-3 border-2 border-dashed border-blue-300 rounded-xl text-blue-600 font-semibold hover:bg-blue-50 hover:border-blue-400 transition-all duration-200"
            >
              + Agregar actividad
            </button>
          )}
        </div>

        {/* Transport to Next Day */}
        {day.transportToNext && day.transportToNext.mode && (
          <div className="mb-6">
            <TransportCard transport={day.transportToNext} transportOptions={day.transportOptions} />
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
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
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
