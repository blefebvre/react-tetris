import React, { useState } from "react";
import "./App.css";
import { TetrisGrid } from "./TetrisGrid";
import { getRandomShapes, getNumberOfShapesForLevel } from "./shapes/Generator";
import { Footer } from "./Footer";
import { Overlay } from "./Overlay";
import { Shape } from "./shapes/Shape";

export function App() {
  // Start at level 1
  const [level, setLevel] = useState(1);
  // The shapes, ordered by how they will appear. This is empty until "Go" is clicked
  const [shapes, setShapes] = useState<Shape[]>([]);
  // Overlay which shows the current level and "Go" button
  const [showOverlay, setShowOverlay] = useState(true);
  // Overlay which shows "Game over"
  const [showGameOver, setShowGameOver] = useState(false);

  function goClicked() {
    setShowOverlay(false);
    //setShapes(getRandomShapes(getNumberOfShapesForLevel(level)));
    setShapes(getRandomShapes(4));
  }

  function gameOver() {
    setShowGameOver(true);
  }

  function levelComplete() {
    const nextLevel = level + 1;
    setShowOverlay(true);
    setLevel(nextLevel);
  }

  function reset() {
    setLevel(1);
    setShapes(getRandomShapes(getNumberOfShapesForLevel(1)));
    setShowGameOver(false);
  }

  return (
    <div className="App">
      <TetrisGrid
        level={level}
        width={10}
        height={15}
        shapes={shapes}
        gameOver={gameOver}
        levelComplete={levelComplete}
      />
      <Overlay active={showOverlay}>
        Level {level}. Ready? <br /> <button onClick={goClicked}>Go!</button>
      </Overlay>
      <Overlay active={showGameOver}>
        Game over{" "}
        <span role="img" aria-label="confounded face">
          😖
        </span>{" "}
        <br /> <button onClick={reset}>Play again?</button>
      </Overlay>
      <Footer />
    </div>
  );
}
