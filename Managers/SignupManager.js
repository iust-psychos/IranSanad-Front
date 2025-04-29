import axios from "axios";
import constants from "./constants";
const Signup = async (username, email, repeatpassword, password) => {
  const result = await axios.post(constants.baseUrl + "auth/register/", {
    email: email,
    password: password,
    password2: repeatpassword,
    username: username,
  });
  return result;
};

const verify_code = async (email, code) => {
    const result = await axios.post(
      constants.baseUrl + "auth/verification/verify_email/",
      { email: email, code: code }
    );
    return result;
  };
  
const resendCode = async (email) => {
    const result = await axios.post(
      constants.baseUrl + "auth/verification/resend/",
      { email: email }
    );
    return result;
  };

const sendValidationCode = async (email) => {
    const result = await axios.post(
      constants.baseUrl + "auth/verification/forget_password/",
      { email: email }
    );
    return result;
  };
export default { Signup ,verify_code ,resendCode ,sendValidationCode};
