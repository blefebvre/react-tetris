import { Shape } from "../shapes/Shape";

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

export function getGridStateForNewShape(
  shape: Shape,
  width: number,
  height: number,
  xPos = Math.floor(width / 2) - 1
): GridState {
  const newShapeGrid = initEmptyGrid(width, height);

  // Use the first position initially (index 0)
  const shapePosition = shape.positions[0];

  // Assumes grid will always be big enough for the shape!
  // shape.positions.length is the HEIGHT of the new shape
  for (let row = 0; row < shapePosition.length; row++) {
    for (let col = 0; col < shapePosition[row].length; col++) {
      const currentPositionFlag = shapePosition[row][col];
      if (currentPositionFlag) {
        // Set the grid cell to ON!
        newShapeGrid[row][col + xPos] = {
          color: "1",
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
