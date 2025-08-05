import { useState, useEffect } from "react";
import "@/styles/UserProfile.css";
import axios from "axios";
import CookieManager from "@/managers/CookieManager";
import { showErrorToast, showSuccessToast } from "@/utils/Toast.js";
import { convertToBase64 } from "@/utils/Base64ImageConverter.js";
import {
  getUserInfoAPI,
  changeUserInfo,
  changeUserPass,
  changeUserImage,
  baseAPI,
} from "@/managers/UserProfileManager.js";
import Navbar from "../../Components/Navbar";
import { CiUser } from "react-icons/ci";
import { toPersianDate } from "../../utils/PersianDateConverter";
import InfoForm from "./InfoForm";
import PasswordForm from "./PasswordForm";

const imagePathReader = (path) => {
  return baseAPI + path.slice(1);
};

const UserProfile = () => {
  const token = CookieManager.LoadToken();

  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    profile_image: "",
    email: "",
    phone_number: "",
    username: "",
    date_joined: new Date(),
  });

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
        setUpdatedUser(response.data);
        console.log(response);
      })
      .catch((error) => console.log(error));
  }, []);

  const [form, setForm] = useState("Info");
  const handleChangeForm = (value) => {
    setForm(value);
  };

  const [updatedUser, setUpdatedUser] = useState(user);
  const [changePassword, setChangePassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const isChangeUserInfo = () => {
    return !(
      updatedUser.first_name === user.first_name &&
      updatedUser.last_name === user.last_name &&
      updatedUser.phone_number === user.phone_number &&
      updatedUser.username === user.username
    );
  };

  const isChangeUserPass = () => {
    return (
      changePassword.current != "" &&
      changePassword.new != "" &&
      changePassword.confirm != ""
    );
  };

  const isChangeUserImage = () => {
    return user.profile_image !== updatedUser.profile_image;
  };

  const handleChangeUserInfo = (name, value) => {
    if (name === "fname") {
      setUpdatedUser((user) => ({ ...user, first_name: value }));
    } else if (name === "lname") {
      setUpdatedUser((user) => ({ ...user, last_name: value }));
    } else if (name == "number") {
      setUpdatedUser((user) => ({ ...user, phone_number: value }));
    } else if (name == "username") {
      setUpdatedUser((user) => ({ ...user, username: value }));
    }
  };

  const handleChangeUserPass = (name, value) => {
    if (name === "current") {
      setChangePassword((pass) => ({ ...pass, current: value }));
    } else if (name === "new") {
      setChangePassword((pass) => ({ ...pass, new: value }));
    } else if (name == "confirm") {
      setChangePassword((pass) => ({ ...pass, confirm: value }));
    }
  };

  const handleChangeImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const base64 = await convertToBase64(file);
      const previewUrl = URL.createObjectURL(file);

      setUpdatedUser((prev) => ({
        ...prev,
        profile_image: base64,
        profile_image_preview: previewUrl,
      }));
    } catch (error) {
      console.error("Error converting image:", error);
      showErrorToast("خطا در انتخاب تصویر");
    }
  };

  const handleDeleteImage = () => {
    setUpdatedUser((user) => ({
      ...user,
      profile_image: "",
    }));
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

  const handleCancelButton = () => {
    setUpdatedUser(user);
  };

  const handleSubmitButton = async () => {
    if (isChangeUserInfo()) {
      try {
        const response = await changeUserInfo(updatedUser);
        console.log(response);
        showSuccessToast("اطلاعات با موفقیت ذخیره شد");
        setUser((prev) => ({
          ...prev,
          username: updatedUser.username,
          email: updatedUser.email,
          phone_number: updatedUser.phone_number,
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
        }));
      } catch (error) {
        console.log(error);
        showErrorToast(getErrorMessage(error));
        setUpdatedUser(user);
      }
    }
    if (isChangeUserPass()) {
      try {
        const response = await changeUserPass(changePassword);
        console.log(response);
        showSuccessToast("رمزعبور با موفقیت تغییر کرد");
        setChangePassword({
          current: "",
          new: "",
          confirm: "",
        });
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
    if (isChangeUserImage()) {
      try {
        const response = changeUserImage(updatedUser.profile_image);
        console.log(response);
        showSuccessToast("تصویر پروفایل با موفقیت تغییر کرد");
        setUser((prev) => ({
          ...prev,
          profile_image: updatedUser.profile_image,
        }));
      } catch (error) {
        console.log(error);
        showErrorToast(getErrorMessage(error));
        setUpdatedUser(user);
      }
    }
  };

  return (
    <div className="user-profile">
      <Navbar />
      <div className="user-profile-area">
        <div className="user-profile-header">
          {updatedUser.profile_image || updatedUser.profile_image_preview ? (
            <img
              className="user-profile-header-image"
              src={
                updatedUser.profile_image_preview
                  ? updatedUser.profile_image_preview
                  : imagePathReader(updatedUser.profile_image)
              }
              alt={updatedUser.first_name}
            />
          ) : (
            <CiUser className="user-profile-header-image" size={100} />
          )}
          <div className="user-profile-header-buttons">
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="user-profile-image-upload"
              onChange={handleChangeImage}
            />
            <label htmlFor="user-profile-image-upload">
              <button
                type="button"
                onClick={() =>
                  document.getElementById("user-profile-image-upload").click()
                }
              >
                تغییر تصویر
              </button>
            </label>
            <button onClick={handleDeleteImage}>حذف تصویر</button>
          </div>
        </div>
        <div className="user-profile-content">
          <div className="user-profile-content-text">
            <div className="user-profile-content-right">
              <h1 className="user-profile-content-name">
                {updatedUser.first_name + " " + updatedUser.last_name}
              </h1>
              <h2 className="user-profile-content-email">
                {updatedUser.email}
              </h2>
            </div>
            <div className="user-profile-content-left">
              <h3 className="user-profile-content-datejoined">
                تاریخ عضویت: {toPersianDate(updatedUser.date_joined)}
              </h3>
            </div>
          </div>
          <div className="user-profile-content-forms">
            <div className="user-profile-content-forms-selector">
              <button
                className={form === "Info" ? "activeSelector" : ""}
                onClick={() => {
                  handleChangeForm("Info");
                }}
              >
                اطلاعات شخصی
              </button>
              <button
                className={form === "Pass" ? "activeSelector" : ""}
                onClick={() => {
                  handleChangeForm("Pass");
                }}
              >
                تغییر رمزعبور
              </button>
            </div>
            <div className="user-profile-content-forms-component">
              {form === "Info" ? (
                <InfoForm user={updatedUser} onUpdate={handleChangeUserInfo} />
              ) : (
                <PasswordForm onUpdate={handleChangeUserPass} />
              )}
              <div className="user-profile-content-forms-buttons">
                <button onClick={handleCancelButton}>لغو</button>
                <button
                  className="user-profile-button-save"
                  type="submit"
                  onClick={handleSubmitButton}
                >
                  ذخیره
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
