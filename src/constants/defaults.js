// Constantes y valores por defecto

export const DEFAULT_START_DATE = '2026-05-22';
export const DEFAULT_EXCHANGE_RATE = 4200;
export const DEFAULT_SHOW_COP_CONVERSION = true;
export const DEFAULT_USE_REALISTIC_COSTS = true;

export const DATA_FILE_PATH = `${import.meta.env.BASE_URL}data/itinerary-data.json`;
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
