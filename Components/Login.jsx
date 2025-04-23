import "react";
import styles from "../Styles/Login.module.css";
import React, { useState, useRef } from "react";
import { login_slides } from "../Scripts/mock_data";
import { Input } from "@base-ui-components/react/input";
import InfoIcon from "@mui/icons-material/Info";
import Tip_slide from "./Tip_slide";
import LoginManager from "../Managers/LoginManager";
import * as yup from "yup";
import { Link } from "react-router-dom";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Tooltip } from "react-tooltip";
import CookieManager from "../Managers/CookieManager";
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(true);
  const [passFieldType, setPassFieldType] = useState("password");
  const [showPassIcon, setShowPassIcon] = useState(
    <RemoveRedEyeIcon
      sx={{
        position: "absolute",
        top: "39%",
        left: "21%",
      }}
    />
  );
  const iconContainer = useRef(null);
  const validationSchema = yup.object().shape({
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
  });

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
            top: "39%",
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
            top: "39%",
            left: "21%",
          }}
        />
      );
      setPassFieldType("text");
    }
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      let resp = await LoginManager.Login(formData.email, formData.password);
      CookieManager.SaveToken("12", resp.data.tokens.access);
      let token = CookieManager.LoadToken();
      setErrors({});
    } catch (err) {
      const validationErrors = {};
      console.log(err.message);
      err.inner.forEach((error) => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
      icon.current.style.top = "35%";
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
            <span className={styles.loginTitle}>ورود به حساب</span>

            <form onSubmit={handleSubmit} className={styles.inputsBox}>
              <div>
                <label className={styles.inputsBoxLabels} htmlFor="username">
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
              <div className={styles.password}>
                <label className={styles.inputsBoxLabels} htmlFor="password">
                  رمز عبور
                </label>
                <InfoIcon
                  sx={{
                    position: "absolute",
                    top: "30%",
                    color: "#D4D4D4",
                    width: "20px",
                    height: "20px",
                    left: "20%",
                  }}
                  data-tooltip-id="passwordPrequesties_tooltip"
                />
                <Tooltip
                  id="passwordPrequesties_tooltip"
                  className={styles.passwordPrequestiesLogin}
                  content={
                    "کلمه عبور باید حداقل به طول 8 و شامل حروف بزرگ و کوچک و حداقل یک عدد و یک کارکتر خاص باشد"
                  }
                  place="right-start"
                />
                <br />
                <span ref={iconContainer} onClick={handleShowPassword}>
                  {showPassIcon}
                </span>
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
                <br />
                {errors.password && (
                  <Tooltip
                    id="password_tooltip"
                    className={styles.errors}
                    content={errors.password}
                  />
                )}
                <p style={{ marginTop: "1%" }}>
                  <Link
                    to="/forgot_password"
                    state={
                      errors.email ? { email: "" } : { email: formData.email }
                    }
                    className={styles.forgetpasswordlink}
                  >
                    فراموشی رمز عبور؟
                  </Link>
                </p>
                <button type="submit" className={styles.submitBtn}>
                  ورود
                </button>
                <p className={styles.noAccLink}>
                  حساب ندارید؟
                  <Link to="/signup" className={styles.forgetpasswordlink}>
                    ثبت نام کنید.
                  </Link>
                </p>
              </div>
            </form>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
