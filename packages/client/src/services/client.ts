import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { ApiErrorResponse } from "../types/api";

const getBaseUrl = (): string => {
   const envUrl = import.meta.env.VITE_API_URL;
   if (!envUrl) return "/api";
   const clean = envUrl.replace(/\/+$/, "");
   return clean.endsWith("/api") ? clean : `${clean}/api`;
};

export const apiClient = axios.create({
   baseURL: getBaseUrl(),
   withCredentials: true,
   headers: {
      "Content-Type": "application/json",
   },
});

// Request interceptor to attach bearer token fallback if available in localStorage
apiClient.interceptors.request.use(
   (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
         config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
   },
   (error) => Promise.reject(error),
);

// Response interceptor to unwrap data and normalize backend error shapes
apiClient.interceptors.response.use(
   (response) => response,
   (error: AxiosError<ApiErrorResponse>) => {
      const backendError = error.response?.data?.error;
      const formattedError = {
         status: error.response?.status || 500,
         code: backendError?.code || "NETWORK_ERROR",
         message:
            backendError?.message ||
            error.message ||
            "An unexpected network error occurred",
         details: backendError?.details,
      };

      // Auto-clear token on unauthorized 401
      if (
         error.response?.status === 401 &&
         window.location.pathname !== "/login" &&
         window.location.pathname !== "/signup"
      ) {
         localStorage.removeItem("token");
      }

      return Promise.reject(formattedError);
   },
);
