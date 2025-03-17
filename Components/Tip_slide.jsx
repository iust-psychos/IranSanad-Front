import "react";
import "../Styles/Tip_slide.css";
import React, { useState } from "react";
import { Toggle } from "@base-ui-components/react/toggle";
import { ToggleGroup } from "@base-ui-components/react/toggle-group";

const Tip_slide = ({ text_list, className }) => {
  const [currentTip, setCurrentTip] = useState(text_list[0]);
  let tipsCount = text_list.length
  const dotSVG = (
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="green"
        stroke-width="4"
        fill="yellow"
      />
    </svg>
  );
  const activeDotSVG = (
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="red"
        stroke-width="4"
        fill="yellow"
      />
    </svg>
  );

  return (
    <div className={className}>
      <div className="titleContainer">
        <h3>{currentTip.title}</h3>
      </div>
      <div className="textContainer">
        <p>{currentTip.desc}</p>
      </div>
      <div className="dotContainer"></div>
    </div>
  );
}

export default Tip_slide;
