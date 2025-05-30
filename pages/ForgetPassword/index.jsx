import "react";
import styles from "@/styles/Login.module.css";
import TipStyles from "@/styles/TipSlide.module.css";
import React, { useRef, useState } from "react";
import { login_slides } from "@/utils/MockData";
import { Input } from "@base-ui-components/react/input";
import Tip_slide from "@/components/TipSlide";
import * as yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "@/utils/toast.js";
import InfoIcon from "@mui/icons-material/Info";
import {
  sendValidationCode,
  sendNewPassword,
  verify,
  resendCode,
} from "@/managers/ForgetPasswordManager";
import { Tooltip } from "react-tooltip";
import { RingLoader } from "react-spinners";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Forgot_password = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(
    location.state ? location.state.email : ""
  );
  const [validationCode, setValidationCode] = useState("");
  const [newPassword, setNewPassword] = useState({
    newPassword: "",
    repeatPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passFieldType, setPassFieldType] = useState("password");

  const navigate = useNavigate();

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
      .oneOf(
        [yup.ref("newPassword"), null],
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

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
    setPassFieldType(showPassword ? "password" : "text");
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      await validationSchemaEmail.validate(email);
      setErrorEmail(null);
      setLoading(true);
      await sendValidationCode(email);
      showSuccessToast("کد احراز هویت شما به ایمیل داده شده ارسال شد");
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
    } catch (err) {
      if (err.name == "AxiosError") {
        showErrorToast(err.response.data.email[0]);
      } else {
        setErrorEmail(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async (e) => {
    e.preventDefault();

    try {
      await validationSchemaCode.validate(validationCode);
      setLoading(true);
      await verify(email, validationCode);
      setErrorValidationCode(null);
      showSuccessToast("تایید هویت شما موفقیت آمیز بود");
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
    } catch (err) {
      if (err.name == "AxiosError") {
        showErrorToast(err.response.data.code[0]);
      } else {
        setErrorValidationCode(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async (e) => {
    try {
      setLoading(true);
      await resendCode(email);
      showSuccessToast("کد احراز هویت شما به ایمیل داده شده دوباره ارسال شد");
    } catch (err) {
      showErrorToast("متاسفانه برای ما مشکلی پیش آمده،لطفا بعدا تلاش کنید");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitNewPassword = async (e) => {
    e.preventDefault();

    try {
      await validationSchemaPassword.validate(newPassword, {
        abortEarly: false,
      });
      setErrorNewPassword({});
      setLoading(true);
      await sendNewPassword(
        validationCode,
        email,
        newPassword.newPassword,
        newPassword.repeatPassword
      );
      showSuccessToast("رمز عبور شما با موفقیت تغییر یافت");
      navigate("/login");
    } catch (err) {
      const validationErrors = {};
      if (err.name == "AxiosError") {
        validationErrors.newPassword = err.response.data.new_password[0];
        validationErrors.repeatPassword = err.response.data.new_password2[0];
        setErrorNewPassword(validationErrors);
      } else {
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
      }

      setErrorNewPassword(validationErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.Bakcground}>
      <div className={styles.Box}>
        {loading && (
          <div className={styles.loaderContainer}>
            <RingLoader color="#bba1ea" size="5rem" />
          </div>
        )}
        <div className={styles.InnerBox}>
          <div className={styles.detailsContainer}>
            <img src="../Images/" className={styles.ImageTitle} />
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
                  style={{ direction: "ltr" }}
                />
                {errorEmail && (
                  <Tooltip
                    id="email_tooltip"
                    className={styles.errors}
                    content={errorEmail}
                  />
                )}
              </div>
              <button
                type="submit"
                className={styles.submitBtn}
                style={{ marginTop: "10%" }}
              >
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
              <p className={styles.resend} onClick={handleResendCode}>
                ارسال دوباره کد
              </p>
              <br />
              <button
                type="submit"
                className={styles.submitBtn}
                style={{ marginTop: "10%" }}
              >
                تایید کد
              </button>
            </form>
            <form
              onSubmit={handleSubmitNewPassword}
              className={styles.inputsBox}
              ref={newPasswordRef}
              style={{ display: "none" }}
            >
              <div className={styles.passwordContainer}>
                <label className={styles.inputsBoxLabels} htmlFor="newPassword">
                  رمز عبور جدید
                </label>
                <InfoIcon
                  className={styles.infoIcon}
                  data-tooltip-id="passwordPrequesties_tooltip"
                />
                <Tooltip
                  id="passwordPrequesties_tooltip"
                  className={styles.passwordPrequestiesLogin}
                  content={
                    "کلمه عبور باید حداقل به طول 8 و شامل حروف بزرگ و کوچک و حداقل یک عدد و یک کارکتر خاص باشد"
                  }
                  place="left-end"
                />
                <br />
                <div className={styles.passwordInputWrapper}>
                  <Input
                    className={
                      !errorNewPassword.newPassword
                        ? styles.inputField
                        : styles.inputFieldError
                    }
                    onChange={handleChangePassword}
                    type={passFieldType}
                    id="newPassword"
                    name="newPassword"
                    value={newPassword.newPassword}
                    data-tooltip-id="password_tooltip"
                  />
                  <button
                    type="button"
                    className={styles.togglePasswordButton}
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <VisibilityOffIcon className={styles.passwordIcon} />
                    ) : (
                      <RemoveRedEyeIcon className={styles.passwordIcon} />
                    )}
                  </button>
                </div>
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
                <div className={styles.passwordInputWrapper}>
                  <Input
                    className={
                      !errorNewPassword.repeatPassword
                        ? styles.inputField
                        : styles.inputFieldError
                    }
                    onChange={handleChangePassword}
                    type={passFieldType}
                    id="repeatPassword"
                    name="repeatPassword"
                    value={newPassword.repeatPassword}
                    data-tooltip-id="repeatPassword_tooltip"
                  />
                  <button
                    type="button"
                    className={styles.togglePasswordButton}
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <VisibilityOffIcon className={styles.passwordIcon} />
                    ) : (
                      <RemoveRedEyeIcon className={styles.passwordIcon} />
                    )}
                  </button>
                </div>
                <br />
                {errorNewPassword.repeatPassword && (
                  <Tooltip
                    id="repeatPassword_tooltip"
                    className={styles.errors}
                    content={errorNewPassword.repeatPassword}
                  />
                )}
                <button
                  type="submit"
                  className={styles.submitBtn}
                  style={{ marginTop: "10%" }}
                >
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
