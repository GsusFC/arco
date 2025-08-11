import type { Circle } from './circle';

export interface Connection {
  from: Circle;
  to: Circle;
  connectionFactor?: number; // individual override
  isSelected?: boolean;
  isBlocked?: boolean;
}