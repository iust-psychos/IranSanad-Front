import constants from "./constants";
import { MdEmail, MdPhoneEnabled, MdLocationPin } from "react-icons/md";
import { TbLanguage } from "react-icons/tb";
import { FaLocationDot } from "react-icons/fa6";
import { HiDocumentDuplicate } from "react-icons/hi2";
import { FaUser } from "react-icons/fa";

export const getLandingInfoAPI = `${constants.baseUrl}auth/info/`;

export const baseAPI = `${constants.baseDomain}`;

export {MdEmail, MdPhoneEnabled, MdLocationPin, TbLanguage, FaLocationDot, HiDocumentDuplicate, FaUser}

export const getLandingInfo = async () => {
  return await apiFetch(getLandingInfoAPI, {
    method: "GET",
  });
};
