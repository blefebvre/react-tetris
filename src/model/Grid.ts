import { Shape, ShapeMatrix } from "../shapes/Shape";

// Grid related model types

export enum CellStatus {
  EMPTY,
  FULL,
}

export interface GridCellState {
  color: string;
  status: CellStatus;
}

// The entire grid: a 2d array
export type GridState = GridCellState[][];

// Return 2d array of GridCellState items
export function initEmptyGrid(width: number, height: number): GridState {
  const grid: Array<Array<GridCellState>> = [];
  for (let row = 0; row < height; row++) {
    grid[row] = getEmptyRow(width);
  }
  return grid;
}

export function getEmptyRow(width: number): GridCellState[] {
  const row = [];
  for (let col = 0; col < width; col++) {
    row[col] = getEmptyCell();
  }
  return row;
}

export function getEmptyCell(): GridCellState {
  return {
    color: "0",
    status: CellStatus.EMPTY,
  };
}

export function getGridStateForShape(
  shape: Shape,
  positionIndex: number,
  shapeRow: number,
  shapeCol: number,
  gridWidth: number,
  gridHeight: number
): GridState {
  const newShapeGrid = initEmptyGrid(gridWidth, gridHeight);

  // Choose the shape's position (this is how rotation is implemented)
  const shapePosition: ShapeMatrix = shape.positions[positionIndex % shape.positions.length];

  // Assumes grid will always be big enough for the shape!
  // shapePosition.length is the HEIGHT of the new shape
  for (let row = 0; row < shapePosition.length; row++) {
    for (let col = 0; col < shapePosition[row].length; col++) {
      const currentCellFlag = shapePosition[row][col];
      if (currentCellFlag === 1) {
        // Set the grid cell to ON!
        newShapeGrid[row + shapeRow][col + shapeCol] = {
          color: shape.color || "1",
          status: CellStatus.FULL,
        };
      }
    }
  }
  return newShapeGrid;
}

export function mergeShapeIntoGrid(shape: GridState, grid: GridState): GridState {
  const mergedGridState: GridState = [];
  for (let row = 0; row < shape.length; row++) {
    // Copy the current row to the merged grid
    mergedGridState[row] = [...grid[row]];
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col].status !== CellStatus.EMPTY) {
        mergedGridState[row][col] = { ...shape[row][col] };
      }
    }
  }
  return mergedGridState;
}
