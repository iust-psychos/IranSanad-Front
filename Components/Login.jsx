import "react";
import styles from "../Styles/Login.module.css";
import React, { useRef, useState } from "react";
import { Box, Button, useTheme } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import CircleIcon from "@mui/icons-material/Circle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { login_slides } from "../Scripts/mock_data";
import { Input } from "@base-ui-components/react/input";
import InfoIcon from '@mui/icons-material/Info';
import Tip_slide from './Tip_slide';


const Login = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const dotOne = useRef(null);
  const dotTwo = useRef(null);
  const dotThree = useRef(null);
  const dotFour = useRef(null);
  const theme = useTheme();

  const handleFirst = (e) => {
    console.log(currentIndex);
    setCurrentIndex(1);
    dotOne.current.style.color = "#FFFFFF";
    dotTwo.current.style.color = "#B2B2B2";
    dotThree.current.style.color = "#B2B2B2";
    dotFour.current.style.color = "#B2B2B2";
  };

  const handleSecond = (e) => {
    console.log(currentIndex);
    setCurrentIndex(2);
    dotOne.current.style.color = "#B2B2B2";
    dotTwo.current.style.color = "#FFFFFF";
    dotThree.current.style.color = "#B2B2B2";
    dotFour.current.style.color = "#B2B2B2";
  };
  const handleThird = (e) => {
    console.log(currentIndex);
    setCurrentIndex(3);
    dotOne.current.style.color = "#B2B2B2";
    dotTwo.current.style.color = "#B2B2B2";
    dotThree.current.style.color = "#FFFFFF";
    dotFour.current.style.color = "#B2B2B2";
  };
  const handleFourth = (e) => {
    console.log(currentIndex);
    setCurrentIndex(4);
    dotOne.current.style.color = "#B2B2B2";
    dotTwo.current.style.color = "#B2B2B2";
    dotThree.current.style.color = "#B2B2B2";
    dotFour.current.style.color = "#FFFFFF";
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
            <Tip_slide text_list={login_slides} className={styles.InformationContainer} />
            {/* <div className={styles.InformationContainer}>
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
                    ref={dotOne}
                    sx={{
                      color: "#B2B2B2",
                      cursor: "pointer",
                    }}
                  />
                  <CircleIcon
                    onClick={handleSecond}
                    fontSize="small"
                    ref={dotTwo}
                    sx={{
                      color: "#B2B2B2",
                      cursor: "pointer",
                    }}
                  />
                  <CircleIcon
                    onClick={handleThird}
                    fontSize="small"
                    ref={dotThree}
                    sx={{
                      color: "#FFFFFF",
                      cursor: "pointer",
                    }}
                  />
                  <CircleIcon
                    onClick={handleFourth}
                    fontSize="small"
                    ref={dotFour}
                    sx={{
                      color: "#B2B2B2",
                      cursor: "pointer",
                    }}
                  />
                </div>
              </Box>
            </div> */}
          </div>
          <div className={styles.formBox}>
            <span className={styles.loginTitle}>ورود به حساب</span>
            <div className={styles.inputsBox}>
              <form>
                <div>
                  <label className={styles.inputsBoxLabels} htmlFor="username">
                    نام کاربری
                  </label>
                  <br />
                  <Input className={styles.inputField} type="text" id="username" />
                </div>
                <div className={styles.password}>
                  <label className={styles.inputsBoxLabels} htmlFor="password">
                    رمز عبور
                  </label>
                  <InfoIcon sx={{ 
                    position:'absolute',
                    top:'34%',
                    color: '#D4D4D4',
                    width: '20px',
                    height: '20px',
                    left: '20%'
                  }}/>
                  <br />
                  <Input className={styles.inputField} type="password" id="password" /> <br />
                  <p><a href="#" className={styles.forgetpasswordlink}>فراموشی رمز عبور؟</a></p>

                  <button type="submit" className={styles.submitBtn}>ورود</button>
                  <p className={styles.noAccLink}>حساب ندارید؟<a href="#" className={styles.forgetpasswordlink}>ثبت نام کنید.</a></p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
