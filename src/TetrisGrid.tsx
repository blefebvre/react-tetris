import React, { useState, useEffect } from "react";
import "./App.css";

interface Props {
  height: number;
  width: number;
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
type Shape = GridState;

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
  const { width, height } = props;

  // The state of the grid. Initially empty
  const [gridState, setGridState] = useState<GridState>(initEmptyGrid(width, height));

  // Each shape will be represented by it's own GridState.
  // All the shapes will be merged into the above gridState to be rendered
  const [shapesState, setShapesState] = useState<GridState[]>([getLineShape(width, height)]);

  function moveUnstuckShapesDown(): GridState {
    // Start with the first shape, creating the overall grid as we go
    let grid = initEmptyGrid(width, height);
    // Loop through all shapes
    const updatedShapesState = [...shapesState];
    for (let i = 0; i < updatedShapesState.length; i++) {
      const shape = updatedShapesState[i];
      let updatedShape: Shape = [...shape];
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
      }
      updatedShapesState[i] = updatedShape;
      grid = putShapeIntoGrid(updatedShape, grid);
    }
    setShapesState(updatedShapesState);
    return grid;
  }

  useEffect(
    function () {
      // Main tetris game loop
      setTimeout(function () {
        const updatedGridState = moveUnstuckShapesDown();
        setGridState(updatedGridState);
        // console.log(updatedGridState);
        // clearInterval(mainLoopIntervalId);
      }, 1000); // Run once a second
    },
    [shapesState]
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

function isShapeAtTheBottomOfGrid(shape: Shape): boolean {
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

function doesShapeCollideWithAnother(shape: Shape, grid: GridState): boolean {
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

function putShapeIntoGrid(shape: Shape, grid: GridState): GridState {
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j].status !== CellStatus.EMPTY) {
        grid[i][j] = { ...shape[i][j] };
      }
    }
  }
  return grid;
}

function moveShapeDown(shape: Shape): Shape {
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

function getLineShape(width: number, height: number): Shape {
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
}
