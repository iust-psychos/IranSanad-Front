import CookieManager from "./CookieManager.js";
import constants from "./constants";

export const getUserImageAPI = `${constants.baseUrl}auth/info/`;

export const baseAPI = `http://45.149.77.43:8000`;

export const token = CookieManager.LoadToken();