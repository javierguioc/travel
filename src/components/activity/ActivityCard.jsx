// Componente ActivityCard - Tarjeta de actividad individual
import { useState } from 'react';
import { useItineraryStore } from '../../store/store';
import { getActivityIcon } from '../../utils/icons';
import { isTransportActivity, getTransportType } from '../../utils/transport';

// Detectar categoría de actividad para aplicar colores temáticos
function getActivityCategory(name) {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('desayuno') || nameLower.includes('almuerzo') || nameLower.includes('cena') ||
      nameLower.includes('comida') || nameLower.includes('restaurante') || nameLower.includes('café') ||
      nameLower.includes('brunch') || nameLower.includes('tapas') || nameLower.includes('gelato')) {
    return 'food';
  }
  if (nameLower.includes('museo') || nameLower.includes('galería') || nameLower.includes('arte') ||
      nameLower.includes('teatro') || nameLower.includes('ópera') || nameLower.includes('catedral') ||
      nameLower.includes('basílica') || nameLower.includes('iglesia') || nameLower.includes('capilla')) {
    return 'culture';
  }
  if (nameLower.includes('mirador') || nameLower.includes('torre') || nameLower.includes('vista') ||
      nameLower.includes('parque') || nameLower.includes('jardín') || nameLower.includes('lago') ||
      nameLower.includes('montaña') || nameLower.includes('playa') || nameLower.includes('paseo')) {
    return 'nature';
  }
  if (nameLower.includes('compras') || nameLower.includes('shopping') || nameLower.includes('mercado') ||
      nameLower.includes('tienda') || nameLower.includes('outlet')) {
    return 'shopping';
  }
  if (nameLower.includes('hotel') || nameLower.includes('check') || nameLower.includes('alojamiento')) {
    return 'accommodation';
  }
  return 'sightseeing';
}

// Colores por categoría
const categoryStyles = {
  food: {
    bg: 'bg-gradient-to-br from-orange-50 to-amber-50',
    border: 'border-l-4 border-orange-400',
    iconBg: 'bg-gradient-to-br from-orange-400 to-amber-500',
    accent: 'text-orange-600 hover:text-orange-700',
    badge: 'bg-orange-100 text-orange-700',
  },
  culture: {
    bg: 'bg-gradient-to-br from-purple-50 to-indigo-50',
    border: 'border-l-4 border-purple-400',
    iconBg: 'bg-gradient-to-br from-purple-400 to-indigo-500',
    accent: 'text-purple-600 hover:text-purple-700',
    badge: 'bg-purple-100 text-purple-700',
  },
  nature: {
    bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
    border: 'border-l-4 border-green-400',
    iconBg: 'bg-gradient-to-br from-green-400 to-emerald-500',
    accent: 'text-green-600 hover:text-green-700',
    badge: 'bg-green-100 text-green-700',
  },
  shopping: {
    bg: 'bg-gradient-to-br from-pink-50 to-rose-50',
    border: 'border-l-4 border-pink-400',
    iconBg: 'bg-gradient-to-br from-pink-400 to-rose-500',
    accent: 'text-pink-600 hover:text-pink-700',
    badge: 'bg-pink-100 text-pink-700',
  },
  accommodation: {
    bg: 'bg-gradient-to-br from-slate-50 to-gray-100',
    border: 'border-l-4 border-slate-400',
    iconBg: 'bg-gradient-to-br from-slate-400 to-gray-500',
    accent: 'text-slate-600 hover:text-slate-700',
    badge: 'bg-slate-100 text-slate-700',
  },
  sightseeing: {
    bg: 'bg-gradient-to-br from-blue-50 to-sky-50',
    border: 'border-l-4 border-blue-400',
    iconBg: 'bg-gradient-to-br from-blue-400 to-sky-500',
    accent: 'text-blue-600 hover:text-blue-700',
    badge: 'bg-blue-100 text-blue-700',
  },
};

