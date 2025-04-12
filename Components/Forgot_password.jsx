import "react";
import styles from "../Styles/Login.module.css";
import React, { useState } from "react";
import { Toggle } from "@base-ui-components/react/toggle";
import { ToggleGroup } from "@base-ui-components/react/toggle-group";
import Tip_slide from "./Tip_slide";
import * as yup from "yup";
import { useLocation } from "react-router-dom";
import {
  getValidationCode,
  sendNewPassword,
} from "../Managers/ForgotPasswordManager";
import { Tooltip } from "react-tooltip";
import { Margin } from "@mui/icons-material";
//connection to back remain
const Forgot_password = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [errorEmail, setErrorEmail] = useState(null);
  const [errorValidationCode, setErrorValidationCode] = useState("");
  const [errorNewPassword, setErrorNewPassword] = useState({});

  const emailRef = useRef(null);
  const validationCodeRef = useRef(null);
  const newPasswordRef = useRef(null);

  const validationSchemaEmail = yup
    .string()
    .email("آدرس ایمیل نامعتبر است")
    .required("آدرس ایمیل برای عوض کردن رمز عبور لازم است");

  const validationSchemaCode = yup.string().required("کد نمیتواند خالی باشد");

  const validationSchemaPassword = yup.object().shape({
    newPassword: yup
      .string()
      .required("رمز عبور اجباری است")
      .min(8, "رمز عبور باید حداقل 8 کارکتر باشد")
      .matches(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$!%#*?&]{8,}$/,
        "کلمه عبور باید شامل حروف بزرگ و کوچک و حداقل یک عدد و یک کارکتر خاص باشد"
      ),
    repeatPassword: yup
      .string()
      .required("تکرار رمز عبور اجباری است")
      .matches(
        `${newPassword.newPassword}`,
        "تکرار رمز وارد شده با رمز تطابق ندارد"
      ),
  });

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleChangeCode = (e) => {
    setValidationCode(e.target.value);
  };
  const handleChangePassword = (e) => {
    setNewPassword({
      ...newPassword,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();

    try {
      await validationSchemaEmail.validate(email);
      //connection to backend remains
      let respEmail = await getValidationCode(email);
      if (respEmail.code == 201) {
        setTrueValidationCode(respEmail.validationCode);
        setErrorEmail(null);
        emailRef.current.classList.add(TipStyles.slideOut);
        emailRef.current.addEventListener(
          "animationend",
          () => {
            validationCodeRef.current.classList.add(TipStyles.slideIn);
            emailRef.current.style.display = "none";
            validationCodeRef.current.style.display = "block";
          },
          { once: true }
        );
      } else {
        throw new Error("متاسفانه برای ما مشکلی پیش آمده");
      }
    } catch (err) {
      setErrorEmail(err.message);
    }
  };

  const handleSubmitCode = async (e) => {
    e.preventDefault();

    try {
      await validationSchemaCode.validate(validationCode);
      if (validationCode != trueValidationCode) {
        throw new Error("کد وارد شده نادرست است");
      } else {
        setErrorValidationCode(null);
        validationCodeRef.current.classList.add(TipStyles.slideOut);
        validationCodeRef.current.addEventListener(
          "animationend",
          () => {
            newPasswordRef.current.classList.add(TipStyles.slideIn);
            validationCodeRef.current.style.display = "none";
            newPasswordRef.current.style.display = "block";
          },
          { once: true }
        );
      }
    } catch (err) {
      setErrorValidationCode(err.message);
    }
  };

  const handleSubmitNewPassword = async (e) => {
    e.preventDefault();

    try {
      await validationSchemaPassword.validate(newPassword, {
        abortEarly: false,
      });
      setErrorNewPassword({});
      let resp = await sendNewPassword(
        email,
        newPassword.newPassword,
        newPassword.repeatPassword
      );
      console.log(resp);
      if (resp.code == 201) {
        console.log("here we must route to dashboard");
      }
    } catch (err) {
      const validationErrors = {};
      err.inner.forEach((error) => {
        validationErrors[error.path] = error.message;
      });

      setErrorNewPassword(validationErrors);
    }
  };
  return (
    <div className={styles.Bakcground}>
      <div className={styles.Box}>
        <div className={styles.InnerBox}>
          <div className={styles.detailsContainer}>
            <div className={styles.Title}>ایران سند</div>
            <Tip_slide
              text_list={login_slides}
              className={styles.InformationContainer}
            />
          </div>
          <div className={styles.formBox}>
            <span className={styles.loginTitle}>فراموشی رمز عبور</span>
            <form
              onSubmit={handleSubmitEmail}
              className={styles.inputsBox}
              ref={emailRef}
            >
              <div>
                <label className={styles.inputsBoxLabels} htmlFor="email">
                  ایمیل
                </label>
                <br />
                <Input
                  className={
                    !errorEmail ? styles.inputField : styles.inputFieldError
                  }
                  onChange={handleChangeEmail}
                  type="text"
                  id="email"
                  name="email"
                  value={email}
                  data-tooltip-id="email_tooltip"
                  style={{direction:'ltr'}}
                />
                {errorEmail && (
                  <Tooltip
                    id="email_tooltip"
                    className={styles.errors}
                    content={errorEmail}
                  />
                )}
              </div>
              <button type="submit" className={styles.submitBtn} style={{marginTop:"10%"}}>
                ارسال کد
              </button>
            </form>
            <form
              onSubmit={handleSubmitCode}
              className={styles.inputsBox}
              ref={validationCodeRef}
              style={{ display: "none" }}
            >
              <div>
                <label
                  className={styles.inputsBoxLabels}
                  htmlFor="validationCode"
                >
                  کد ارسال شده به ایمیل
                </label>
                <br />
                <Input
                  className={
                    !errorValidationCode
                      ? styles.inputField
                      : styles.inputFieldError
                  }
                  onChange={handleChangeCode}
                  type="text"
                  id="validationCode"
                  name="validationCode"
                  value={validationCode}
                  data-tooltip-id="validation_tooltip"
                />
                {errorValidationCode && (
                  <Tooltip
                    id="validation_tooltip"
                    className={styles.errors}
                    content={errorValidationCode}
                  />
                )}
              </div>
              <button type="submit" className={styles.submitBtn} style={{marginTop:"10%"}}>
                تایید کد
              </button>
            </form>
            <form
              onSubmit={handleSubmitNewPassword}
              className={styles.inputsBox}
              ref={newPasswordRef}
              style={{ display: "none" }}
            >
              <div className={styles.password}>
                <label className={styles.inputsBoxLabels} htmlFor="newPassword">
                  رمز عبور جدید
                </label>
                <br />
                <Input
                  className={
                    !errorNewPassword.newPassword
                      ? styles.inputField
                      : styles.inputFieldError
                  }
                  onChange={handleChangePassword}
                  type="Password"
                  id="newPassword"
                  name="newPassword"
                  value={newPassword.newPassword}
                  data-tooltip-id="password_tooltip"
                />
                <br />
                {errorNewPassword.newPassword && (
                  <Tooltip
                    id="password_tooltip"
                    className={styles.errors}
                    content={errorNewPassword.newPassword}
                  />
                )}
                <label
                  className={styles.inputsBoxLabels}
                  htmlFor="repeatPassword"
                >
                  تکرار رمز عبور جدید
                </label>
                <br />
                <Input
                  className={
                    !errorNewPassword.repeatPassword
                      ? styles.inputField
                      : styles.inputFieldError
                  }
                  onChange={handleChangePassword}
                  type="Password"
                  id="repeatPassword"
                  name="repeatPassword"
                  value={newPassword.repeatPassword}
                  data-tooltip-id="repeatPassword_tooltip"
                />
                <br />
                {errorNewPassword.repeatPassword && (
                  <Tooltip
                    id="repeatPassword_tooltip"
                    className={styles.errors}
                    content={errorNewPassword.repeatPassword}
                  />
                )}
                <button type="submit" className={styles.submitBtn} style={{marginTop:"10%"}}>
                  تایید
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Forgot_password;
