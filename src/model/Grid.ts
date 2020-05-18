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

export enum Result {
  SUCCESS,
  FAILURE,
}

export interface NewGridStateResult {
  kind: Result;
  gridState: GridState;
}

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
    color: "white",
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
): NewGridStateResult {
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
        const currentCellRowIndex = row + shapeRow;
        const currentCellColIndex = col + shapeCol;
        // It's possible that - due to rotation - a cell could be attempted to be set which is
        // "out of bounds" of the grid. Return a failure in this case
        if (currentCellRowIndex >= newShapeGrid.length || currentCellColIndex >= newShapeGrid[row].length) {
          return {
            kind: Result.FAILURE,
            gridState: newShapeGrid,
          };
        }
        newShapeGrid[currentCellRowIndex][currentCellColIndex] = {
          color: shape.color || "1",
          status: CellStatus.FULL,
        };
      }
    }
  }
  return {
    kind: Result.SUCCESS,
    gridState: newShapeGrid,
  };
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

function isRowComplete(row: GridCellState[]): boolean {
  for (let col = 0; col < row.length; col++) {
    if (row[col].status === CellStatus.EMPTY) {
      // Short-circuit as soon as we find a single empty cell
      return false;
    }
  }
  // Made it through the entire row without finding an empty cell, so this row is complete!
  return true;
}

export function areThereAnyCompleteRows(grid: GridState): boolean {
  // Search up from the bottom, which is where the complete rows are likely to be found
  for (let row = grid.length - 1; row >= 0; row--) {
    if (isRowComplete(grid[row])) {
      // Complete row found!
      return true;
    }
  }
  // Did not find any complete rows
  return false;
}

interface RowRemovalResult {
  grid: GridState;
  completeRowCount: number;
}

export function removeCompleteRows(grid: GridState): RowRemovalResult {
  const gridWithCompleteRowsReplaced = [];
  let completeRowCount = 0;
  for (let row = 0; row < grid.length; row++) {
    if (isRowComplete(grid[row])) {
      // Complete row found!
      // Unshift an empty row instead of the current grid row
      completeRowCount++;
      gridWithCompleteRowsReplaced.unshift(getEmptyRow(grid[row].length));
    } else {
      // This row is not complete: add it as-is to the end of gridWithCompleteRowsReplaced
      gridWithCompleteRowsReplaced.push([...grid[row]]);
    }
  }
  return {
    completeRowCount,
    grid: gridWithCompleteRowsReplaced,
  };
}
