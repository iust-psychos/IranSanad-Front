import "react";
import styles from "@/styles/Login.module.css";
import React, { useRef, useState } from "react";
import { login_slides } from "@/utils/mockData";
import { Input } from "@base-ui-components/react/input";
import InfoIcon from "@mui/icons-material/Info";
import Tip_slide from "@/components/TipSlide";
import LoginManager from "@/managers/LoginManager";
import * as yup from "yup";
import { Link } from "react-router-dom";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const EmailVerification = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(true);

  const icon = useRef(null);
  const passwordHintBox = useRef(null);
  const validationSchema = yup.object().shape({
    email: yup.string().required("کد اجباری است"),
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
            <span className={styles.loginTitle}>تایید ایمیل</span>
            <div className={styles.inputsBox}>
              <form onSubmit={handleSubmit}>
                <div>
                  <label className={styles.inputsBoxLabels} htmlFor="email">
                    کد تایید
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
                  <p>
                    <Link
                      to="/login"
                      state={{ email: formData.email }}
                      className={styles.forgetpasswordlink}
                    >
                      ایمیل اشتباه است؟
                    </Link>
                  </p>
                  <button type="submit" className={styles.submitBtn}>
                    ارسال
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
