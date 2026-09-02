// Constantes y valores por defecto

export const DEFAULT_START_DATE = '2026-05-22';
export const DEFAULT_EXCHANGE_RATE = 4200;
export const DEFAULT_SHOW_COP_CONVERSION = true;
export const DEFAULT_USE_REALISTIC_COSTS = true;

// Viajes disponibles. Cada uno apunta a su propio JSON en /public/data.
// Chile unificado: norte (Atacama) + sur (Patagonia) en un solo itinerario.
// (El JSON de Europa se conserva en /public/data/itinerary-data.json, solo
//  se quitó del selector.)
export const TRIPS = {
  chile: {
    id: 'chile',
    label: 'Chile',
    emoji: '🇨🇱',
    title: 'Itinerario Chile — Atacama + Patagonia',
    route: 'Medellín → San Pedro de Atacama → Salar & Tatio → Puerto Natales → Torres del Paine → Glaciar Grey → Fiordos → Medellín',
    dateLabel: '8–16 enero 2026',
    daysLabel: '9 días',
    gradient: 'from-amber-600 via-rose-600 to-teal-700',
    dataPath: `${import.meta.env.BASE_URL}data/itinerary-chile.json`,
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
