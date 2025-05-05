import "react";
import styles from "../Styles/Tip_slide.module.css";
import React, { useState, useRef, useEffect } from "react";

const Tip_slide = ({ text_list, className ,interval}) => {
  const slide_interval = interval ? interval : 5000;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCircle, setSelectedCircle] = useState("1");
  const slidingRef = useRef(null);

  const slideToIndex = (index) => {
    slidingRef.current.classList.remove(styles.slideIn);
    slidingRef.current.classList.add(styles.slideOut);
    slidingRef.current.addEventListener(
      "animationend",
      () => {
        setCurrentIndex(index);
        setSelectedCircle((index + 1).toString());
        slidingRef.current.classList.remove(styles.slideOut);
        slidingRef.current.classList.add(styles.slideIn);
      },
      { once: true }
    );
  };

  const handleClick = (e) => {
    const index = parseInt(e.target.getAttribute("value")) - 1;
    if (index === currentIndex) return;
    slideToIndex(index);
  };

  // ⏲️ Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % text_list.length;
      slideToIndex(nextIndex);
    }, slide_interval);

    return () => clearInterval(interval); // Clean up
  }, [currentIndex,]);

  const currentTip = text_list[currentIndex];

  return (
    <div className={className}>
      <div className={styles.slideContainer} ref={slidingRef}>
        <img
          className={styles.imageContainer}
          src={currentTip.image}
          alt="عکس پیدا نشد"
        />
        <div className={styles.textContainer}>
          <h3 className={styles.titleContainer}>{currentTip.title}</h3>
          <p>{currentTip.desc}</p>
        </div>
      </div>
      <div className={styles.dotContainer}>
        {text_list.map((item, index) => (
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
        ))}
      </div>
    </div>
  );
};

export default Tip_slide;
