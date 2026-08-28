// Constantes y valores por defecto

export const DEFAULT_START_DATE = '2026-05-22';
export const DEFAULT_EXCHANGE_RATE = 4200;
export const DEFAULT_SHOW_COP_CONVERSION = true;
export const DEFAULT_USE_REALISTIC_COSTS = true;

// Viajes disponibles. Cada uno apunta a su propio JSON en /public/data.
export const TRIPS = {
  chile: {
    id: 'chile',
    label: 'Chile · Patagonia',
    emoji: '🏔️',
    title: 'Itinerario Chile — Patagonia',
    route: 'Santiago → Punta Arenas → Puerto Natales → Torres del Paine → Glaciar Grey → Fiordos → Santiago',
    dateLabel: 'Enero 2026',
    daysLabel: '7 días',
    gradient: 'from-teal-600 via-cyan-700 to-blue-800',
    dataPath: `${import.meta.env.BASE_URL}data/itinerary-chile.json`,
  },
  europa: {
    id: 'europa',
    label: 'Europa',
    emoji: '🇪🇺',
    title: 'Itinerario Europa',
    route: 'Barcelona → París → Ámsterdam → Suiza → Milán → Venecia → Roma → Puglia → Madrid',
    dateLabel: 'Septiembre 2026',
    daysLabel: '23 días',
    gradient: 'from-blue-600 via-indigo-600 to-purple-700',
    dataPath: `${import.meta.env.BASE_URL}data/itinerary-data.json`,
  },
};

export const DEFAULT_TRIP = 'chile';

export const DATA_FILE_PATH = TRIPS[DEFAULT_TRIP].dataPath; // compat
export const JAVIER_PLANNER_PATH = `${import.meta.env.BASE_URL}data/javier-planner.json`;

export const VIEWS = {
  SUMMARY: 'summary',
  ALL: 'all',
  DAY: 'day',
};

export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280,
};
