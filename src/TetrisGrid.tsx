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

  // The state of the grid. Initially empty
  const [gridState, setGridState] = useState<GridState>(initEmptyGrid(width, height));

  // Each shape will be represented by it's own GridState.
  // All the shapes will be merged into the above gridState to be rendered
  const [shapeGridState, setShapeGridState] = useState<GridState>();

  // Tracks the index of the current shape
  const [shapeIndex, setShapeIndex] = useState(0);

  // Tracks where the current shape is, vertically
  const [currentShapeVerticalIndex, setCurrentShapeVerticalIndex] = useState(0);

  // Drop new shapes in the middle
  const [currentShapeHorizontalIndex, setCurrentShapeHorizontalIndex] = useState(Math.floor(width / 2));

  function moveCurrentShapeDown(): GridState {
    if (shapeIndex >= shapes.length) {
      // End of the array of provided shapes! Level done.
      console.log("end of the shapes!");
      return gridState;
    }

    // Create the overall grid as we go, based on current state of the grid
    let grid = [...gridState];
    // Grid state with the current shape in it
    let updatedShapesState: GridState;

    if (!shapeGridState) {
      // There is no current active shape. pick the next one
      let currentShape = shapes[shapeIndex];
      // Create a new GridState with the new shape in it, in the middle
      updatedShapesState = getGridStateForNewShape(currentShape, width, height);
    }

    // TODO! keep going here!!!

    updatedShapesState = [...shapeGridState];

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
    setShapeGridState(updatedShapesState);
    return grid;
  }

  useEffect(
    function () {
      // Main tetris game loop
      setTimeout(function () {
        const updatedGridState = moveCurrentShapeDown();
        setGridState(updatedGridState);
        // console.log(updatedGridState);
        // clearInterval(mainLoopIntervalId);
      }, 1000); // Run once a second
    },
    [shapeGridState]
  );

  // Output the TetrisGrid
  return (
    <div className="TetrisGrid">
      {gridState.map((row: Array<GridCellState>) => {
        return (
          <div className="row">
            {row.map((cell: GridCellState) => {
              return <div className="cell">{cell.color}</div>;
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
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j].status !== CellStatus.EMPTY) {
        grid[i][j] = { ...shape[i][j] };
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

/* function getLineShape(width: number, height: number): GridState {
  const shape = initEmptyGrid(width, height);
  shape[0][0] = {
    color: "1",
    status: CellStatus.FULL,
  };
  shape[0][1] = {
    color: "1",
    status: CellStatus.FULL,
  };
  shape[0][2] = {
    color: "1",
    status: CellStatus.FULL,
  };
  shape[0][3] = {
    color: "1",
    status: CellStatus.FULL,
  };
  return shape;
} */

function getGridStateForNewShape(shape: Shape, width: number, height: number): GridState {
  const middleIndex = Math.floor(width / 2) - 1;
  const newShapeGrid = initEmptyGrid(width, height);

  // Assumes grid will always be big enough for the shape!
  // shape.positions.length is the HEIGHT of the new shape
  for (let i = 0; i < shape.positions.length; i++) {
    for (let j = 0; j < shape.positions[i].length; j++) {
      const currentPositionFlag = shape.positions[i][j];
      if (currentPositionFlag) {
        // Set the grid cell to ON!
        newShapeGrid[i][j + middleIndex] = {
          color: "1",
          status: CellStatus.FULL,
        };
      }
    }
  }
  return newShapeGrid;
}
