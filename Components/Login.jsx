import "react";
import styles from "../Styles/Login.module.css";
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login_slides } from "../Scripts/mock_data";
import { Input } from "@base-ui-components/react/input";
import InfoIcon from "@mui/icons-material/Info";
import Tip_slide from "./Tip_slide";
import LoginManager from "../Managers/LoginManager";
import * as yup from "yup";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Tooltip } from "react-tooltip";
import CookieManager from "../Managers/CookieManager";
import { showErrorToast, showSuccessToast } from "../Utilities/Toast.js";
import { RingLoader } from "react-spinners";
import LogoIcon from "../src/icons/logo.svg";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [redirectTimeout, setRedirectTimeout] = useState(null);

  useEffect(() => {
    return () => {
      if (redirectTimeout) clearTimeout(redirectTimeout);
    };
  }, [redirectTimeout]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [passFieldType, setPassFieldType] = useState("password");

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

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
    setPassFieldType(showPassword ? "password" : "text");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setLoading(true);
      let resp = await LoginManager.Login(formData.email, formData.password);
      CookieManager.SaveToken(10, resp.data.tokens.access);
      let token = CookieManager.LoadToken();

      showSuccessToast("ورود موفقیت آمیز!");

      const timeoutId = setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
      setRedirectTimeout(timeoutId);
    } catch (err) {
      if (err.name == "AxiosError") {
        showErrorToast(err.response.data.non_field_errors[0]);
      } else {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      }
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
            <img src={LogoIcon} className={styles.ImageTitle} />
            {/* <div className={styles.Title}>
            </div> */}
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
              <br />
              <div className={styles.passwordContainer}>
                <label className={styles.inputsBoxLabels} htmlFor="password">
                  رمز عبور
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
                <p style={{ marginTop: "3%" }}>
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
                  حساب ندارید؟&nbsp;
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
