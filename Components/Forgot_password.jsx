import "react";
import styles from "../Styles/Login.module.css";
import React, { useRef, useState } from "react";
import { login_slides } from "../Scripts/mock_data";
import { Input } from "@base-ui-components/react/input";
import InfoIcon from "@mui/icons-material/Info";
import Tip_slide from "./Tip_slide";
import LoginManager from "../Managers/LoginManager";
import * as yup from "yup";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const icon = useRef(null);

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
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        "کلمه عبور باید شامل حروف بزرگ و کوچک و حداقل یک عدد و یک کارکتر خاص باشد"
      ),
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      let resp = await LoginManager.Login(formData.email, formData.password);
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
            <span className={styles.loginTitle}>ورود به حساب</span>
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
                <div className={styles.password}>
                  <label className={styles.inputsBoxLabels} htmlFor="password">
                    رمز عبور
                  </label>
                  <InfoIcon
                    sx={{
                      position: "absolute",
                      top: "34%",
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
                  <p>
                    <a href="#" className={styles.forgetpasswordlink}>
                      فراموشی رمز عبور؟
                    </a>
                  </p>
                  <button type="submit" className={styles.submitBtn}>
                    ورود
                  </button>
                  <p className={styles.noAccLink}>
                    حساب ندارید؟
                    <a href="#" className={styles.forgetpasswordlink}>
                      ثبت نام کنید.
                    </a>
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