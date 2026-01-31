// Utilidades para iconos y emojis

export function getActivityIcon(activityName) {
  const name = activityName.toLowerCase();

  // Museos y cultura
  if (/museo|museum|galería|gallery/.test(name)) return '🏛️';
  if (/iglesia|catedral|basílica|church|cathedral/.test(name)) return '⛪';
  if (/torre|tower/.test(name)) return '🗼';
  if (/palacio|palace/.test(name)) return '🏰';

  // Naturaleza y exterior
  if (/parque|park/.test(name)) return '🌳';
  if (/playa|beach/.test(name)) return '🏖️';
  if (/montaña|mountain|monte/.test(name)) return '⛰️';
  if (/lago|lake/.test(name)) return '🌊';
  if (/jardín|garden/.test(name)) return '🌷';

  // Comida
  if (/restaurante|comida|cena|almuerzo|desayuno|restaurant|lunch|dinner/.test(name)) return '🍽️';
  if (/café|coffee|bar/.test(name)) return '☕';
  if (/mercado|market/.test(name)) return '🏪';

  // Actividades
  if (/compras|shopping/.test(name)) return '🛍️';
  if (/paseo|walk|caminata/.test(name)) return '🚶';
  if (/foto|photo/.test(name)) return '📸';
  if (/mirador|viewpoint/.test(name)) return '👀';

  // Transporte
  if (/traslado|transporte|transport|transfer/.test(name)) return '🚗';
  if (/vuelo|flight/.test(name)) return '✈️';
  if (/tren|train/.test(name)) return '🚂';
  if (/barco|boat|ferry/.test(name)) return '⛴️';
  if (/bus/.test(name)) return '🚌';

  // Hotel
  if (/hotel|check-in|check-out/.test(name)) return '🏨';

  // Default
  return '📍';
}

export function getCountryFlag(country) {
  const flags = {
    'España': '🇪🇸',
    'Francia': '🇫🇷',
    'Suiza': '🇨🇭',
    'Italia': '🇮🇹',
    'Países Bajos': '🇳🇱',
    'Holanda': '🇳🇱',
  };
  return flags[country] || '🌍';
}

export function getCurrencySymbol(currency) {
  const symbols = {
    'EUR': '€',
    'CHF': 'CHF',
    'USD': '$',
    'COP': '$',
  };
  return symbols[currency] || '$';
}
