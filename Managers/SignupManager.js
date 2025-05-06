import axios from "axios";
import constants from "./constants";
const Signup = async (username, email, repeatpassword, password, code) => {
  const result = await axios.post(constants.baseUrl + "auth/register/", {
    email: email,
    password: password,
    password2: repeatpassword,
    username: username,
    code: code,
  });
  return result;
};

const resendCode = async (email) => {
  const result = await axios.post(
    constants.baseUrl + "auth/signup_resend_verification/",
    { email: email }
  );
  return result;
};

const sendValidationCode = async (email, username) => {
  const result = await axios.post(
    constants.baseUrl + "auth/signup_email_verification/",
    { email: email, username: username }
  );
  return result;
};
export default { Signup, resendCode, sendValidationCode };
