import { Shape } from "./Shape";
import { square } from "./Square";
import { line } from "./Line";
import { hockeyStick } from "./HockeyStick";
import { sShape } from "./sShape";
import { jShape } from "./jShape";
import { zShape } from "./zShape";
import { tShape } from "./tShape";

const knownShapes = [
  () => square(),
  () => line(),
  () => hockeyStick(),
  () => sShape(),
  () => jShape(),
  () => zShape(),
  () => tShape(),
];

function getRandomShapeIndex(): number {
  // Find a number between 0 and the length of knownShapes
  return Math.floor(Math.random() * knownShapes.length);
}

const colors = ["blue", "green", "orange", "red", "pink", "lightgray"];

function getRandomColorIndex(): number {
  // Find a number between 0 and the length of colors
  return Math.floor(Math.random() * colors.length);
}

// Get a number of random shapes (count) each with a random color
export function getRandomShapes(count: number): Shape[] {
  const shapes: Shape[] = [];
  for (let i = 0; i < count; i++) {
    const randomShape: Shape = knownShapes[getRandomShapeIndex()]();
    const randomColor: string = colors[getRandomColorIndex()];
    randomShape.color = randomColor;
    shapes.push(randomShape);
  }
  return shapes;
}
