import React, { useState } from "react";
import "./App.css";

interface Props {
  height: number;
  width: number;
}

interface GridCellState {
  color: string;
}

// Return 2d array of GridCellState items
function initEmptyGrid(width: number, height: number): Array<Array<GridCellState>> {
  const grid: Array<Array<GridCellState>> = [];
  for (let i = 0; i < height; i++) {
    grid[i] = [];
    for (let j = 0; j < width; j++) {
      grid[i][j] = {
        color: "0",
      };
    }
  }
  return grid;
}

export function TetrisGrid(props: Props) {
  const { width, height } = props;
  const [gridState, setGridState] = useState(initEmptyGrid(width, height));

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
