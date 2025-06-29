import axios from "axios";
import constants from "./constants";

export const sendValidationCode = async (email) => {
  const result = await axios.post(
    constants.baseUrl + "auth/verification/forget_password/",
    { email: email }
  );
  return result;
};

export const verify = async (email, code) => {
  const result = await axios.post(
    constants.baseUrl + "auth/verification/verify_code/",
    { email: email, code: code }
  );
  return result;
};

export const resendCode = async (email) => {
  const result = await axios.post(
    constants.baseUrl + "auth/verification/resend/",
    { email: email }
  );
  return result;
};

export const sendNewPassword = async (
  code,
  email,
  password,
  repeatPassword
) => {
  const result = await axios.post(
    constants.baseUrl + "auth/verification/forget_password_verify/",
    {
      code: code,
      email: email,
      new_password: password,
      new_password2: repeatPassword,
    }
  );
  return result;
};
