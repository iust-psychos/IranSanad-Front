import { api } from "./ApiManager";

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
  const response = await api.get("/docs/");
  return response.data;
};

export const userInfoLoader = async () => {
  const response = await api.get("/auth/info/");
  return response.data;
};

export const deleteDocument = async (id) => {
  const response = api.delete(`/docs/${id}/`);
  return response.data;
};

export const renameDocument = async (id, name) => {
  const response = api.patch(`docs/${id}/`, { title: name });
  return response.data;
};

export const createDocument = async () => {
  const response = await api.post(`/docs/`);
  return response.data;
};
