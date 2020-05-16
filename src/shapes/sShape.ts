import { Shape, ShapeMatrix } from "./Shape";

export function sShape(): Shape {
  const zigZagSide: ShapeMatrix = [
    [0, 1, 1],
    [1, 1, 0],
  ];
  const zigZagUp: ShapeMatrix = [
    [1, 0],
    [1, 1],
    [0, 1],
  ];
  return {
    name: "sShape",
    positions: [zigZagSide, zigZagUp],
  };
}
