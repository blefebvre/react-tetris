import { GridState, CellStatus, getEmptyRow, getEmptyCell } from "../model/Grid";

// Can this shape move down 1 step? Or, has it reached the bottom of the grid, or another shape?
export function canShapeMoveDown1Step(shape: GridState, grid: GridState): boolean {
  // Find each active cell of the shape. Check for an active grid cell, or the bottom, right below it (row + 1)
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col].status !== CellStatus.EMPTY) {
        // This is an active shape cell. Check below it.
        // Is this shape at the bottom?
        if (row === grid.length - 1) {
          console.log("canShapeMoveDown1Step: no! shape is at the bottom");
          // This shape CANNOT move down any more
          return false;
        } else if (grid[row + 1][col].status !== CellStatus.EMPTY) {
          console.log("canShapeMoveDown1Step: no! there's another shape in the way");
          // The  grid has an active cell in the next row: shape CANNOT move down any more
          return false;
        }
      }
    }
  }
  // Did not find any grid cells that would block this shape from moving down
  return true;
}

export function canShapeMoveLeft(shape: GridState, grid: GridState): boolean {
  // Check the first col of each row of the shape's grid to ensure nothing is in it
  for (let row = 0; row < shape.length; row++) {
    if (shape[row][0].status !== CellStatus.EMPTY) {
      // There's part of the shape in the leftmost col! can't move left
      return false;
    }
  }
  // Need to also check that there is nothing in the grid to the left of the shape
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col].status !== CellStatus.EMPTY) {
        // Found an active shape cell, which we KNOW is not in the first column (due to the check above)
        // Check col - 1 in the grid
        if (grid[row][col - 1].status !== CellStatus.EMPTY) {
          // There's already something to the immediate left of the shape! can't move left
          return false;
        }
      }
    }
  }
  // Otherwise: CAN move left
  return true;
}

export function moveShapeLeft(shape: GridState): GridState {
  // Remove the first column, and add a column to the end
  const movedGridState: GridState = [];
  for (let row = 0; row < shape.length; row++) {
    movedGridState[row] = [...shape[row]];
    // Remove first item in the row (first column)
    movedGridState[row].shift();
    // Add empty cell to the end (last column)
    movedGridState[row].push(getEmptyCell());
  }
  return movedGridState;
}

export function canShapeMoveRight(shape: GridState, grid: GridState): boolean {
  // Check the LAST col of each row of the shape's grid to ensure nothing is in it
  for (let row = 0; row < shape.length; row++) {
    const lastColIndex = shape[row].length - 1;
    if (shape[row][lastColIndex].status !== CellStatus.EMPTY) {
      // There's part of the shape in the rightmost col! can't move right
      return false;
    }
  }
  // Need to also check that there is nothing in the grid to the RIGHT of the shape
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col].status !== CellStatus.EMPTY) {
        // Found an active shape cell, which we KNOW is not in the last column (due to the check above)
        // Check col + 1 in the grid
        if (grid[row][col + 1].status !== CellStatus.EMPTY) {
          // There's already something to the immediate RIGHT of the shape! can't move right
          return false;
        }
      }
    }
  }
  // Otherwise: CAN move right
  return true;
}

export function moveShapeRight(shape: GridState): GridState {
  // Remove the last column, and add a column to the start
  const movedGridState: GridState = [];
  for (let row = 0; row < shape.length; row++) {
    movedGridState[row] = [...shape[row]];
    // Remove last item in the row (rightmost column)
    movedGridState[row].pop();
    // Add empty cell to the start (leftmost column)
    movedGridState[row].unshift(getEmptyCell());
  }
  return movedGridState;
}

export function doesShapeCollideWithAnother(shape: GridState, grid: GridState): boolean {
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col].status !== CellStatus.EMPTY && grid[row][col].status !== CellStatus.EMPTY) {
        // There's already a shape in this spot!
        return true;
      }
    }
  }
  return false;
}

export function moveShapeDown(shape: GridState): GridState {
  // Since the top-left of the Grid is 0,0, moving down can be done by adding a new row to the
  // "top" and deleting the last row
  const movedShape = [...shape];
  // Remove last row
  movedShape.pop();
  const width = shape[0].length;
  // Add empty row to beginning
  movedShape.unshift(getEmptyRow(width));
  return movedShape;
}
