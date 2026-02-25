// Utilidades para detección y manejo de transporte

export function isTransportActivity(activityName) {
  const keywords = [
    'traslado', 'tránsito', 'transporte', 'viaje',
    'vuelo', 'tren', 'bus', 'carro', 'taxi',
    'barco', 'ferry', 'crucero'
  ];
  const nameLower = activityName.toLowerCase();
  return keywords.some(keyword => nameLower.includes(keyword));
}

export function getTransportType(activityName, notes = '') {
  const combined = `${activityName} ${notes}`.toLowerCase();

  // Vuelo
  if (/vuelo|flight|avión|aeropuerto|✈️/.test(combined)) {
    return { type: 'flight', emoji: '✈️', label: 'Vuelo' };
  }

  // Tren
  if (/tren|train|tgv|eurostar|thalys|🚂/.test(combined)) {
    return { type: 'train', emoji: '🚂', label: 'Tren' };
  }

  // Barco
  if (/barco|ferry|crucero|⛴️/.test(combined)) {
    return { type: 'boat', emoji: '⛴️', label: 'Barco' };
  }

  // Bus
  if (/bus|autobús|coach|🚌/.test(combined)) {
    return { type: 'bus', emoji: '🚌', label: 'Bus' };
  }

  // Carro
  if (/carro|auto|coche|taxi|uber|🚗/.test(combined)) {
    return { type: 'car', emoji: '🚗', label: 'Carro' };
  }

  return { type: 'other', emoji: '🚆', label: 'Transporte' };
}

export function formatTransportDuration(durationMin) {
  if (!durationMin) return '';
  const hours = Math.floor(durationMin / 60);
  const mins = durationMin % 60;
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
}

export function getTransportIcon(mode) {
  const icons = {
    flight: '✈️',
    train: '🚂',
    boat: '⛴️',
    bus: '🚌',
    car: '🚗',
    other: '🚆',
  };
  return icons[mode] || '🚆';
}
