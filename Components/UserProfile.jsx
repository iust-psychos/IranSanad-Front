import React, { useState, useEffect } from "react";
import "../Styles/UserProfile.css";
import userProfileIcon from "../src/Images/user-profile.png";
import { toJalaali } from "jalaali-js";

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

  return (
    <div className="user-profile">
      <div className="user-profile-area">
        <div className="user-profile-area-header">
          <h2>خوش آمدی عرفان عزیز</h2>
          <p>{dateText}</p>
        </div>
        <div className="user-profile-area-body">
          <div className="color-tape"></div>
          <div className="user-profile-area-body-content">
            <div className="user-profile-info-1">
              <div className="user-profile-batch">
                <img src={userProfileIcon} alt="user profile image" />
                <div className="user-profile-titles">
                  <h3>نام کاربر</h3>
                  <p>example@gmail.com</p>
                </div>
              </div>
              <button>ویرایش</button>
            </div>
            <div className="user-profile-info-2">
              <div className="user-profile-label-input">
                <label htmlFor="fullname">نام و نام خانوادگی</label>
                <input
                  type="text"
                  name="fullname"
                  placeholder="نام و نام خانوادکی خود را وارد کنید"
                  autoComplete="on"
                />
              </div>
              <div className="user-profile-label-input">
                <label htmlFor="username">نام کاربری</label>
                <input
                  type="text"
                  name="username"
                  placeholder="نام کاربری خود را وارد کنید"
                  autoComplete="on"
                />
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
                <input
                  type="tel"
                  name="telephone"
                  pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                  placeholder="912 345 6789"
                  autoComplete="on"
                />
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
