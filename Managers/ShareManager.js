import constants from "./constants.js";

export const baseAPI = `${constants.baseDomain}`;

export const postPermissionsAPI = `${constants.baseUrl}docs/permission/set_permission/`;

export const getPermissionsAPI = `${constants.baseUrl}docs/permission/get_permission_list/`;

export const checkValidUserAPI = `${constants.baseUrl}auth/user_lookup/`;

export const getDocAPI = `${constants.baseUrl}docs/`;