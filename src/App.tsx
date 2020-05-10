import React from "react";
import "./App.css";
import { TetrisGrid } from "./TetrisGrid";

export function App() {
  return (
    <div className="App">
      <TetrisGrid width={10} height={20} />
    </div>
  );
}
