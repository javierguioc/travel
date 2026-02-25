// Utilidades para cálculos de costos

export function calculateDayTotal(day, useRealistic = true) {
  if (!day || !day.costs) return 0;

  const costs = day.costs;
  if (useRealistic) {
    return (costs.lodgingReal || 0) + (costs.foodReal || 0) +
           (costs.transportBase || 0) + (costs.activitiesBase || 0);
  } else {
    return (costs.lodgingBase || 0) + (costs.foodBase || 0) +
           (costs.transportBase || 0) + (costs.activitiesBase || 0);
  }
}

export function calculateAccumulatedTotal(days, upToDay, useRealistic = true) {
  if (!days || !Array.isArray(days)) return 0;

  return days
    .filter(day => day.day <= upToDay)
    .reduce((sum, day) => sum + calculateDayTotal(day, useRealistic), 0);
}

export function calculateTotalCost(days, useRealistic = true) {
  if (!days || !Array.isArray(days)) return 0;

  return days.reduce((sum, day) => sum + calculateDayTotal(day, useRealistic), 0);
}

export function calculateTripStats(itineraryData) {
  if (!itineraryData || !itineraryData.days) {
    return {
      totalDays: 0,
      totalCities: 0,
      totalCountries: 0,
      totalCostBase: 0,
      totalCostReal: 0,
    };
  }

  const days = itineraryData.days;
  const cities = new Set(days.map(d => d.city));
  const countries = new Set(days.map(d => d.country));

  return {
    totalDays: days.length,
    totalCities: cities.size,
    totalCountries: countries.size,
    totalCostBase: calculateTotalCost(days, false),
    totalCostReal: calculateTotalCost(days, true),
  };
}
