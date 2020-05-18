import React from "react";

interface Props {
  rotateShape(): void;
  moveLeft(): void;
  moveDown(): void;
  moveRight(): void;
}

export function Controls(props: Props) {
  const { rotateShape, moveLeft, moveDown, moveRight } = props;

  return (
    <div className="Controls">
      {/* Controls for devices without keyboards */}
      <div className="Controls-TopRow">
        <button onClick={() => rotateShape()}>
          <span role="img" aria-label="rotate arrow button (counter clockwise)">
            🔄
          </span>
        </button>
      </div>
      <div className="Controls-BottomRow">
        <button onClick={() => moveLeft()}>
          <span role="img" aria-label="left arrow button">
            ⏪
          </span>
        </button>
        <button onClick={() => moveDown()}>
          <span role="img" aria-label="down arrow button">
            ⏬
          </span>
        </button>
        <button onClick={() => moveRight()}>
          <span role="img" aria-label="right arrow button">
            ⏩
          </span>
        </button>
      </div>
    </div>
  );
}
