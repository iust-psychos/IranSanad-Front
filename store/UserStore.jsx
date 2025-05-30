import { create } from "zustand";
import axios from "axios";
import CookieManager from "@/managers/CookieManager";
import constants from "@/managers/constants";

const getUserInfoAPI = "auth/info/";

export const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  fetchUser: async () => {
    const token = CookieManager.LoadToken();
    if (!token) return;

    try {
      const res = await axios.get(`${constants.baseUrl}${getUserInfoAPI}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
      });
      set({ user: res.data });
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  },
}));
