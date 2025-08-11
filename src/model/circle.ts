export class Circle {
  x: number;
  y: number;
  radius: number;
  gridI?: number;
  gridJ?: number;
  isSelected: boolean;
  isHovered: boolean;

  constructor(x: number, y: number, radius: number, gridI?: number, gridJ?: number) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.gridI = gridI;
    this.gridJ = gridJ;
    this.isSelected = false;
    this.isHovered = false;
  }

  contains(x: number, y: number): boolean {
    const dx = x - this.x;
    const dy = y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= Math.max(this.radius, 15);
  }
}