import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("@lembrepay:token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("@lembrepay:token");
      await AsyncStorage.removeItem("@lembrepay:user");
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
};

export const subscriptionsAPI = {
  list: (page = 1, pageSize = 20) =>
    api.get("/subscriptions", { params: { page, pageSize } }),

  create: (data: {
    name: string;
    description?: string;
    price: string;
    currency?: string;
    billingCycle: "MONTHLY" | "YEARLY" | "CUSTOM";
    customIntervalDays?: number;
    startDate: string;
    reminderDaysBefore?: number;
  }) => api.post("/subscriptions", data),

  deactivate: (id: string) =>
    api.patch(`/subscriptions/${id}/deactive`),
};