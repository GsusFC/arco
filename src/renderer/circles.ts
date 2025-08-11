import { SVG_NS } from '../utils/constants';
import type { Circle as CircleType } from '../types/circle';

export interface RenderCirclesOptions {
  svgNS?: string;
}

export function renderCircles(svg: SVGSVGElement, circles: CircleType[], opts: RenderCirclesOptions = {}): void {
  const { svgNS = SVG_NS } = opts;
  circles.forEach((c) => {
    if (c.radius <= 0) return;
    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', String(c.x));
    circle.setAttribute('cy', String(c.y));
    circle.setAttribute('r', String(c.radius));
    circle.setAttribute('fill', '#ffffff');
    circle.setAttribute('opacity', '1.0');
    svg.appendChild(circle);

    if (c.isSelected) {
      const selectedBorder = document.createElementNS(svgNS, 'circle');
      selectedBorder.setAttribute('cx', String(c.x));
      selectedBorder.setAttribute('cy', String(c.y));
      selectedBorder.setAttribute('r', String(c.radius + 3));
      selectedBorder.setAttribute('fill', 'none');
      selectedBorder.setAttribute('stroke', '#00ff00');
      selectedBorder.setAttribute('stroke-width', '1');
      selectedBorder.setAttribute('opacity', '1');
      svg.appendChild(selectedBorder);
    }

    if (c.isHovered && !c.isSelected) {
      const hoverBorder = document.createElementNS(svgNS, 'circle');
      hoverBorder.setAttribute('cx', String(c.x));
      hoverBorder.setAttribute('cy', String(c.y));
      hoverBorder.setAttribute('r', String(c.radius + 2));
      hoverBorder.setAttribute('fill', 'none');
      hoverBorder.setAttribute('stroke', '#ffffff');
      hoverBorder.setAttribute('stroke-width', '1');
      hoverBorder.setAttribute('opacity', '0.8');
      svg.appendChild(hoverBorder);
    }
  });
}