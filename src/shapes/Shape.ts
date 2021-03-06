export type ShapeMatrix = Array<Array<0 | 1>>;

// Representation of a shape
export interface Shape {
  name: string;
  positions: ShapeMatrix[];
  colour?: string;
}
