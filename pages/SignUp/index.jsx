import "react";
import styles from "@/styles/Login.module.css";
import React, { useRef, useState } from "react";
import { login_slides } from "@/utils/mockData";
import { Input } from "@base-ui-components/react/input";
import InfoIcon from "@mui/icons-material/Info";
import Tip_slide from "@/components/TipSlide";
import SignupManager from "@/managers/SignUpManager";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import TipStyles from "@/styles/TipSlide.module.css";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Tooltip } from "react-tooltip";
import { showErrorToast, showSuccessToast } from "@/utils/toast.js";
import { RingLoader } from "react-spinners";
import CookieManager from "@/managers/CookieManager.js";
import LogoIcon from "/images/logo_light.png";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    repeatpassword: "",
    username: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [validationCode, setValidationCode] = useState("");
  const [errorValidationCode, setErrorValidationCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passFieldType, setPassFieldType] = useState("password");

  const signupRef = useRef(null);
  const validationCodeRef = useRef(null);

  const validationSchemaCode = yup.string().required("کد نمیتواند خالی باشد");
  const validationSchema = yup.object().shape({
    username: yup.string().required("نام کاربری اجباری است."),
    email: yup
      .string()
      .email("آدرس ایمیل نامعتبر است")
      .required("ایمیل اجباری است"),
    password: yup
      .string()
      .required("رمز عبور اجباری است")
      .min(8, "رمز عبور باید حداقل 8 کارکتر باشد")
      .matches(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$!%#*?&]{8,}$/,
        "کلمه عبور باید شامل حروف بزرگ و کوچک و حداقل یک عدد و یک کارکتر خاص باشد"
      ),
    repeatpassword: yup
      .string()
      .required("تکرار رمز عبور اجباری است")
      .oneOf(
        [yup.ref("password"), null],
        "تکرار رمز وارد شده با رمز تطابق ندارد"
      ),
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
    setPassFieldType(showPassword ? "password" : "text");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      setLoading(true);
      await SignupManager.sendValidationCode(formData.email, formData.username);
      showSuccessToast("کد احراز هویت شما به ایمیل داده شده ارسال شد");

      signupRef.current.classList.add(TipStyles.slideOut);

      signupRef.current.addEventListener(
        "animationend",
        () => {
          validationCodeRef.current.classList.add(TipStyles.slideIn);
          signupRef.current.style.display = "none";
          validationCodeRef.current.style.display = "block";
        },
        { once: true }
      );
    } catch (err) {
      if (err.name == "AxiosError") {
        showErrorToast(err.response.data.message);
      } else {
        const validationErrors = {};
        if (err.inner !== undefined) {
          err.inner.forEach((error) => {
            validationErrors[error.path] = error.message;
          });
        } else {
          validationErrors[0] = "مشکلی پیش آمد.";
        }
        setErrors(validationErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangeCode = (e) => {
    setValidationCode(e.target.value);
  };

  const handleSubmitCode = async (e) => {
    e.preventDefault();
    try {
      await validationSchemaCode.validate(validationCode);
      setErrorValidationCode(null);
      setLoading(true);
      const resp = await SignupManager.Signup(
        formData.username,
        formData.email,
        formData.repeatpassword,
        formData.password,
        validationCode
      );
      console.log(resp);
      showSuccessToast("حساب کاربری شما با موفقیت ایجاد شد");
      CookieManager.SaveToken(10, resp.data.tokens.access);
      CookieManager.LoadToken();
      navigate("/dashboard");
    } catch (err) {
      if (err.name == "AxiosError") {
        console.log(err);
        showErrorToast(err.response.data.code[0]);
      } else {
        console.log(err);
        setErrorValidationCode(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async (e) => {
    try {
      setLoading(true);
      await SignupManager.resendCode(formData.email);
      showSuccessToast("کد احراز هویت شما به ایمیل داده شده دوباره ارسال شد");
    } catch (err) {
      showErrorToast("متاسفانه برای ما مشکلی پیش آمده،لطفا بعدا تلاش کنید");
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
            <img
              src={LogoIcon}
              style={{ width: "50px", height: "50px" }}
              className={styles.ImageTitle}
            />
            {/* <div className={styles.Title}>
              <img src={LogoIcon} alt="ایران سند" />
            </div> */}
            <Tip_slide
              text_list={login_slides}
              className={styles.InformationContainer}
            />
          </div>
          <div className={styles.formBox}>
            <span className={styles.loginTitle}>حساب جدید</span>
            <form
              className={styles.inputsBox}
              ref={signupRef}
              onSubmit={handleSubmit}
            >
              <div>
                <label className={styles.inputsBoxLabels} htmlFor="username">
                  نام کاربری
                </label>
                <br />
                <Input
                  className={
                    !errors.username
                      ? styles.inputField
                      : styles.inputFieldError
                  }
                  onChange={handleChange}
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  data-tooltip-id="username_tooltip"
                />
                {errors.username && (
                  <Tooltip
                    id="username_tooltip"
                    className={styles.errors}
                    content={errors.username}
                    data-testid="username-error"
                  />
                )}
              </div>
              <div>
                <label className={styles.inputsBoxLabels} htmlFor="email">
                  ایمیل
                </label>
                <br />
                <Input
                  className={
                    !errors.email ? styles.inputField : styles.inputFieldError
                  }
                  onChange={handleChange}
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  data-tooltip-id="email_tooltip"
                  style={{ direction: "ltr" }}
                />
                {errors.email && (
                  <Tooltip
                    id="email_tooltip"
                    className={styles.errors}
                    content={errors.email}
                  />
                )}
              </div>

              <label className={styles.inputsBoxLabels} htmlFor="password">
                رمز عبور
              </label>
              <InfoIcon
                className={styles.infoIcon}
                data-tooltip-id="passwordPrequesties_tooltip"
              />
              <Tooltip
                id="passwordPrequesties_tooltip"
                className={styles.passwordPrequesties}
                content={
                  "کلمه عبور باید حداقل به طول 8 و شامل حروف بزرگ و کوچک و حداقل یک عدد و یک کارکتر خاص باشد"
                }
                place="left-end"
              />
              <div className={styles.passwordInputWrapper}>
                <Input
                  className={
                    !errors.password
                      ? styles.inputField
                      : styles.inputFieldError
                  }
                  onChange={handleChange}
                  type={passFieldType}
                  id="password"
                  name="password"
                  value={formData.password}
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

              {errors.password && (
                <Tooltip
                  id="password_tooltip"
                  className={styles.errors}
                  content={errors.password}
                />
              )}
              <label
                className={styles.inputsBoxLabels}
                htmlFor="repeatpassword"
              >
                تکرار رمز عبور
              </label>
              <br />
              <div className={styles.passwordInputWrapper}>
                <Input
                  className={
                    !errors.repeatpassword
                      ? styles.inputField
                      : styles.inputFieldError
                  }
                  onChange={handleChange}
                  type={passFieldType}
                  id="repeatpassword"
                  name="repeatpassword"
                  value={formData.repeatpassword}
                  data-tooltip-id="repeatpassword_tooltip"
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
              {errors.repeatpassword && (
                <Tooltip
                  id="repeatpassword_tooltip"
                  className={styles.errors}
                  content={errors.repeatpassword}
                />
              )}
              <button type="submit" className={styles.submitBtn}>
                ایجاد حساب
              </button>
              <p className={styles.noAccLink}>
                حساب دارید؟&nbsp;
                <Link to="/login" className={styles.forgetpasswordlink}>
                  وارد شوید
                </Link>
              </p>
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
                  کد تایید
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
              <button type="submit" className={styles.submitBtn}>
                تایید کد
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
