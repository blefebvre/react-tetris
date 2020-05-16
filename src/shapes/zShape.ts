import { Shape, ShapeMatrix } from "./Shape";

export function zShape(): Shape {
  // prettier-ignore
  const zigZagSide: ShapeMatrix = [
    [1, 1, 0],
    [0, 1, 1],
  ];
  const zigZagUp: ShapeMatrix = [
    [0, 1],
    [1, 1],
    [1, 0],
  ];
  return {
    name: "zShape",
    positions: [zigZagSide, zigZagUp],
  };
}
