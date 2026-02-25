// Componente CostBreakdown - Desglose de costos por día
import { useItineraryStore } from '../../store/store';
import useCurrency from '../../hooks/useCurrency';
import { calculateDayTotal, calculateAccumulatedTotal } from '../../utils/calculations';

export function CostBreakdown({ day }) {
  const useRealisticCosts = useItineraryStore((state) => state.useRealisticCosts);
  const itineraryData = useItineraryStore((state) => state.itineraryData);
  const { formatCost } = useCurrency();

  if (!day || !day.costs) return null;

  const costs = day.costs;
  const dayTotal = calculateDayTotal(day, useRealisticCosts);
  const accumulated = calculateAccumulatedTotal(
    itineraryData?.days || [],
    day.day,
    useRealisticCosts
  );

  const costItems = [
    {
      label: 'Alojamiento',
      value: useRealisticCosts ? costs.lodgingReal : costs.lodgingBase,
      emoji: '🏨',
    },
    {
      label: 'Comida',
      value: useRealisticCosts ? costs.foodReal : costs.foodBase,
      emoji: '🍽️',
    },
    {
      label: 'Transporte',
      value: costs.transportBase,
      emoji: '🚗',
    },
    {
      label: 'Actividades',
      value: costs.activitiesBase,
      emoji: '🎭',
    },
  ];

  // Colores para cada tipo de costo
  const costColors = {
    'Alojamiento': { bg: 'bg-gradient-to-br from-violet-100 to-purple-100', iconBg: 'bg-gradient-to-br from-violet-400 to-purple-500', text: 'text-violet-700' },
    'Comida': { bg: 'bg-gradient-to-br from-orange-100 to-amber-100', iconBg: 'bg-gradient-to-br from-orange-400 to-amber-500', text: 'text-orange-700' },
    'Transporte': { bg: 'bg-gradient-to-br from-emerald-100 to-teal-100', iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-500', text: 'text-emerald-700' },
    'Actividades': { bg: 'bg-gradient-to-br from-pink-100 to-rose-100', iconBg: 'bg-gradient-to-br from-pink-400 to-rose-500', text: 'text-pink-700' },
  };

  return (
    <div className="space-y-4">
      {/* Desglose de costos */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-5 border border-amber-200/50 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-br from-amber-400 to-yellow-500 w-10 h-10 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-xl">💰</span>
          </div>
          <h3 className="text-lg font-bold text-light-text">Costos del Día</h3>
        </div>
        <div className="grid-responsive-2 gap-3">
          {costItems.map((item) => {
            const colors = costColors[item.label] || { bg: 'bg-white', iconBg: 'bg-gray-400', text: 'text-gray-700' };
            return (
              <div key={item.label} className={`${colors.bg} rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200`}>
                <div className="flex items-center gap-3">
                  <div className={`${colors.iconBg} w-9 h-9 rounded-lg flex items-center justify-center shadow-sm`}>
                    <span className="text-lg">{item.emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-light-textMuted font-medium uppercase tracking-wide">{item.label}</p>
                    <p className={`text-lg font-bold ${colors.text}`}>
                      {formatCost(item.value)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Totales */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-xl">📊</span>
          </div>
          <h3 className="text-lg font-bold text-light-text">Totales</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center gap-2 bg-white/60 rounded-lg p-3">
            <span className="text-light-textSecondary font-medium">Total del Día</span>
            <span className="text-light-text font-bold text-xl">
              {formatCost(dayTotal)}
            </span>
          </div>
          <div className="flex justify-between items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 shadow-md">
            <span className="text-white/90 font-medium">Total Acumulado</span>
            <span className="text-white font-bold text-2xl">
              {formatCost(accumulated)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CostBreakdown;
