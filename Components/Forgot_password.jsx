import "react";
import styles from "../Styles/Login.module.css";
import TipStyles from "../Styles/Tip_slide.module.css";
import React, { useRef, useState } from "react";
import { login_slides } from "../Scripts/mock_data";
import { Input } from "@base-ui-components/react/input";
import Tip_slide from "./Tip_slide";
import * as yup from "yup";
import { useLocation } from "react-router-dom";
import {
  getValidationCode,
  sendNewPassword,
} from "../Managers/ForgotPasswordManager";

const Forgot_password = () => {
  const [trueValidationCode, setTrueValidationCode] = useState("");
  const location = useLocation();
  const [email, setEmail] = useState(
    location.state ? location.state.email : ""
  );
  const [validationCode, setValidationCode] = useState("");
  const [newPassword, setNewPassword] = useState({
    newPassword: "",
    repeatPassword: "",
  });

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
    password: yup
      .string()
      .required("رمز عبور اجباری است")
      .min(8, "رمز عبور باید حداقل 8 کارکتر باشد")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        "کلمه عبور باید شامل حروف بزرگ و کوچک و حداقل یک عدد و یک کارکتر خاص باشد"
      ),
    repeatPassword: yup
      .string()
      .required("تکرار رمز عبور اجباری است")
      .min(8, "تکرار رمز عبور باید حداقل 8 کارکتر باشد")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        "تکرار کلمه عبور باید شامل حروف بزرگ و کوچک و حداقل یک عدد و یک کارکتر خاص باشد"
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
      ...validationSchemaPassword,
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
        console.log(validationCode);
        console.log(trueValidationCode);
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
      await validationSchemaPassword.validate(newPassword);
      //connection to back remain
      if (newPassword.newPassword !== newPassword.repeatPassword) {
        throw new Error("کلمه عبور و تکرار آن یکسان نیستند");
      }
      let resp = await sendNewPassword(
        newPassword.newPassword,
        newPassword.repeatPassword
      );
      setErrorNewPassword({});
    } catch (err) {
      const validationErrors = {};
      console.log(err.inner);
      err.inner.forEach((error) => {
        console.log(error.path);
        //validationErrors[error.path] = error.message;
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
                  className={styles.inputField}
                  onChange={handleChangeEmail}
                  type="text"
                  id="email"
                  name="email"
                  value={email}
                />
                {errorEmail && (
                  <div className={styles.errors}>{errorEmail}</div>
                )}
              </div>
              <button type="submit" className={styles.submitBtn}>
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
                  className={styles.inputField}
                  onChange={handleChangeCode}
                  type="text"
                  id="validationCode"
                  name="validationCode"
                  value={validationCode}
                />
                {errorValidationCode && (
                  <div className={styles.errors}>{errorValidationCode}</div>
                )}
              </div>
              <button type="submit" className={styles.submitBtn}>
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
                <label className={styles.inputsBoxLabels} htmlFor="newpassword">
                  رمز عبور جدید
                </label>
                <br />
                <Input
                  className={styles.inputField}
                  onChange={handleChangePassword}
                  type="newPassword"
                  id="newPassword"
                  name="newPassword"
                  value={newPassword.newPassword}
                />
                <br />
                {errorNewPassword.newPassword && (
                  <div className={styles.errors}>
                    {errorNewPassword.newPassword}
                  </div>
                )}
                <label
                  className={styles.inputsBoxLabels}
                  htmlFor="repeatPassword"
                >
                  تکرار رمز عبور جدید
                </label>
                <br />
                <Input
                  className={styles.inputField}
                  onChange={handleChangePassword}
                  type="repeatPassword"
                  id="repeatPassword"
                  name="repeatPassword"
                  value={newPassword.repeatPassword}
                />
                <br />
                {errorNewPassword.repeatPassword && (
                  <div className={styles.errors}>
                    {errorNewPassword.repeatPassword}
                  </div>
                )}
                <button type="submit" className={styles.submitBtn}>
                  تایید
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Forgot_password;
