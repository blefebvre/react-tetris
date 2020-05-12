export type ShapeMatrix = Array<Array<number>>;

// Representation of a shape
export interface Shape {
  name: string;
  positions: ShapeMatrix[];
}
