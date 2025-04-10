import React, { useState, useEffect } from "react";
import "../Styles/UserProfile.css";
import userProfileIcon from "../src/Images/user-profile.png";
import { toJalaali } from "jalaali-js";
import axios from "axios";

const getUserInfoAPI = "http://iransanad.fiust.ir/api/v1/auth/info/";
const changePasswordAPI =
  "http://iransanad.fiust.ir/api/v1/auth/change_password/";

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

  const token =
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

  const [passwordData, setPasswordData] = useState(initialPassword);
  const handleChange = (event) => {
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

  const [edit, setEdit] = useState(true);
  const handleSave = async (event) => {
    event.preventDefault();
    setEdit(!edit);
    if (edit == false && checkChangePassword()) {
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
      } catch (error) {
        console.log(error);
      }
    }
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
                      ? user.first_name
                      : "کاربر ایران سند"}
                  </h3>
                  {user ? <p>{user.email}</p> : <p>example@email.com</p>}
                </div>
              </div>
              {edit ? (
                <button onClick={handleSave}>ویرایش</button>
              ) : (
                <button onClick={handleSave}>ذخیره</button>
              )}
            </div>
            <div className="user-profile-info-2">
              <div className="user-profile-label-input">
                <label htmlFor="fullname">نام و نام خانوادگی</label>
                {user && user.first_name ? (
                  <input
                    type="text"
                    name="fullname"
                    defaultValue={user.first_name + " " + user.last_name}
                    autoComplete="on"
                    disabled={edit}
                  />
                ) : (
                  <input
                    type="text"
                    name="fullname"
                    placeholder="نام و نام خانوادگی خود را وارد کنید."
                    autoComplete="on"
                    disabled={edit}
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
                  />
                ) : (
                  <input
                    type="text"
                    name="username"
                    placeholder="نام کاربری خود را وارد کنید."
                    autoComplete="on"
                    disabled={edit}
                  />
                )}
              </div>
              <div className="user-profile-label-input">
                <label htmlFor="country">کشور</label>
                <select name="country" defaultValue={"ایران"} disabled={edit}>
                  <option value="Iran">ایران</option>
                  <option value="Tajikstan">تاجیکستان</option>
                </select>
              </div>
              <div className="user-profile-label-input">
                <label htmlFor="telephone">شماره تلفن</label>
                {user && user.phone_number ? (
                  <input
                    type="tel"
                    name="telephone"
                    pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                    defaultValue={user.phone_number}
                    autoComplete="on"
                    disabled={edit}
                  />
                ) : (
                  <input
                    type="tel"
                    name="telephone"
                    pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                    placeholder="912 345 6789"
                    autoComplete="on"
                    disabled={edit}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
