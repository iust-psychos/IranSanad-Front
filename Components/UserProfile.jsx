import React, { useState, useEffect } from "react";
import "../Styles/UserProfile.css";
import userProfileIcon from "../src/Images/user-profile.png";
import { toJalaali } from "jalaali-js";
import axios from "axios";

const getUserInfoAPI = "http://iransanad.fiust.ir/api/v1/auth/info/";

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
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ2ODg4NzgyLCJpYXQiOjE3NDQyOTY3ODIsImp0aSI6IjI1NmU3YWZlNTI1YTQ0NWNiMGVhZTk4Nzk3ZDBhNTQ5IiwidXNlcl9pZCI6OH0.f980Oxuk4LwUwEPMKid6w2wKJjGC4h1qr16ry3kcEHk";

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

  const [edit, setEdit] = useState(false);

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
              <button onClick={() => setEdit(!edit)}>
                {edit ? "ذخیره" : "ویرایش"}
              </button>
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
                  />
                ) : (
                  <input
                    type="text"
                    name="fullname"
                    placeholder="مثلا مهران رزقی"
                    autoComplete="on"
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
                  />
                ) : (
                  <input
                    type="text"
                    name="username"
                    placeholder="مثلا rez80"
                    autoComplete="on"
                  />
                )}
              </div>
              <div className="user-profile-label-input">
                <label htmlFor="country">کشور</label>
                <select name="country" defaultValue={"ایران"}>
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
                  />
                ) : (
                  <input
                    type="tel"
                    name="telephone"
                    pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                    placeholder="912 345 6789"
                    autoComplete="on"
                  />
                )}
              </div>
            </div>
            <div className="user-profile-info-3">
              <h3>تغییر رمز عبور</h3>
              <div className="user-profile-info-3-grid">
                <div className="user-profile-label-input">
                  <label htmlFor="oldpassword">رمز عبور کنونی</label>
                  <input
                    type="password"
                    name="oldpassword"
                    autoComplete="off"
                  />
                </div>
                <div className="user-profile-label-input">
                  <label htmlFor="newpassword">رمز عبور جدید</label>
                  <input
                    type="password"
                    name="newpassword"
                    autoComplete="off"
                  />
                </div>
                <div className="user-profile-label-input">
                  <label htmlFor="confirmnewpassword">
                    تایید رمز عبور جدید
                  </label>
                  <input
                    type="password"
                    name="confirmnewpassword"
                    autoComplete="off"
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
