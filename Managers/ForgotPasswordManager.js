import axios from "axios";
import constants from "./constants";

export const getValidationCode = async (email) => {
  //const result = await axios.post(constants.baseUrl + "auth/get_validation_code/", {email: email});
  //return result;
  return { code: 201, validationCode: "1234" };
};

export const sendNewPassword = async (email,password, repeatPassword) => {
  //const result = await axios.post(constants.baseUrl + "auth/change_password/", {
  //  email: email,
  //  password: password,
  //  repeatPassword : repeatPassword
  //});
  //return result;
  return {code:201,token:'1234'}
};
