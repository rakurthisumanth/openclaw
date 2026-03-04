import axios from "axios";
import { getValidAccessToken, logout } from "./auth-service.ts";

export const apiClient = axios.create({
  timeout: 15_000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getValidAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      await logout();
      if (typeof window !== "undefined") {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  },
);
