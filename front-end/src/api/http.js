import axios from "axios";
import serverUrl from "@config/api";

export const http = axios.create({
  baseURL: `${serverUrl}/api`,
  withCredentials: true, // This ensures cookies are sent with requests
});

// Add response interceptor to handle token expiration
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired, redirect to login
      // Only redirect if we're not already on the login page
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);
