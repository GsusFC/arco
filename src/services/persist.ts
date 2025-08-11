export type PersistPrefs = { local: boolean; export: boolean; diamond?: boolean };

export const PREFS_KEY = 'metaballs-prefs';

export function connectionKey(a: { gridI: number; gridJ: number }, b: { gridI: number; gridJ: number }): string {
  const k1 = `${a.gridI},${a.gridJ}`;
  const k2 = `${b.gridI},${b.gridJ}`;
  return (k1 < k2) ? `${k1}|${k2}` : `${k2}|${k1}`;
}

export function blockedStorageKey(gridCountX: number, gridCountY: number): string {
  return `metaballs-blocked-${gridCountX}x${gridCountY}`;
}

export function saveBlockedLocal(blockedConnections: Set<string>, gridCountX: number, gridCountY: number): void {
  try { localStorage.setItem(blockedStorageKey(gridCountX, gridCountY), JSON.stringify(Array.from(blockedConnections))); } catch {}
}

export function loadBlockedLocal(gridCountX: number, gridCountY: number): Set<string> {
  try {
    const raw = localStorage.getItem(blockedStorageKey(gridCountX, gridCountY));
    if (raw) {
      const arr = JSON.parse(raw);
      return new Set(Array.isArray(arr) ? arr : []);
    }
  } catch {}
  return new Set();
}

export function shapesStorageKey(gridCountX: number, gridCountY: number): string {
  return `metaballs-shapes-${gridCountX}x${gridCountY}`;
}

export function saveShapesLocal(circles: { shape?: string }[], gridCountX: number, gridCountY: number): void {
  try {
    const arr = circles.map(c => c.shape || 'circle');
    localStorage.setItem(shapesStorageKey(gridCountX, gridCountY), JSON.stringify(arr));
  } catch {}
}

export function loadShapesLocal(circles: { shape?: string }[], gridCountX: number, gridCountY: number): void {
  try {
    const raw = localStorage.getItem(shapesStorageKey(gridCountX, gridCountY));
    if (!raw) return;
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return;
    for (let i = 0; i < circles.length && i < arr.length; i++) {
      const sh = arr[i];
      circles[i].shape = (sh === 'square' || sh === 'squircle') ? sh : 'circle';
    }
  } catch {}
}

export function loadPersistPrefs(): PersistPrefs {
  const prefs: PersistPrefs = { local: true, export: true };
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) {
      const obj = JSON.parse(raw);
      if (typeof obj?.local === 'boolean') prefs.local = obj.local;
      if (typeof obj?.export === 'boolean') prefs.export = obj.export;
      if (typeof obj?.diamond === 'boolean') prefs.diamond = obj.diamond;
    }
  } catch {}
  return prefs;
}

export function savePersistPrefs(persistPrefs: PersistPrefs): void {
  try { localStorage.setItem(PREFS_KEY, JSON.stringify(persistPrefs)); } catch {}
}


export type SceneSnapshot = {
  circles: { radius: number; shape?: string; gridI: number; gridJ: number }[];
  connections: { fromGrid: [number, number]; toGrid: [number, number]; connectionFactor?: number }[];
  blockedConnections: string[];
  gridSize: { x: number; y: number };
  diamondMask: boolean;
  globalConnectionFactor: number;
  bridgeWidth: number;
  timestamp: number;
};

export type ScenePreset = {
  name: string;
  snapshot: SceneSnapshot;
  created: number;
};

// Presets storage key
export const PRESETS_KEY = 'metaballs-presets';

// History management for undo/redo
export const HISTORY_KEY = 'metaballs-history';
export const MAX_HISTORY_SIZE = 50;

export function savePreset(name: string, snapshot: SceneSnapshot): void {
  try {
    const existing = loadPresets();
    const preset: ScenePreset = {
      name: name.trim(),
      snapshot,
      created: Date.now()
    };
    
    // Replace if exists with same name, otherwise add
    const index = existing.findIndex(p => p.name === preset.name);
    if (index >= 0) {
      existing[index] = preset;
    } else {
      existing.push(preset);
    }
    
    localStorage.setItem(PRESETS_KEY, JSON.stringify(existing));
  } catch {}
}

export function loadPresets(): ScenePreset[] {
  try {
    const raw = localStorage.getItem(PRESETS_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    }
  } catch {}
  return [];
}

export function deletePreset(name: string): void {
  try {
    const existing = loadPresets();
    const filtered = existing.filter(p => p.name !== name);
    localStorage.setItem(PRESETS_KEY, JSON.stringify(filtered));
  } catch {}
}

export function saveHistory(history: SceneSnapshot[]): void {
  try {
    // Keep only last MAX_HISTORY_SIZE entries
    const trimmed = history.slice(-MAX_HISTORY_SIZE);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch {}
}

export function loadHistory(): SceneSnapshot[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    }
  } catch {}
  return [];
}