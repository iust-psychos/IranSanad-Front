import "react";
import styles from "../Styles/Login.module.css";
import React, { useState } from "react";
import { Box, Button, useTheme } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import CircleIcon from "@mui/icons-material/Circle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { login_slides } from "../Scripts/mock_data";

function Login() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();

  const handleFirst = (e) => {
    console.log(currentIndex);
    setCurrentIndex(1);
  };

  const handleSecond = (e) => {
    console.log(currentIndex);
    setCurrentIndex(2);
  };
  const handleThird = (e) => {
    console.log(currentIndex);
    setCurrentIndex(3);
  };
  const handleFourth = (e) => {
    console.log(currentIndex);
    setCurrentIndex(4);
  };
  return (
    <div className={styles.Bakcground}>
      <div className={styles.Box}>
        <div className={styles.InnerBox}>
          <div className={styles.detailsContainer}>
            <span className={styles.Title}>ایران سند</span>
            <div className={styles.ImageContainer}>
              <img
                src="../src/Images/b8fce91ad812f4581b7eebab2147575e.png"
                className={styles.image}
              />
            </div>
            <div className={styles.InformationContainer}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  maxWidth: 800,
                  margin: "0 auto",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    transition: "transform 0.5s ease-in-out",
                    transform: `translateX(-${currentIndex * 100}%)`,
                  }}
                >
                  {login_slides.map((slide) => (
                    <Box
                      key={slide.id}
                      sx={{
                        minWidth: "100%",
                        boxSizing: "border-box",
                        height: "40%",
                      }}
                    >
                      <span className={styles.infoTitle}>{slide.title}</span>
                      <br />
                      <p className={styles.infoContent}>{slide.desc}</p>
                    </Box>
                  ))}
                </Box>
                <div className={styles.sliderBtns}>
                  <CircleIcon
                    onClick={handleFirst}
                    fontSize="small"
                    sx={{
                      color: "#B2B2B2",
                    }}
                  />
                  <CircleIcon
                    onClick={handleSecond}
                    fontSize="small"
                    sx={{
                      color: "#B2B2B2",
                    }}
                  />
                  <CircleIcon
                    onClick={handleThird}
                    fontSize="small"
                    sx={{
                      color: "#FFFFFF",
                    }}
                  />
                  <CircleIcon
                    onClick={handleFourth}
                    fontSize="small"
                    sx={{
                      color: "#B2B2B2",
                    }}
                  />
                </div>
              </Box>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default Login;
