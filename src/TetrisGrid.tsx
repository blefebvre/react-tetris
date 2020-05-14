import React, { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";
import { Shape } from "./shapes/Shape";
import { useKeyPress } from "./hooks/useKeyPress";
import { useInterval } from "./hooks/useInterval";

interface Props {
  height: number;
  width: number;
  shapes: Shape[];
}

enum CellStatus {
  EMPTY,
  FULL,
}

interface GridCellState {
  color: string;
  status: CellStatus;
}

// The entire grid: a 2d array
type GridState = GridCellState[][];

// Return 2d array of GridCellState items
function initEmptyGrid(width: number, height: number): GridState {
  const grid: Array<Array<GridCellState>> = [];
  for (let row = 0; row < height; row++) {
    grid[row] = getEmptyRow(width);
  }
  return grid;
}

function getEmptyRow(width: number): GridCellState[] {
  const row = [];
  for (let col = 0; col < width; col++) {
    row[col] = getEmptyCell();
  }
  return row;
}

function getEmptyCell(): GridCellState {
  return {
    color: "0",
    status: CellStatus.EMPTY,
  };
}

let mainLoopIntervalId: any;

export function TetrisGrid(props: Props) {
  const { width, height, shapes } = props;

  const [loops, setLoops] = useState(0);

  // The state of the Tetris grid (board). Initially empty
  const [gridState, setGridState] = useState<GridState>(initEmptyGrid(width, height));

  // Tracks the index of the current shape
  const [shapeIndex, setShapeIndex] = useState(0);

  // The active shape will be represented by it's own GridState
  // Each shape will be merged with the above gridState to be rendered
  const [activeShapeGridState, setActiveShapeGridState] = useState<GridState>(
    getGridStateForNewShape(shapes[shapeIndex], width, height)
  );
  const activeShapeGridStateRef = useRef(activeShapeGridState);
  activeShapeGridStateRef.current = activeShapeGridState;

  // If a shape can be rotated into different positions, the position can be controlled by setting this index
  // This value is controlled by the user
  const [activeShapePositionIndex, setActiveShapePositionIndex] = useState(0);

  const runGameStep = useCallback(
    function runGameStep(activeShape: GridState): void {
      if (shapeIndex >= shapes.length) {
        // End of the array of provided shapes! Level done.
        console.log("end of the shapes!");
        return;
      }

      /* if (!activeShapeGridState) {
      // There is no current active shape. pick the next one
      let currentShape = shapes[shapeIndex];
      // Create a new GridState with the new shape in it, in the middle
      updatedShapesState = getGridStateForNewShape(currentShape, width, height);
    } */

      // Is this shape at the bottom?
      if (canShapeMoveDown1Step(activeShape, gridState) === false) {
        // It can't move down then!
        console.log("Active shape can't move down 1 step!");
        console.log("gridState", gridState);

        // MERGE this shape with the gridState to make it part of the background
        const updatedGridState = mergeShapeIntoGrid(activeShape, gridState);
        setGridState(updatedGridState);

        // Pick the next shape as "active"
        const nextShapeIndex = shapeIndex + 1;
        if (nextShapeIndex < shapes.length) {
          setShapeIndex(nextShapeIndex);
          setActiveShapeGridState(getGridStateForNewShape(shapes[nextShapeIndex], width, height));
        } else {
          clearInterval(mainLoopIntervalId);
        }
        return;
      } else {
        // The shape is not blocked, not at the bottom, and can move down 1 step
        // Move it down by 1, into a temp Shape
        console.log("Moving active shape down. activeShapeGridState", activeShape);

        const shapeMovedDown1Step = moveShapeDown(activeShape);

        // In it's new spot, will it collide with another shape?
        /* if (doesShapeCollideWithAnother(updatedShape, grid)) {
        console.log("shape COLLIDES - can't move it!");
        // Revert move. Shape can't move here!
        updatedShape = [...shape];
      } */
        setActiveShapeGridState(shapeMovedDown1Step);
      }
    },
    [activeShapeGridState, gridState, shapeIndex]
  );

  useInterval(function () {
    // Main tetris game loop
    //mainLoopIntervalId = setInterval(function () {
    //if (loops < 2) {
    //setLoops(loops + 1);
    runGameStep(activeShapeGridStateRef.current);
    //}
    // console.log(updatedGridState);
    // clearInterval(mainLoopIntervalId);
    //}, );
  }, 1000); // Run once a second

  // Handle key presses
  const arrowLeftKeyPressed = useKeyPress("ArrowLeft");
  const arrowRightKeyPressed = useKeyPress("ArrowRight");

  useEffect(
    function () {
      if (arrowLeftKeyPressed) {
        // Move the current shape left by 1, if there's room for it to move there
        console.log("MOVE LEFT!");
        // If it can move left, move it left.
        if (canShapeMoveLeft(activeShapeGridState, gridState)) {
          setActiveShapeGridState(moveShapeLeft(activeShapeGridState));
        }
      }
    },
    [arrowLeftKeyPressed]
  );

  const mergedGridState = mergeShapeIntoGrid(activeShapeGridState, gridState);
  console.log("mergedGridState", mergedGridState);

  // Output the TetrisGrid
  return (
    <div className="TetrisGrid">
      {mergedGridState.map((row: Array<GridCellState>, rowIndex: number) => {
        return (
          <div key={`row${rowIndex}`} className="row">
            {row.map((cell: GridCellState, cellIndex: number) => {
              return (
                <div key={`row${rowIndex}-cell${cellIndex}`} className="cell">
                  {cell.color}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// Can this shape move down 1 step? Or, has it reached the bottom of the grid, or another shape?
function canShapeMoveDown1Step(shape: GridState, grid: GridState): boolean {
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

function canShapeMoveLeft(shape: GridState, grid: GridState): boolean {
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

function moveShapeLeft(shape: GridState): GridState {
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

function doesShapeCollideWithAnother(shape: GridState, grid: GridState): boolean {
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

function mergeShapeIntoGrid(shape: GridState, grid: GridState): GridState {
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

function moveShapeDown(shape: GridState): GridState {
  // Since the top-left of the Grid is 0,0, moving down can be done by adding a new row to the
  // "top" and deleting the last row
  const movedShape = [...shape];
  // Remove last row
  movedShape.pop();
  const width = shape[0].length;
  // Add empty row to beginning
  movedShape.unshift(getEmptyRow(width));
  console.log("moved shape", movedShape);
  return movedShape;
}

function getGridStateForNewShape(
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
