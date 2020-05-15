import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import { Shape } from "./shapes/Shape";
import { useKeyPress } from "./hooks/useKeyPress";
import { useInterval } from "./hooks/useInterval";
import { GridCellState, GridState, initEmptyGrid, getGridStateForShape, mergeShapeIntoGrid } from "./model/Grid";
import {
  canShapeMoveDown1Step,
  moveShapeDown,
  canShapeMoveLeft,
  moveShapeLeft,
  canShapeMoveRight,
  moveShapeRight,
} from "./physics/Movement";

interface Props {
  height: number;
  width: number;
  shapes: Shape[];
}

export function TetrisGrid(props: Props) {
  const { width, height, shapes } = props;

  const [isRunning, setIsRunning] = useState(true);

  // The state of the Tetris grid (board). Initially empty
  const [gridState, setGridState] = useState<GridState>(initEmptyGrid(width, height));

  // Tracks the index of the current shape
  const [shapeIndex, setShapeIndex] = useState(0);

  // If a shape can be rotated into different positions, the position can be controlled by setting this index
  // This value is controlled by the user
  const [activeShapePositionIndex, setActiveShapePositionIndex] = useState(0);

  // Track the active shape's position for when we need to rotate it
  const [activeShapeRow, setActiveShapeRow] = useState(0);
  const [activeShapeCol, setActiveShapeCol] = useState(Math.floor(width / 2 - 1));

  // The active shape will be represented by it's own GridState
  // Each shape will be merged with the above gridState to be rendered
  const activeShapeGridState = getGridStateForShape(
    shapes[shapeIndex],
    activeShapePositionIndex,
    activeShapeRow,
    activeShapeCol,
    width,
    height
  );

  const runGameStep = useCallback(
    function runGameStep(): void {
      // Is this shape at the bottom?
      if (canShapeMoveDown1Step(activeShapeGridState, gridState) === false) {
        // It can't move down then!
        console.log("Active shape CAN'T move down 1 step!");

        // MERGE this shape with the gridState to make it part of the background
        const updatedGridState = mergeShapeIntoGrid(activeShapeGridState, gridState);
        setGridState(updatedGridState);

        // Pick the next shape as "active", or finish the game
        const nextShapeIndex = shapeIndex + 1;
        if (nextShapeIndex < shapes.length) {
          setShapeIndex(nextShapeIndex);
          // Reset the active shape's position state
          setActiveShapeRow(0);
          setActiveShapeCol(Math.floor(width / 2 - 1));
          setActiveShapePositionIndex(0);
        } else {
          // Stop the game loop: done!
          console.log("Done! out of shapes.");
          setIsRunning(false);
        }
        return;
      } else {
        // The shape is not blocked, not at the bottom, and CAN move down 1 step
        // Move it down by 1, into a temp Shape
        console.log("Moving active shape down.");
        setActiveShapeRow(activeShapeRow + 1);
      }
    },
    [activeShapeGridState, activeShapeRow, gridState, shapeIndex, shapes.length]
  );

  ////////////////////////
  // Main tetris game loop
  ////////////////////////
  useInterval(
    function () {
      runGameStep();
    },
    isRunning ? 1000 : null
  ); // Run once a second when isRunning === true

  // Handle key presses
  const arrowLeftKeyPressed = useKeyPress("ArrowLeft");
  const arrowRightKeyPressed = useKeyPress("ArrowRight");

  useEffect(
    function () {
      if (arrowLeftKeyPressed) {
        // Move the current shape left by 1, if there's room for it to move there
        console.log("MOVE LEFT!");
        if (canShapeMoveLeft(activeShapeGridState, gridState)) {
          setActiveShapeCol(activeShapeCol - 1);
        }
      }
    },
    // With react-hooks/exhaustive-deps rule "fixed", pressing an arrow key results in the shape
    // moving ALL THE WAY over to the right/left
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [arrowLeftKeyPressed]
  );

  useEffect(
    function () {
      if (arrowRightKeyPressed) {
        // Move the current shape right by 1, if there's room for it to move there
        console.log("MOVE RIGHT!");
        if (canShapeMoveRight(activeShapeGridState, gridState)) {
          setActiveShapeCol(activeShapeCol + 1);
        }
      }
    },
    // With react-hooks/exhaustive-deps rule "fixed", pressing an arrow key results in the shape
    // moving ALL THE WAY over to the right/left
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [arrowRightKeyPressed]
  );

  // Put the current shape and the grid together
  const mergedGridState = mergeShapeIntoGrid(activeShapeGridState, gridState);

  // Output the TetrisGrid based on this mergedGridState
  return (
    <div className="TetrisGrid">
      {/* Loop through each ROW of the grid matrix */}
      {mergedGridState.map((row: Array<GridCellState>, rowIndex: number) => {
        return (
          <div key={`row${rowIndex}`} className="row">
            {/* Loop through each CELL in the current row */}
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
