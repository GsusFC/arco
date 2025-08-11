import { connectCirclesKuckir } from '../core/metaballs';
import type { Connection } from '../types/connection';

export interface RenderOptions {
  svgNS?: string;
  editMode: 'select' | 'connect';
  connectionFactorMode: 'global' | 'individual';
  bridgeWidth: number;
  connectionFactor: number;
}

export function renderConnections(
  svg: SVGSVGElement,
  connections: Connection[],
  opts: RenderOptions
): void {
  const {
    svgNS = 'http://www.w3.org/2000/svg',
    editMode,
    connectionFactorMode,
    bridgeWidth,
    connectionFactor
  } = opts;

  connections.forEach((connection, index) => {
    if (!connection || connection.isBlocked) return;
    if (connection.from.radius <= 0 || connection.to.radius <= 0) return;
    const res = connectCirclesKuckir(connection.from, connection.to, connection, bridgeWidth, connectionFactor);
    if (!res) return;
    const { pathData, overlayWidth } = res;

    const metaballPath = document.createElementNS(svgNS, 'path');
    metaballPath.setAttribute('d', pathData);
    metaballPath.setAttribute('fill', '#ffffff');
    metaballPath.setAttribute('opacity', '1.0');
    if (connection.isSelected) {
      metaballPath.setAttribute('stroke', '#00ff00');
      metaballPath.setAttribute('stroke-width', '1');
    }
    svg.appendChild(metaballPath);

    const overlay = document.createElementNS(svgNS, 'path');
    overlay.setAttribute('d', pathData);
    overlay.setAttribute('fill', 'none');
    overlay.setAttribute('stroke', 'transparent');
    overlay.setAttribute('stroke-width', String(overlayWidth));
    const overlayActive = editMode === 'connect' || connectionFactorMode === 'individual';
    overlay.setAttribute('pointer-events', overlayActive ? 'stroke' : 'none');
    overlay.setAttribute('stroke-linecap', 'round');
    overlay.setAttribute('stroke-linejoin', 'round');
    overlay.setAttribute('class', 'conn-overlay');
    (overlay as any).style.cursor = 'pointer';
    (overlay as any).dataset.connIndex = String(index);
    svg.appendChild(overlay);
  });
}