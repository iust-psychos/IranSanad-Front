import React, { useState, useEffect } from "react";
import "../Styles/UserProfile.css";
import userProfileIcon from "../src/Images/user-profile.png";
import { toJalaali } from "jalaali-js";
import axios from "axios";
// import { LoadToken } from "../Managers/CookieManager.js";
import { showErrorToast, showSuccessToast } from "../Utilities/Toast.js";

const getUserInfoAPI = "http://iransanad.fiust.ir/api/v1/auth/info/";
const changePasswordAPI =
  "http://iransanad.fiust.ir/api/v1/auth/change_password/";
const changeUserInfoAPI = "http://iransanad.fiust.ir/api/v1/auth/info/";

const initialPassword = {
  old_password: "",
  new_password: "",
  new_password2: "",
};

const UserProfile = () => {
  const [dateText, setDateText] = useState("");

  const toPersianDigits = (num) => {
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    return num.toString().replace(/\d/g, (d) => persianDigits[d]);
  };

  useEffect(() => {
    const updateDate = () => {
      const today = new Date();
      const {
        jy: year,
        jm: month,
        jd: day,
      } = toJalaali(today.getFullYear(), today.getMonth() + 1, today.getDate());

      const weekday = today.toLocaleDateString("fa-IR", { weekday: "long" });

      const formattedDate = `${weekday}، ${toPersianDigits(
        day
      )} ${getPersianMonthName(month)} ${toPersianDigits(year)}`;
      setDateText(formattedDate);
    };

    updateDate();
    const timer = setInterval(updateDate, 1000);

    return () => clearInterval(timer);
  }, []);

  const getPersianMonthName = (month) => {
    const months = [
      "فروردین",
      "اردیبهشت",
      "خرداد",
      "تیر",
      "مرداد",
      "شهریور",
      "مهر",
      "آبان",
      "آذر",
      "دی",
      "بهمن",
      "اسفند",
    ];
    return months[month - 1];
  };

  const [user, setUser] = useState(null);

  const token = //LoadToken();
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ2OTA4MTk0LCJpYXQiOjE3NDQzMTYxOTQsImp0aSI6IjYxMTUyYTA5ODFmODRiMDM4NjI4MGJkMjM0OWJmNWI1IiwidXNlcl9pZCI6OH0.tog-CME7QSKpWIyWviMICgzaExhECsxW4zaJfQHjPqA";

  useEffect(() => {
    axios
      .get(`${getUserInfoAPI}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
      })
      .then((response) => {
        setUser(response.data);
        console.log(response);
      })
      .catch((error) => console.log(error));
  }, []);

  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    phone_number: "",
    first_name: "",
    last_name: "",
  });

  useEffect(() => {
    if (user) {
      setUserInfo({
        username: user.username || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
      });
    }
  }, [user]);

  const handleChangeUserInfo = (event) => {
    const { name, value } = event.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [passwordData, setPasswordData] = useState(initialPassword);
  const handleChangePassword = (event) => {
    const { name, value } = event.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const checkChangePassword = () => {
    if (
      passwordData.new_password != "" &&
      passwordData.new_password2 != "" &&
      passwordData.old_password != ""
    ) {
      return true;
    }
    return false;
  };

  const checkChangeUserInfo = () => {
    if (
      user.username !== userInfo.username ||
      user.phone_number !== userInfo.phone_number ||
      user.first_name !== userInfo.first_name ||
      user.last_name !== userInfo.last_name
    ) {
      return true;
    }
    return false;
  };

  const [edit, setEdit] = useState(true);
  const handleSave = async (event) => {
    event.preventDefault();
    if (edit === false && checkChangePassword()) {
      try {
        const response = await axios.post(
          changePasswordAPI,
          {
            old_password: passwordData.old_password,
            new_password: passwordData.new_password,
            new_password2: passwordData.new_password2,
          },
          {
            headers: {
              Authorization: `JWT ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response);
        setPasswordData(initialPassword);
        showSuccessToast("رمز عبور با موفقیت تغییر یافت");
      } catch (error) {
        console.log(error);
        const errorMessage =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          error.response?.data?.non_field_errors[0] ||
          "خطا در تغییر رمز عبور";
        showErrorToast(errorMessage);
      }
    }

    if (edit === false && checkChangeUserInfo()) {
      try {
        const response = await axios.put(
          changeUserInfoAPI,
          {
            username: userInfo.username,
            email: userInfo.email,
            phone_number: userInfo.phone_number,
            first_name: userInfo.first_name,
            last_name: userInfo.last_name,
          },
          {
            headers: {
              Authorization: `JWT ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response);
        showSuccessToast("اطلاعات با موفقیت ذخیره شد");
        setUser({
          username: response.data.username,
          email: response.data.email,
          phone_number: response.data.phone_number,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
        });
      } catch (error) {
        console.log(error);
        showErrorToast(
          error.response?.data?.detail ||
            error.response?.data?.non_field_errors[0] ||
            "خطا در ذخیره اطلاعات"
        );
      }
    }

    setEdit(!edit);
  };

  return (
    <div className="user-profile">
      <div className="user-profile-area">
        <div className="user-profile-area-header">
          {user && user.first_name ? (
            <h2>خوش آمدی {user.first_name} عزیز</h2>
          ) : (
            <h2>خوش آمدی</h2>
          )}
          <p>{dateText}</p>
        </div>
        <div className="user-profile-area-body">
          <div className="color-tape"></div>
          <div className="user-profile-area-body-content">
            <div className="user-profile-info-1">
              <div className="user-profile-batch">
                <img src={userProfileIcon} alt="user profile image" />
                <div className="user-profile-titles">
                  <h3>
                    {" "}
                    {user && user.first_name
                      ? `${user.first_name} ${user.last_name}`
                      : "کاربر ایران سند"}
                  </h3>
                  {user ? <p>{user.email}</p> : <p>example@email.com</p>}
                </div>
              </div>
              {edit ? (
                <button type="button" onClick={handleSave}>
                  ویرایش
                </button>
              ) : (
                <button type="button" onClick={handleSave}>
                  ذخیره
                </button>
              )}
            </div>
            <div className="user-profile-info-2">
              <div className="user-profile-label-input">
                <label htmlFor="first_name">نام</label>
                {user && user.first_name ? (
                  <input
                    type="text"
                    name="first_name"
                    defaultValue={`${userInfo.first_name}`}
                    autoComplete="on"
                    disabled={edit}
                    value={`${userInfo.first_name}`}
                    onChange={handleChangeUserInfo}
                  />
                ) : (
                  <input
                    type="text"
                    name="first_name"
                    placeholder="نام خود را وارد کنید."
                    autoComplete="on"
                    disabled={edit}
                    value={`${userInfo.first_name}`}
                    onChange={handleChangeUserInfo}
                  />
                )}
              </div>
              <div className="user-profile-label-input">
                <label htmlFor="last_name">نام خانوادگی</label>
                {user && user.last_name ? (
                  <input
                    type="text"
                    name="last_name"
                    defaultValue={`${userInfo.last_name}`}
                    autoComplete="on"
                    disabled={edit}
                    value={`${userInfo.last_name}`}
                    onChange={handleChangeUserInfo}
                  />
                ) : (
                  <input
                    type="text"
                    name="last_name"
                    placeholder="نام خانوادگی خود را وارد کنید."
                    autoComplete="on"
                    disabled={edit}
                    value={`${userInfo.last_name}`}
                    onChange={handleChangeUserInfo}
                  />
                )}
              </div>
              <div className="user-profile-label-input">
                <label htmlFor="username">نام کاربری</label>
                {user && user.username ? (
                  <input
                    type="text"
                    name="username"
                    defaultValue={user.username}
                    autoComplete="on"
                    disabled={edit}
                    value={userInfo.username}
                    onChange={handleChangeUserInfo}
                  />
                ) : (
                  <input
                    type="text"
                    name="username"
                    placeholder="نام کاربری خود را وارد کنید."
                    autoComplete="on"
                    disabled={edit}
                    value={""}
                    onChange={handleChangeUserInfo}
                  />
                )}
              </div>
              {/* <div className="user-profile-label-input">
                <label htmlFor="country">کشور</label>
                <select name="country" defaultValue={"ایران"} disabled={edit}>
                  <option value="Iran">ایران</option>
                </select>
              </div> */}
              <div className="user-profile-label-input">
                <label htmlFor="phone_number">شماره تلفن</label>
                {user && user.phone_number ? (
                  <input
                    type="tel"
                    name="phone_number"
                    pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                    defaultValue={user.phone_number}
                    autoComplete="on"
                    disabled={edit}
                    value={userInfo.phone_number}
                    onChange={handleChangeUserInfo}
                  />
                ) : (
                  <input
                    type="tel"
                    name="phone_number"
                    pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                    placeholder="989123456789"
                    autoComplete="on"
                    disabled={edit}
                    value={"989123456789"}
                    onChange={handleChangeUserInfo}
                  />
                )}
              </div>
            </div>
            <div className="user-profile-info-3">
              <h3>تغییر رمز عبور</h3>
              <div className="user-profile-info-3-grid">
                <div className="user-profile-label-input">
                  <label htmlFor="old_password">رمز عبور کنونی</label>
                  <input
                    type="password"
                    name="old_password"
                    autoComplete="off"
                    disabled={edit}
                    value={passwordData.old_password}
                    onChange={handleChangePassword}
                  />
                </div>
                <div className="user-profile-label-input">
                  <label htmlFor="new_password">رمز عبور جدید</label>
                  <input
                    type="password"
                    name="new_password"
                    autoComplete="off"
                    disabled={edit}
                    value={passwordData.new_password}
                    onChange={handleChangePassword}
                  />
                </div>
                <div className="user-profile-label-input">
                  <label htmlFor="new_password2">تایید رمز عبور جدید</label>
                  <input
                    type="password"
                    name="new_password2"
                    autoComplete="off"
                    disabled={edit}
                    value={passwordData.new_password2}
                    onChange={handleChangePassword}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
