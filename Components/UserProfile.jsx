import React, { useState, useEffect } from "react";
import "../Styles/UserProfile.css";
import userProfileIcon from "../src/Images/user-profile.png";
import { toJalaali } from "jalaali-js";
import axios from "axios";
import CookieManager from "../Managers/CookieManager";
import { showErrorToast, showSuccessToast } from "../Utilities/Toast.js";
import { convertToBase64 } from "../Scripts/base64ImageConverter.js";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";

const getUserInfoAPI = "http://iransanad.fiust.ir/api/v1/auth/info/";
const changePasswordAPI =
  "http://iransanad.fiust.ir/api/v1/auth/change_password/";
const changeUserInfoAPI = "http://iransanad.fiust.ir/api/v1/auth/info/";
const changeProfileImageAPI = "http://iransanad.fiust.ir/api/v1/auth/profile/";
const baseAPI = "http://iransanad.fiust.ir";

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

  const token = CookieManager.LoadToken();

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
    profile_image: "",
  });

  useEffect(() => {
    if (user) {
      setUserInfo({
        username: user.username || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        profile_image: user.profile_image || "",
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

  const [previewImage, setPreviewImage] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);

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

  const checkChangeProfileImage = () => {
    return !!selectedImageFile;
  };

  const getErrorMessage = (error) => {
    if (!error.response) {
      return "خطا در ارتباط با سرور";
    }
    const { data } = error.response;

    const errorFields = [
      "detail",
      "phone_number",
      "username",
      "first_name",
      "last_name",
      "non_field_errors",
    ];

    for (const field of errorFields) {
      if (data[field]) {
        if (Array.isArray(data[field])) {
          return data[field][0];
        }
        return data[field];
      }
    }

    switch (error.response.status) {
      case 400:
        return "داده‌های ارسالی نامعتبر هستند";
      case 401:
        return "احراز هویت ناموفق بود";
      case 403:
        return "دسترسی غیرمجاز";
      case 404:
        return "منبع یافت نشد";
      case 500:
        return "خطای سرور";
      default:
        return "خطای ناشناخته رخ داد";
    }
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
          (error.response?.data?.non_field_errors &&
            error.response?.data?.non_field_errors[0]) ||
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
        setUser((prev) => ({
          ...prev,
          username: response.data.username,
          email: response.data.email,
          phone_number: response.data.phone_number,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
        }));
      } catch (error) {
        console.log(error);
        showErrorToast(getErrorMessage(error));
      }
    }

    if (edit === false && checkChangeProfileImage()) {
      console.log("in");
      try {
        const response = await axios.post(
          changeProfileImageAPI,
          {
            profile_image: selectedImageFile,
          },
          {
            headers: {
              Authorization: `JWT ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("response:", response);
        showSuccessToast("تصویر پروفایل با موفقیت تغییر کرد");
        setUser((prev) => ({
          ...prev,
          profile_image: previewImage, // response.data.profile_image,
        }));

        if (previewImage) {
          URL.revokeObjectURL(previewImage);
        }
        // setPreviewImage(null);

        setSelectedImageFile(null);
        console.log(user.profile_image);
      } catch (error) {
        console.log(error);
        showErrorToast(getErrorMessage(error));
        setPreviewImage(null);
        setSelectedImageFile(null);
      }
    }

    setEdit(!edit);
  };

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPassword2, setShowNewPassword2] = useState(false);

  const handleProfileImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);

    try {
      const base64Image = await convertToBase64(file);
      setSelectedImageFile(base64Image);

      setUserInfo((prev) => ({
        ...prev,
        profile_image: base64Image,
      }));

      // Use the object URL for immediate display
      setUser((prev) => ({
        ...prev,
        profile_image: imageUrl,
      }));
    } catch (error) {
      console.error("Error converting image:", error);
      showErrorToast("خطا در تبدیل تصویر");
    }
  };

  const handleProfileImageRemove = async (event) => {
    setPreviewImage(null);
    setUser((prev) => ({
      ...prev,
      profile_image: "",
    }));
    const default_image = await convertToBase64(userProfileIcon);
    setSelectedImageFile(default_image);
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
                <div className="user-profile-image-container">
                  <input
                    type="file"
                    id="profile-image-input"
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handleProfileImageChange}
                  />
                  <img
                    src={
                      previewImage ||
                      (user && user.profile_image
                        ? user.profile_image.startsWith("blob:")
                          ? user.profile_image
                          : baseAPI + user.profile_image
                        : userProfileIcon)
                    }
                    alt="user profile image"
                  />
                  <div className="user-profile-image-editors">
                    <FaEdit
                      fill="#AE8EE6"
                      className="user-profile-image-editor"
                      style={
                        !edit
                          ? {
                              cursor: "pointer",
                            }
                          : {
                              cursor: "initial",
                            }
                      }
                      onClick={() =>
                        !edit &&
                        document.getElementById("profile-image-input").click()
                      }
                    />
                    <TiDelete
                      fill="#AE8EE6"
                      className="user-profile-image-editor"
                      style={
                        !edit
                          ? {
                              cursor: "pointer",
                            }
                          : {
                              cursor: "initial",
                            }
                      }
                      onClick={() => !edit && handleProfileImageRemove}
                    />
                  </div>
                </div>

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
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  placeholder="نام خود را وارد کنید."
                  autoComplete="on"
                  disabled={edit}
                  value={userInfo.first_name}
                  onChange={handleChangeUserInfo}
                />
              </div>
              <div className="user-profile-label-input">
                <label htmlFor="last_name">نام خانوادگی</label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  placeholder="نام خانوادگی خود را وارد کنید."
                  autoComplete="on"
                  disabled={edit}
                  value={userInfo.last_name}
                  onChange={handleChangeUserInfo}
                />
              </div>
              <div className="user-profile-label-input">
                <label htmlFor="username">نام کاربری</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="on"
                  disabled={edit}
                  value={userInfo.username}
                  onChange={handleChangeUserInfo}
                  placeholder="نام کاربری خود را وارد کنید."
                  style={
                    user && userInfo.username
                      ? {
                          direction: "ltr",
                          textAlign: "left",
                        }
                      : {
                          direction: "rtl",
                          textAlign: "right",
                        }
                  }
                />
              </div>
              <div className="user-profile-label-input">
                <label htmlFor="phone_number">شماره تلفن</label>
                <input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  pattern="\+98\d{10}"
                  autoComplete="on"
                  disabled={edit}
                  value={userInfo.phone_number}
                  onChange={handleChangeUserInfo}
                  placeholder="شماره تلفن همراه را وارد کنید"
                  style={
                    userInfo.phone_number
                      ? {
                          direction: "ltr",
                          textAlign: "left",
                        }
                      : {
                          direction: "rtl",
                          textAlign: "right",
                        }
                  }
                />
              </div>
            </div>
            <div className="user-profile-info-3">
              <h3>تغییر رمز عبور</h3>
              <div className="user-profile-info-3-grid">
                <div className="user-profile-label-input">
                  <label htmlFor="old_password">رمز عبور کنونی</label>
                  <div className="password-box">
                    <input
                      id="old_password"
                      name="old_password"
                      type={showOldPassword ? "text" : "password"}
                      autoComplete="off"
                      disabled={edit}
                      value={passwordData.old_password}
                      onChange={handleChangePassword}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => {
                        if (!edit) {
                          setShowOldPassword(!showOldPassword);
                        }
                      }}
                    >
                      {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                <div className="user-profile-label-input">
                  <label htmlFor="new_password">رمز عبور جدید</label>
                  <div className="password-box">
                    <input
                      id="new_password"
                      name="new_password"
                      type={showNewPassword ? "text" : "password"}
                      autoComplete="off"
                      disabled={edit}
                      value={passwordData.new_password}
                      onChange={handleChangePassword}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => {
                        if (!edit) {
                          setShowNewPassword(!showNewPassword);
                        }
                      }}
                    >
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                <div className="user-profile-label-input">
                  <label htmlFor="new_password2">تایید رمز عبور جدید</label>
                  <div className="password-box">
                    <input
                      id="new_password2"
                      name="new_password2"
                      type={showNewPassword2 ? "text" : "password"}
                      autoComplete="off"
                      disabled={edit}
                      value={passwordData.new_password2}
                      onChange={handleChangePassword}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => {
                        if (!edit) {
                          setShowNewPassword2(!showNewPassword2);
                        }
                      }}
                    >
                      {showNewPassword2 ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
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
