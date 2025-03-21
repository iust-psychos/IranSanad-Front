import "react";
import styles from "../Styles/Login.module.css";
import React, { useRef, useState } from "react";
import { login_slides } from "../Scripts/mock_data";
import { Input } from "@base-ui-components/react/input";
import InfoIcon from "@mui/icons-material/Info";
import Tip_slide from "./Tip_slide";
import SignupManager from "../Managers/SignupManager";
import * as yup from "yup";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    repeatpassword: "",
    username: "",
  });
  const [errors, setErrors] = useState({});

  const icon = useRef(null);

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
    repeatpassword: yup.string().required("تکرار رمز عبور اجباری است")
    .matches(
      `${formData.password}`,
      "تکرار رمز وارد شده با رمز تطابق ندارد"
    )
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      setErrors({});
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
            <span className={styles.loginTitle}>حساب جدید</span>
            <div className={styles.inputsBox}>
              <form onSubmit={handleSubmit}>
                <div>
                  <label className={styles.inputsBoxLabels} htmlFor="username">
                    نام کاربری
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
                  />
                  <br />
                  <Input
                    className={styles.inputField}
                    onChange={handleChange}
                    type="password"
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
                    type="repeatpassword"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
