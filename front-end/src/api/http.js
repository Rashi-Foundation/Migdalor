import axios from "axios";
import serverUrl from "@config/api";

export const http = axios.create({
  baseURL: `${serverUrl}/api`,
  withCredentials: true, // send cookies when allowed by browser
});

// Initialize Authorization header from persisted token (fallback for browsers blocking cross-site cookies)
const persistedToken = localStorage.getItem("auth_token");
if (persistedToken) {
  http.defaults.headers.common["Authorization"] = `Bearer ${persistedToken}`;
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem("auth_token", token);
    http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("auth_token");
    delete http.defaults.headers.common["Authorization"];
  }
}

// Add response interceptor to handle token expiration
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on unauthorized
      localStorage.removeItem("auth_token");
      delete http.defaults.headers.common["Authorization"];
      // Only redirect if we're not already on the login page
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);
