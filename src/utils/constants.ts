// Valores constantes del editor metaballs
export const MIN_GAP = 40;
export const DRAG_THRESHOLD_PX = 5;
export const SVG_NS = 'http://www.w3.org/2000/svg';

// Persistencia
export const PREFS_KEY = 'metaballs-prefs';
export const getBlockedStorageKey = (gridCountX: number, gridCountY: number) => 
  `metaballs-blocked-${gridCountX}x${gridCountY}`;