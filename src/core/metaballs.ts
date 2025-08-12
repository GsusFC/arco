import type { Circle } from '../types/circle';
import type { Connection } from '../types/connection';

export interface MetaballResult {
  pathData: string;
  overlayWidth: number;
}

// Adaptación de connectCirclesKuckir a módulo puro
// Nota: bridgeWidth y connectionFactor ahora son parámetros
import { 
  CONNECTION_INFLUENCE_DIVISOR,
  CONNECTION_RADIUS_BASE, 
  CONNECTION_RADIUS_INFLUENCE,
  HALF_PI,
  OVERLAY_WIDTH_MIN,
  OVERLAY_WIDTH_FACTOR
} from '../utils/constants';

export function connectCirclesKuckir(
  c1: Circle,
  c2: Circle,
  connection: Connection | null,
  bridgeWidth: number,
  defaultConnectionFactor: number
): MetaballResult | undefined {
  const r1 = Math.max(0, c1.radius);
  const r2 = Math.max(0, c2.radius);
  if (r1 === 0 || r2 === 0) return;
  const dx = c2.x - c1.x;
  const dy = c2.y - c1.y;
  const d = Math.hypot(dx, dy);
  if (d <= 1e-6) return; // centros coincidentes
  if (d <= Math.abs(r1 - r2)) return; // una dentro de otra

  const usedFactor = (connection?.connectionFactor ?? defaultConnectionFactor);
  const v = Math.max(0, Math.min(1, usedFactor / 8.0));

  const angleBetweenCenters = Math.atan2(dy, dx);
  const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
  const maxSpread = Math.acos(clamp((r1 - r2) / d, -1, 1));
  const u1 = Math.acos(clamp((r1*r1 + d*d - r2*r2) / (2 * r1 * d), -1, 1));
  const u2 = Math.acos(clamp((r2*r2 + d*d - r1*r1) / (2 * r2 * d), -1, 1));
  if (!Number.isFinite(u1) || !Number.isFinite(u2)) return;

  // Usar constantes centralizadas
  const angle1 = angleBetweenCenters + u1 + (maxSpread - u1) * v;
  const angle2 = angleBetweenCenters - (u1 + (maxSpread - u1) * v);
  const angle3 = angleBetweenCenters + Math.PI - u2 - (Math.PI - u2 - maxSpread) * v;
  const angle4 = angleBetweenCenters - (Math.PI - u2 - (Math.PI - u2 - maxSpread) * v);

  const p1 = { x: c1.x + r1 * Math.cos(angle1), y: c1.y + r1 * Math.sin(angle1) };
  const p2 = { x: c1.x + r1 * Math.cos(angle2), y: c1.y + r1 * Math.sin(angle2) };
  const p3 = { x: c2.x + r2 * Math.cos(angle3), y: c2.y + r2 * Math.sin(angle3) };
  const p4 = { x: c2.x + r2 * Math.cos(angle4), y: c2.y + r2 * Math.sin(angle4) };

  const handleSize = bridgeWidth;
  const totalRadius = r1 + r2;
  const dist13 = Math.hypot(p1.x - p3.x, p1.y - p3.y);
  let d2Base = Math.min(v * handleSize, dist13 / totalRadius);
  const overlapScale = Math.min(1, (d * 2) / (r1 + r2));
  let d2 = d2Base * overlapScale;
  if (!Number.isFinite(d2) || d2 < 0) d2 = 0;

  const HALF_PI = Math.PI / 2;
  const r1h = r1 * d2;
  const r2h = r2 * d2;
  const h1 = { x: p1.x + Math.cos(angle1 - HALF_PI) * r1h, y: p1.y + Math.sin(angle1 - HALF_PI) * r1h };
  const h2 = { x: p2.x + Math.cos(angle2 + HALF_PI) * r1h, y: p2.y + Math.sin(angle2 + HALF_PI) * r1h };
  const h3 = { x: p3.x + Math.cos(angle3 + HALF_PI) * r2h, y: p3.y + Math.sin(angle3 + HALF_PI) * r2h };
  const h4 = { x: p4.x + Math.cos(angle4 - HALF_PI) * r2h, y: p4.y + Math.sin(angle4 - HALF_PI) * r2h };

  const escaped = d > (r1 + r2);
  const largeArcFlag2 = escaped ? 1 : 0;
  const largeArcFlag1 = escaped ? 1 : 0;
  const sweepFlag = 0;

  const pathData = [
    'M', p1.x, p1.y,
    'C', h1.x, h1.y, h3.x, h3.y, p3.x, p3.y,
    'A', r2, r2, 0, largeArcFlag2, sweepFlag, p4.x, p4.y,
    'C', h4.x, h4.y, h2.x, h2.y, p2.x, p2.y,
    'A', r1, r1, 0, largeArcFlag1, sweepFlag, p1.x, p1.y,
    'Z'
  ].join(' ');

  // Usar constantes centralizadas para overlay
  const overlayWidth = Math.max(OVERLAY_WIDTH_MIN, (r1 + r2) * OVERLAY_WIDTH_FACTOR);
  const overlayPath = [
    `M ${p1.x} ${p1.y}`,
    `C ${h1.x} ${h1.y} ${h3.x} ${h3.y} ${p3.x} ${p3.y}`,
    `C ${h4.x} ${h4.y} ${h2.x} ${h2.y} ${p2.x} ${p2.y}`,
    'Z'
  ].join(' ');

  return { pathData, overlayWidth };
}