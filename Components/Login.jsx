import "react";
import styles from "../Styles/Login.module.css";
import React, { useRef, useState } from "react";
import { login_slides } from "../Scripts/mock_data";
import { Input } from "@base-ui-components/react/input";
import InfoIcon from "@mui/icons-material/Info";
import Tip_slide from "./Tip_slide";
import LoginManager from "../Managers/LoginManager";
import * as yup from "yup";
import { Link } from "react-router-dom";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

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
        top: "41%",
        left: "21%",
      }}
    />
  );

  const icon = useRef(null);
  const iconContainer = useRef(null);
  const passwordHintBox = useRef(null);
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
            top: "41%",
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
            top: "41%",
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
      let resp = await LoginManager.Login(formData.email, formData.password);
      console.log(resp);
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
            <div className={styles.inputsBox}>
              <form onSubmit={handleSubmit}>
                <div>
                  <label className={styles.inputsBoxLabels} htmlFor="username">
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
                  <div
                    ref={passwordHintBox}
                    className={styles.passwordPrequestiesLogin}
                  >
                    کلمه عبور باید حداقل به طول 8 و شامل حروف بزرگ و کوچک و
                    حداقل یک عدد و یک کارکتر خاص باشد
                  </div>
                  <InfoIcon
                    sx={{
                      position: "absolute",
                      top: "31%",
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
                  <span ref={iconContainer} onClick={handleShowPassword}>
                    {showPassIcon}
                  </span>
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
                  <p>
                    <Link
                      to="/forgot_password"
                      state={{ email: formData.email }}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
