import "react";
import styles from "../Styles/Tip_slide.module.css";

import React, { useState, useRef } from "react";

const Tip_slide = ({ text_list, className }) => {
  const currentTip = useRef(text_list[0]);
  const [selectedCircle, setSelectedCircle] = useState("1");
  const slidingRef = useRef(null);

  const handleClick = (e) => {
    const index = e.target.getAttribute("value");

    slidingRef.current.classList.remove(styles.slideIn);
    slidingRef.current.classList.add(styles.slideOut);

    slidingRef.current.addEventListener(
      "animationend",
      () => {
        currentTip.current = text_list[index - 1];
        setSelectedCircle(index);

        slidingRef.current.classList.remove(styles.slideOut);
        slidingRef.current.classList.add(styles.slideIn);
      },
      { once: true }
    );
  };
  return (
    <div className={className}>
      <div className={styles.textContainer} ref={slidingRef}>
        <h3 className={styles.titleContainer}>{currentTip.current.title}</h3>
        <p>{currentTip.current.desc}</p>
      </div>
      <div className={styles.dotContainer}>
        {text_list.map((item) => {
          return (
            <svg
              className={styles.tipDot}
              key={item.id}
              value={item.id}
              onClick={handleClick}
              width="6%"
              height="60%"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                value={item.id}
                cx="50%"
                cy="50%"
                r="30%"
                fill={selectedCircle == item.id ? "white" : "#B2B2B2"}
              />
            </svg>
          );
        })}
      </div>
    </div>
  );
};

export default Tip_slide;
