import "react";
import styles from "../Styles/Login.module.css";
import React, { useRef, useState } from "react";
import { login_slides } from "../Scripts/mock_data";
import { Input } from "@base-ui-components/react/input";
import InfoIcon from "@mui/icons-material/Info";
import Tip_slide from "./Tip_slide";
import SignupManager from "../Managers/SignupManager";
import * as yup from "yup";
import { Link, useAsyncError } from "react-router-dom";
import TipStyles from "../Styles/Tip_slide.module.css";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    repeatpassword: "",
  });
  const [errors, setErrors] = useState({});
  const [trueValidationCode, setTrueValidationCode] = useState("");
  const [validationCode, setValidationCode] = useState("");
  const [errorValidationCode, setErrorValidationCode] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [passFieldType, setPassFieldType] = useState("password");
  const [showPassIcon, setShowPassIcon] = useState(
    <RemoveRedEyeIcon
      sx={{
        position: "absolute",
        top: "46.5%",
        left: "21%",
      }}
    />
  );

  const icon = useRef(null);
  const signupRef = useRef(null);
  const validationCodeRef = useRef(null);
  const iconContainer = useRef(null);
  const passwordHintBox = useRef(null);

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
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "کلمه عبور باید شامل حروف بزرگ و کوچک و حداقل یک عدد و یک کارکتر خاص باشد"
      ),
    repeatpassword: yup
      .string()
      .required("تکرار رمز عبور اجباری است")
      .matches(`${formData.password}`, "تکرار رمز وارد شده با رمز تطابق ندارد"),
  });

  const validationSchemaCode = yup.string().required("کد نمیتواند خالی باشد");

  const handleChangeCode = (e) => {
    setValidationCode(e.target.value);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShowPassword = (e) => {
    e.preventDefault();
    if (!showPassword) {
      setShowPassIcon(
        <RemoveRedEyeIcon
          sx={{
            position: "absolute",
            top: "46.5%",
            left: "21%",
          }}
        />
      );
      setPassFieldType("password");
    } else {
      setShowPassIcon(
        <VisibilityOffIcon
          sx={{
            position: "absolute",
            top: "46.5%",
            left: "21%",
          }}
        />
      );
      setPassFieldType("text");
    }
    setShowPassword(!showPassword);
  };

  const showPasswordHint = (e) => {
    e.preventDefault();
    passwordHintBox.current.style.display = "block";
  };

  const hidePasswordHint = (e) => {
    e.preventDefault();
    passwordHintBox.current.style.display = "none";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      let resp = await SignupManager.Signup(
        formData.username,
        formData.email,
        formData.repeatpassword,
        formData.password
      );
      //etiher in sign up we get the code,or we use another api for it
      //it must be assigned to setTrueValidationCode
      setErrors({});
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
      const validationErrors = {};
      console.log(err);
      err.inner.forEach((error) => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
      icon.current.style.top = "35%";
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
      }
    } catch (err) {
      setErrorValidationCode(err.message);
    }
  };

  return (
    <div className={styles.Bakcground}>
      <div className={styles.Box}>
        <div className={styles.InnerBox}>
          <div className={styles.detailsContainer}>
            <img src="../Images/" className={styles.ImageTitle} />
            <div className={styles.Title}>
              ایران
              <br />
              سند
            </div>
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
                  className={styles.inputField}
                  onChange={handleChange}
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                />
                {errors.username && (
                  <div className={styles.errors}>{errors.username}</div>
                )}
              </div>
              <div>
                <label className={styles.inputsBoxLabels} htmlFor="email">
                  ایمیل
                </label>
                <br />
                <Input
                  className={styles.inputField}
                  onChange={handleChange}
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                />
                {errors.email && (
                  <div className={styles.errors}>{errors.email}</div>
                )}
              </div>
              <div className={styles.password}>
                <label className={styles.inputsBoxLabels} htmlFor="password">
                  رمز عبور
                </label>
                <span ref={iconContainer} onClick={handleShowPassword}>
                  {showPassIcon}
                </span>
                <div ref={passwordHintBox} className={styles.passwordPrequesties}>
                  کلمه عبور باید حداقل به طول 8 و شامل حروف بزرگ و کوچک و حداقل
                  یک عدد و یک کارکتر خاص باشد
                </div>
                <InfoIcon
                  sx={{
                    position: "absolute",
                    top: "39%",
                    color: "#D4D4D4",
                    width: "20px",
                    height: "20px",
                    left: "20%",
                  }}
                  ref={icon}
                  onMouseEnter={showPasswordHint}
                  onMouseLeave={hidePasswordHint}
                />
                <br />
                <Input
                  className={styles.inputField}
                  onChange={handleChange}
                  type={passFieldType}
                  id="password"
                  name="password"
                  value={formData.password}
                />
                <br />
                {errors.password && (
                  <div className={styles.errors}>{errors.password}</div>
                )}
                <label
                  className={styles.inputsBoxLabels}
                  htmlFor="repeatpassword"
                >
                  تکرار رمز عبور
                </label>{" "}
                <br />
                <Input
                  className={styles.inputField}
                  onChange={handleChange}
                  type="password"
                  id="repeatpassword"
                  name="repeatpassword"
                  value={formData.repeatpassword}
                />
                <br />
                {errors.repeatpassword && (
                  <div className={styles.errors}>{errors.repeatpassword}</div>
                )}
                <button type="submit" className={styles.submitBtn}>
                  ایجاد حساب
                </button>
                <p className={styles.noAccLink}>
                  حساب دارید؟
                  <Link to="/login" className={styles.forgetpasswordlink}>
                    وارد شوید
                  </Link>
                </p>
              </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
