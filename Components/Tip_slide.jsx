import "react";
import styles from "../Styles/Tip_slide.module.css";
import React, { useState, useRef } from "react";

const Tip_slide = ({ text_list, className }) => {
  const currentTip = useRef(text_list[0]);
  const [selectedCircle, setSelectedCircle] = useState("1");
  const slidingRef = useRef(null);

  const handleClick = (e) => {
    if (e.target.getAttribute("value") == selectedCircle) {
      return null;
    }

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
      <div className={styles.slideContainer} ref={slidingRef}>
        <img
          className={styles.imageContainer}
          src={currentTip.current.image}
          alt="عکس پیدا نشد"
        />
        <div className={styles.textContainer}>
          <h3 className={styles.titleContainer}>{currentTip.current.title}</h3>
          <p> {currentTip.current.desc}</p>
        </div>
      </div>
      <div className={styles.dotContainer}>
        {text_list.map((item) => {
          return (
            <svg
              className={styles.svgContainer}
              key={item.id}
              value={item.id}
              onClick={handleClick}
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className={styles.tipCircle}
                value={item.id}
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
