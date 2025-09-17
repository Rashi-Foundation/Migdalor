import axios from "axios";
import serverUrl from "@config/api";

export const http = axios.create({
  baseURL: `${serverUrl}/api`,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Add response interceptor to handle token expiration
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired, clear storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Only redirect if we're not already on the login page
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);
