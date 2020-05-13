import React, { useState, useEffect } from "react";
import "./App.css";
import { Shape } from "./shapes/Shape";

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
  for (let i = 0; i < height; i++) {
    grid[i] = getEmptyRow(width);
  }
  return grid;
}

function getEmptyRow(width: number): GridCellState[] {
  const row = [];
  for (let j = 0; j < width; j++) {
    row[j] = {
      color: "0",
      status: CellStatus.EMPTY,
    };
  }
  return row;
}

let mainLoopIntervalId: any;

export function TetrisGrid(props: Props) {
  const { width, height, shapes } = props;

  // The state of the Tetris grid (board). Initially empty
  const [gridState, setGridState] = useState<GridState>(initEmptyGrid(width, height));

  // Tracks the index of the current shape
  const [shapeIndex, setShapeIndex] = useState(0);

  // The active shape will be represented by it's own GridState
  // Each shape will be merged with the above gridState to be rendered
  const [activeShapeGridState, setActiveShapeGridState] = useState<GridState>(
    getGridStateForNewShape(shapes[shapeIndex], width, height, Math.floor(width / 2) - 1)
  );

  // Tracks where the active shape is, vertically (y)
  const [activeShapeVerticalIndex, setActiveShapeVerticalIndex] = useState(0);

  // If a shape can be rotated into different positions, the position can be controlled by setting this index
  // This value is controlled by the user
  const [activeShapePositionIndex, setActiveShapePositionIndex] = useState(0);

  // Tracks where the active shape is, horizontally (x). New shapes all start in the middle
  // This value is controlled by the user
  const [activeShapeHorizontalIndex, setActiveShapeHorizontalIndex] = useState(Math.floor(width / 2));

  function runGameStep(): void {
    if (shapeIndex >= shapes.length) {
      // End of the array of provided shapes! Level done.
      console.log("end of the shapes!");
      return;
    }

    // Create the overall grid as we go, based on current state of the grid
    let grid = [...gridState];
    // Grid state with the current shape in it
    let updatedShapesState: GridState;
    /* 
    if (!activeShapeGridState) {
      // There is no current active shape. pick the next one
      let currentShape = shapes[shapeIndex];
      // Create a new GridState with the new shape in it, in the middle
      updatedShapesState = getGridStateForNewShape(currentShape, width, height);
    }

    // TODO! keep going here!!!

    updatedShapesState = [...activeShapeGridState];

    const shape = updatedShapesState[i];
    let updatedShape: GridState = [...shape];
    // Is this shape at the bottom?
    if (isShapeAtTheBottomOfGrid(shape)) {
      // It can't move down then!
      console.log("shape is at the bottom!");
    } else {
      // It's not yet at the bottom
      // Move it down by 1, into a temp Shape
      updatedShape = moveShapeDown(shape);
      console.log("updatedShape:", updatedShape);
      // In it's new spot, will it collide with another shape?
      if (doesShapeCollideWithAnother(updatedShape, grid)) {
        console.log("shape COLLIDES - can't move it!");
        // Revert move. Shape can't move here!
        updatedShape = [...shape];
      }
      updatedShapesState[i] = updatedShape;
      grid = putShapeIntoGrid(updatedShape, grid);
    }
    setActiveShapeGridState(updatedShapesState);

    setGridState(grid); */
  }

  useEffect(
    function () {
      // Main tetris game loop
      //setTimeout(function () {
      //runGameStep();
      // console.log(updatedGridState);
      // clearInterval(mainLoopIntervalId);
      //}, 1000); // Run once a second
    },
    [activeShapeGridState]
  );

  const mergedGridState = putShapeIntoGrid(activeShapeGridState, gridState);

  // Output the TetrisGrid
  return (
    <div className="TetrisGrid">
      {gridState.map((row: Array<GridCellState>, rowIndex: number) => {
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

function isShapeAtTheBottomOfGrid(shape: GridState): boolean {
  const lastRowIndex = shape.length - 1;
  // If any of the cells in the last row are NOT empty, we're at the bottom
  for (let j = 0; j < shape[lastRowIndex].length; j++) {
    // TODO: DEMO! if (shape[lastRowIndex][j] !== CellStatus.EMPTY) {
    if (shape[lastRowIndex][j].status !== CellStatus.EMPTY) {
      return true;
    }
  }
  return false;
}

function doesShapeCollideWithAnother(shape: GridState, grid: GridState): boolean {
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j].status !== CellStatus.EMPTY && grid[i][j].status !== CellStatus.EMPTY) {
        // There's already a shape in this spot!
        return true;
      }
    }
  }
  return false;
}

function putShapeIntoGrid(shape: GridState, grid: GridState): GridState {
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x].status !== CellStatus.EMPTY) {
        grid[y][x] = { ...shape[y][x] };
      }
    }
  }
  return grid;
}

function moveShapeDown(shape: GridState): GridState {
  // Since the top-left of the Grid is 0,0, moving down can be done by adding a new  row to the
  // "top" and deleting the last row
  const movedShape = [...shape];
  // Remove last row
  movedShape.pop();
  const width = shape[0].length;
  // Add empty row to beginning
  movedShape.unshift(getEmptyRow(width));
  return movedShape;
}

function getGridStateForNewShape(shape: Shape, width: number, height: number, xPos: number): GridState {
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
  console.log("newShapeGrid", newShapeGrid);
  return newShapeGrid;
}
