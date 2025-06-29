import { apiFetch } from "@/utils/apiFetch";
import constants from "./constants.js";

export const initialDocuments = [
  {
    id: 1,
    name: "تکلیف درس ریاضی 2",
    owner: "من",
    last_modified_time: "1403/12/06",
    last_seen_time: "11:30",
  },
  {
    id: 2,
    name: "تکلیف درس ریاضی 1",
    owner: "a.Sadeghy",
    last_modified_time: "1403/12/08",
    last_seen_time: "1403/11/07",
  },
  {
    id: 3,
    name: "چک لیست سفر",
    owner: "h.Sadat",
    last_modified_time: "1403/12/10",
    last_seen_time: "19:45",
  },
  {
    id: 4,
    name: "گزارش پروژه هوش",
    owner: "E.Hemmaty",
    last_modified_time: "1403/12/13",
    last_seen_time: "1404/01/21",
  },
];

export const userDashboardLoader = async () => {
  return apiFetch(`${constants.baseUrl}docs/`);
};

export const userInfoLoader = async () => {
  return apiFetch(`${constants.baseUrl}auth/info/`);
};

export const deleteDocument = async (uuid) => {
  return await apiFetch(`${constants.baseUrl}docs/${uuid}/`, {
    method: "DELETE",
  });
};

export const renameDocument = async (uuid, name) => {
  return await apiFetch(`${constants.baseUrl}docs/${uuid}/`, {
    method: "PATCH",
    body: JSON.stringify({ title: name }),
  });
};

export const createDocument = async () => {
  return await apiFetch(`${constants.baseUrl}docs/`, {
    method: "Post",
  });
};
