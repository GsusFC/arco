// Valores constantes del editor metaballs
export const MIN_GAP = 40;
export const DRAG_THRESHOLD_PX = 8;
export const SVG_NS = 'http://www.w3.org/2000/svg';

// Grid spacing constants
export const GRID_SPACING_MIN = 30;
export const GRID_SPACING_MAX = 120;
export const DEFAULT_GRID_SPACING = 120;

// Grid size constraints
export const GRID_SIZE_MIN = 3;
export const GRID_SIZE_MAX = 12;
export const DEFAULT_GRID_SIZE = 5;

// Connection factor constraints
export const CONNECTION_FACTOR_MIN = 0.1;
export const CONNECTION_FACTOR_MAX = 8.0;
export const CONNECTION_FACTOR_STEP = 0.05;
export const DEFAULT_CONNECTION_FACTOR = 4.0;

// Bridge width constraints
export const BRIDGE_WIDTH_MIN = 1.0;
export const BRIDGE_WIDTH_MAX = 4.0;
export const BRIDGE_WIDTH_STEP = 0.1;
export const DEFAULT_BRIDGE_WIDTH = 2.4;

// Circle/radius defaults
export const DEFAULT_BASE_RADIUS = 20;
export const DEFAULT_MAX_RADIUS_EFFECTIVE = 100;

// Layout constants
export const VIEWPORT_MARGIN_X_MIN = 160; // px mínimo lateral
export const VIEWPORT_MARGIN_Y = 100;     // px vertical
export const VIEWPORT_MARGIN_X_PERCENT = 0.10; // 10% del ancho

// Connection algorithm constants
export const CONNECTION_INFLUENCE_DIVISOR = 8.0;
export const CONNECTION_INFLUENCE_POWER = 0.7;
export const CONNECTION_RADIUS_BASE = 0.7;
export const CONNECTION_RADIUS_INFLUENCE = 0.6;
export const CONNECTION_THRESHOLD_FACTOR = 0.7;
export const CONNECTION_CENTER_ANGLE = Math.PI / 2; // 90 grados

// Overlay rendering
export const OVERLAY_WIDTH_MIN = 12;
export const OVERLAY_WIDTH_FACTOR = 0.3;

// Math constants
export const HALF_PI = Math.PI / 2;

// Persistencia - localStorage keys
export const PREFS_KEY = 'metaballs-prefs';
export const PRESETS_KEY = 'metaballs-presets';
export const HISTORY_KEY = 'metaballs-history';

// Storage key generators
export const getBlockedStorageKey = (gridCountX: number, gridCountY: number) => 
  `metaballs-blocked-${gridCountX}x${gridCountY}`;

export const getShapesStorageKey = (gridCountX: number, gridCountY: number) => 
  `metaballs-shapes-${gridCountX}x${gridCountY}`;

// History management
export const MAX_HISTORY_SIZE = 50;