export function ActivityCard({ activity, cityName, dayNum, activityIndex }) {
  const [imageError, setImageError] = useState(false);
  const editMode = useItineraryStore((state) => state.editMode);
  const updateActivity = useItineraryStore((state) => state.updateActivity);
  const removeActivity = useItineraryStore((state) => state.removeActivity);
  const isTransport = isTransportActivity(activity.name);

  const handleFieldChange = (field, value) => {
    if (dayNum !== undefined && activityIndex !== undefined) {
      updateActivity(dayNum, activityIndex, field, value);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (dayNum !== undefined && activityIndex !== undefined) {
      if (window.confirm('¿Eliminar esta actividad?')) {
        removeActivity(dayNum, activityIndex);
      }
    }
  };

  if (isTransport) {
    const transportInfo = getTransportType(activity.name, activity.notes);
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-l-4 border-emerald-500 rounded-xl p-4 hover:shadow-md transition-all duration-300 group">
        <div className="flex items-start gap-4">
          <div className="text-3xl flex-shrink-0 bg-gradient-to-br from-emerald-400 to-teal-500 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
            <span className="filter drop-shadow-sm">{transportInfo.emoji}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <h4 className="text-lg font-semibold text-light-text group-hover:text-emerald-700 transition-colors">{activity.name}</h4>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                🕐 {activity.start} • {activity.durationMin}min
              </span>
            </div>
            {activity.notes && (
              <p className="text-light-textSecondary text-sm leading-relaxed">{activity.notes}</p>
            )}
            {activity.link && (
              <a
                href={activity.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium mt-2 inline-flex items-center gap-1 hover:gap-2 transition-all"
              >
                🔗 Ver detalles →
              </a>
            )}
            {activity.ticketUrl && (
              <a
                href={activity.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 hover:text-green-800 text-sm font-semibold mt-2 ml-3 inline-flex items-center gap-1 hover:gap-2 transition-all"
              >
                📄 Ver tiquete →
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  const icon = getActivityIcon(activity.name);
  const hasImage = activity.imageUrl && !imageError;
  const category = getActivityCategory(activity.name);
  const styles = categoryStyles[category];

  return (
    <div className={`${styles.bg} ${styles.border} rounded-xl shadow-soft overflow-hidden hover:shadow-card transition-all duration-300 group`}>
      {/* Activity Image - Fixed aspect ratio with overlay */}
      {hasImage && (
        <div className="relative w-full">
          <div className="aspect-[16/9] max-h-48 overflow-hidden bg-light-bgTertiary">
            <img
              src={activity.imageUrl}
              alt={activity.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={() => setImageError(true)}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          {/* Category badge on image */}
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${styles.badge} backdrop-blur-sm shadow-sm`}>
              {icon}
            </span>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon box - only show if no image */}
          {!hasImage && (
            <div className={`text-xl flex-shrink-0 ${styles.iconBg} w-10 h-10 rounded-xl flex items-center justify-center shadow-sm text-white group-hover:scale-110 transition-transform duration-300`}>
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            {editMode ? (
              /* Edit Mode */
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={activity.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    className="flex-1 px-3 py-2 border border-light-border rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre de actividad"
                  />
                  <button
                    onClick={handleRemove}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar actividad"
                  >
                    🗑️
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="time"
                    value={activity.start}
                    onChange={(e) => handleFieldChange('start', e.target.value)}
                    className="px-3 py-2 border border-light-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={activity.durationMin}
                    onChange={(e) => handleFieldChange('durationMin', parseInt(e.target.value) || 0)}
                    className="w-20 px-3 py-2 border border-light-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Min"
                  />
                </div>
                <textarea
                  value={activity.notes || ''}
                  onChange={(e) => handleFieldChange('notes', e.target.value)}
                  className="w-full px-3 py-2 border border-light-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Notas..."
                  rows={2}
                />
                <input
                  type="url"
                  value={activity.link || ''}
                  onChange={(e) => handleFieldChange('link', e.target.value)}
                  className="w-full px-3 py-2 border border-light-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="URL del enlace..."
                />
              </div>
            ) : (
              /* View Mode */
              <>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <h4 className="text-base font-semibold text-light-text group-hover:text-gray-900 transition-colors">{activity.name}</h4>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${styles.badge}`}>
                    🕐 {activity.start} • {activity.durationMin}min
                  </span>
                </div>
                {activity.notes && (
                  <p className="text-light-textSecondary text-sm leading-relaxed">{activity.notes}</p>
                )}
                {activity.link && (
                  <a
                    href={activity.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.accent} text-sm font-medium mt-3 inline-flex items-center gap-1 hover:gap-2 transition-all`}
                  >
                    🔗 Ver más información →
                  </a>
                )}
                {activity.ticketUrl && (
                  <a
                    href={activity.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-700 hover:text-green-800 text-sm font-semibold mt-3 ml-3 inline-flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    📄 Ver tiquete →
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityCard;
