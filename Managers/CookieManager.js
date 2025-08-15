import Constants from "./Constants";
import Cookies from "js-cookie";

const SaveToken = (expire, token) => {
  Cookies.set(Constants.CookieKey, token, { expires: expire });
};

const LoadToken = () => {
  return Cookies.get(Constants.CookieKey);
};

const RemoveToken = () => {
  Cookies.remove(Constants.CookieKey);
};

export default { SaveToken, LoadToken, RemoveToken };
