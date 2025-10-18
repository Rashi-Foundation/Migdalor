import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { http, setAuthToken } from "../api/http";
import { AuthContext } from "./AuthContextContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verify token with backend - the cookie will be sent automatically
        const response = await http.get("/me");
        setUser(response.data);
      } catch {
        // Token is invalid or expired, user is not authenticated
        setUser(null);
      }
      setLoading(false);
    };

    // Only check auth if we're not on the login page
    if (location.pathname !== "/") {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [location.pathname]);

  // Redirect logic based on authentication state
  useEffect(() => {
    if (!loading) {
      const isLoginPage = location.pathname === "/";
      const isAuthenticated = !!user;

      if (isAuthenticated && isLoginPage) {
        // User is logged in but on login page, redirect to home
        navigate("/home", { replace: true });
      } else if (!isAuthenticated && !isLoginPage) {
        // User is not logged in but trying to access protected page, redirect to login
        navigate("/", { replace: true });
      }
    }
  }, [user, loading, location.pathname, navigate]);

  const login = (userData) => {
    // No need to store token locally - it's now in httpOnly cookie
    setUser(userData);
  };

  const logout = async () => {
    try {
      // Call logout endpoint to clear the httpOnly cookie
      await http.post("/logout");
    } catch (error) {
      // Even if logout fails, we should still clear the user state
      console.error("Logout error:", error);
    }
    // Clear any persisted Authorization header fallback
    setAuthToken(null);
    setUser(null);
    navigate("/", { replace: true });
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
