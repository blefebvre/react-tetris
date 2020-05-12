import { Shape } from "./Shape";

export function line(): Shape {
  // prettier-ignore
  const verticalLine = [
    [1],
    [1],
    [1],
    [1]
  ];
  const horizontalLine = [[1, 1, 1, 1]];
  return {
    name: "square",
    positions: [verticalLine, horizontalLine], // A square rotated is the same thing
  };
}
