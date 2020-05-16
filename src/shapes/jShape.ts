import { Shape, ShapeMatrix } from "./Shape";

export function jShape(): Shape {
  const hockeyStickFlat: ShapeMatrix = [
    [1, 1, 1],
    [0, 0, 1],
  ];
  const hockeyStickUp: ShapeMatrix = [
    [1, 1],
    [1, 0],
    [1, 0],
  ];
  const hockeyStickOver: ShapeMatrix = [
    [1, 0, 0],
    [1, 1, 1],
  ];
  const hockeyStickDown: ShapeMatrix = [
    [0, 1],
    [0, 1],
    [1, 1],
  ];
  return {
    name: "jShape",
    positions: [hockeyStickFlat, hockeyStickUp, hockeyStickOver, hockeyStickDown],
  };
}
