import constants from "./constants";
import { apiFetch } from "@/utils/apiFetch";

export const getUserInfoAPI = `${constants.baseUrl}auth/info/`;

export const changePasswordAPI = `${constants.baseUrl}auth/change_password/`;

export const changeUserInfoAPI = `${constants.baseUrl}auth/info/`;

export const changeProfileImageAPI = `${constants.baseUrl}auth/profile/`;

export const baseAPI = `${constants.baseDomain}`;

export const changeUserInfo = async (updatedUser) => {
  return await apiFetch(changeUserInfoAPI, {
    method: "PUT",
    body: JSON.stringify({
            username: updatedUser.username,
            email: updatedUser.email,
            phone_number: updatedUser.phone_number,
            first_name: updatedUser.first_name,
            last_name: updatedUser.last_name,
          }),
  });
};

export const changeUserPass = async (changePassword) => {
  return await apiFetch(changePasswordAPI, {
    method: "POST",
    body: JSON.stringify({
            old_password: changePassword.current,
            new_password: changePassword.new,
            new_password2: changePassword.confirm,
          }),
  });
};

export const changeUserImage = (changeImage) => {
  return apiFetch(changeProfileImageAPI, {
    method: "POST",
    body: JSON.stringify({
            profile_image: changeImage
          }),
  });
};