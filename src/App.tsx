import React from "react";
import "./App.css";
import { TetrisGrid } from "./TetrisGrid";
import { getRandomShapes } from "./shapes/Generator";
import { Footer } from "./Footer";
import { line } from "./shapes/Line";
import { square } from "./shapes/Square";

export function App() {
  return (
    <div className="App">
      <TetrisGrid width={10} height={15} shapes={getRandomShapes(30)} />
      {/* <TetrisGrid width={10} height={15} shapes={[line(), line(), square(), square(), square(), square(), square()]} /> */}
      <Footer />
    </div>
  );
}
