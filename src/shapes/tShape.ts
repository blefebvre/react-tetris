import { Shape, ShapeMatrix } from "./Shape";

export function tShape(): Shape {
  const tUpsideDown: ShapeMatrix = [
    [0, 1, 0],
    [1, 1, 1],
  ];
  const tSideLeft: ShapeMatrix = [
    [0, 1],
    [1, 1],
    [0, 1],
  ];
  const tRightSideUp: ShapeMatrix = [
    [1, 1, 1],
    [0, 1, 0],
  ];
  const tSideRight: ShapeMatrix = [
    [1, 0],
    [1, 1],
    [1, 0],
  ];
  return {
    name: "tShape",
    positions: [tUpsideDown, tSideLeft, tRightSideUp, tSideRight],
  };
}
