import React from "react";

interface Props {
  active: boolean;
}

export const Overlay: React.FunctionComponent<Props> = function (props) {
  return (
    <div id="overlay" style={{ display: props.active ? "flex" : "none" }}>
      <div className="message">{props.children}</div>
    </div>
  );
};
