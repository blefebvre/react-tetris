import { Shape } from "./Shape";

export function square(): Shape {
  const squareMatrix = [
    [1, 1],
    [1, 1],
  ];
  return {
    name: "square",
    positions: [squareMatrix], // A square rotated is the same thing
  };
}
