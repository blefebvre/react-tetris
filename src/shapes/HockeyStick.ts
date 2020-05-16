import { Shape, ShapeMatrix } from "./Shape";

export function hockeyStick(): Shape {
  // prettier-ignore
  const hockeyStickFlat: ShapeMatrix = [
    [0, 0,  1],
    [1, 1,  1]
  ];
  const hockeyStickUp: ShapeMatrix = [
    [1, 1],
    [0, 1],
    [0, 1],
  ];
  const hockeyStickOver: ShapeMatrix = [
    [1, 1, 1],
    [1, 0, 0],
  ];
  const hockeyStickDown: ShapeMatrix = [
    [1, 0],
    [1, 0],
    [1, 1],
  ];
  return {
    name: "hockeyStick",
    color: "blue",
    positions: [hockeyStickFlat, hockeyStickUp, hockeyStickOver, hockeyStickDown],
  };
}
