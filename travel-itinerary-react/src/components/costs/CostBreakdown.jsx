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

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Desglose de costos */}
      <div className="bg-dark-bgTertiary rounded-lg p-4 sm:p-6 border-2 border-yellow-600/50">
        <h3 className="text-responsive-lg text-dark-text mb-3 sm:mb-4">💰 Costos del Día</h3>
        <div className="grid-responsive-2 gap-3 sm:gap-4">
          {costItems.map((item) => (
            <div key={item.label} className="flex justify-between items-center gap-2">
              <span className="text-dark-textSecondary text-sm sm:text-base">
                <span className="text-base sm:text-lg">{item.emoji}</span> {item.label}
              </span>
              <span className="text-dark-text font-semibold text-sm sm:text-base whitespace-nowrap">
                {formatCost(item.value)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Totales */}
      <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 border-2 border-purple-600 rounded-lg p-4 sm:p-6">
        <h3 className="text-responsive-lg text-dark-text mb-3 sm:mb-4">📊 Totales</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center gap-2">
            <span className="text-dark-textSecondary text-sm sm:text-base">Total del Día</span>
            <span className="text-dark-text font-bold text-lg sm:text-xl whitespace-nowrap">
              {formatCost(dayTotal)}
            </span>
          </div>
          <div className="flex justify-between items-center gap-2 pt-3 border-t border-dark-border">
            <span className="text-dark-textSecondary text-sm sm:text-base">Total Acumulado</span>
            <span className="text-purple-400 font-bold text-lg sm:text-xl whitespace-nowrap">
              {formatCost(accumulated)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CostBreakdown;
