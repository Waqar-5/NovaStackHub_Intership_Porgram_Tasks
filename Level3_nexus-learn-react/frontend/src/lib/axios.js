import axios from "axios";
import { useAuthStore } from "@/store/authStore";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true, // sends the httpOnly refresh-token cookie
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On a 401, try exactly one silent refresh before giving up — avoids an
// infinite loop if the refresh endpoint itself returns 401.
let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    if (status !== 401 || original._retried || original.url?.includes("/auth/refresh-token")) {
      return Promise.reject(error);
    }
    original._retried = true;

    try {
      if (!refreshPromise) {
        refreshPromise = api.post("/auth/refresh-token").finally(() => {
          refreshPromise = null;
        });
      }
      const { data } = await refreshPromise;
      useAuthStore.getState().setSession(data.data.user, data.data.accessToken);
      original.headers.Authorization = `Bearer ${data.data.accessToken}`;
      return api(original);
    } catch (refreshError) {
      useAuthStore.getState().clearSession();
      return Promise.reject(refreshError);
    }
  }
);
