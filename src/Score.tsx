import React from "react";

interface Props {
  level: number;
  score: number;
}

export function Score(props: Props) {
  return (
    <div className="Score">
      <div>Score: {props.score}</div>
      <div>Level: {props.level}</div>
    </div>
  );
}
