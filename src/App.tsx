import React from "react";
import "./App.css";
import { TetrisGrid } from "./TetrisGrid";
import { line } from "./shapes/Line";
import { square } from "./shapes/Square";

export function App() {
  return (
    <div className="App">
      <TetrisGrid width={10} height={15} shapes={[line(), square()]} />
    </div>
  );
}
