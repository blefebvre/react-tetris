import { Shape, ShapeMatrix } from "./Shape";

export function line(): Shape {
  // prettier-ignore
  const verticalLine: ShapeMatrix = [
    [1],
    [1],
    [1],
    [1]
  ];
  const horizontalLine: ShapeMatrix = [[1, 1, 1, 1]];
  return {
    name: "line",
    color: "blue",
    positions: [verticalLine, horizontalLine], // A square rotated is the same thing
  };
}
