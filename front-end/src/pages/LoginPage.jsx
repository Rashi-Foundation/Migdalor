import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { http } from "../api/http";
import { useAuth } from "../contexts/AuthContext";
import ErrorMessage, {
  useErrorHandler,
  getErrorInfo,
} from "../components/ErrorMessage";

const LoginPage = () => {
  const { t } = useTranslation();
  const { login } = useAuth();

  // login form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // UI state
  const [busy, setBusy] = useState(false);

  const {
    error,
    errorType,
    clearError,
    setAuthError,
    setNetworkError,
    setServerError,
  } = useErrorHandler();

  const handleSubmitLogin = async (e) => {
    e.preventDefault();

    // Clear any existing errors only when starting a new login attempt
    clearError();
    setBusy(true);

    try {
      // Validate input
      if (!username.trim()) {
        setAuthError(t("loginPage.errors.usernameRequired"));
        setBusy(false);
        return;
      }
      if (!password.trim()) {
        setAuthError(t("loginPage.errors.passwordRequired"));
        setBusy(false);
        return;
      }

      const { data } = await http.post("/login", { username, password });

      if (data?.success && data?.token) {
        // Only call login if successful - this prevents unwanted redirects
        login(data.user || {}, data.token);
      } else {
        setAuthError(t("loginPage.errors.loginFailed"));
        setBusy(false);
      }
    } catch (err) {
      const errorInfo = getErrorInfo(err);

      if (errorInfo.type === "auth") {
        setAuthError(errorInfo.message);
      } else if (errorInfo.type === "network") {
        setNetworkError(errorInfo.message);
      } else if (errorInfo.type === "server") {
        setServerError(errorInfo.message);
      } else {
        setServerError(t("loginPage.errors.unexpectedError"));
      }
      setBusy(false);
    }
  };

  // Debug: Monitor error changes
  useEffect(() => {
    console.log("Error changed:", error);
    if (error) {
      console.log("Error set at:", new Date().toLocaleTimeString());
    }
  }, [error]);

  // Debug: Monitor user state changes
  const { user } = useAuth();
  useEffect(() => {
    console.log("User state changed:", user);
  }, [user]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url('/loginPic.jpg')` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="z-10 max-w-sm sm:max-w-md w-full mx-4 sm:mx-auto p-6 sm:p-8 theme-bg-secondary bg-opacity-90 rounded-lg theme-shadow-lg transition-colors duration-300">
        <h2 className="responsive-heading font-bold theme-text-primary text-center mb-4 sm:mb-6">
          {t("loginPage.title")}
        </h2>

        <ErrorMessage
          message={error}
          type={errorType}
          show={!!error}
          onClose={clearError}
          className="mb-4"
        />

        <form
          onSubmit={handleSubmitLogin}
          className="flex flex-col items-center mobile-form"
        >
          <div className="mb-4 w-full">
            <label className="block theme-text-primary text-sm font-bold mb-2 text-center">
              {t("loginPage.usernameLabel")}
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={busy}
              placeholder={t("loginPage.usernamePlaceholder")}
              className="w-full px-3 py-2 theme-border-primary border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] theme-bg-secondary theme-text-primary transition-colors duration-200 touch-input"
              required
            />
          </div>

          <div className="mb-6 w-full">
            <label className="block theme-text-primary text-sm font-bold mb-2 text-center">
              {t("loginPage.passwordLabel")}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={busy}
              placeholder={t("loginPage.passwordPlaceholder")}
              className="w-full px-3 py-2 theme-border-primary border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] theme-bg-secondary theme-text-primary transition-colors duration-200 touch-input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className={`w-full text-white font-bold py-3 px-4 rounded-lg mb-4 transition-all duration-200 touch-button ${
              busy
                ? "bg-gray-400 cursor-not-allowed"
                : "theme-accent theme-accent-hover hover:scale-105"
            }`}
          >
            {busy ? t("loginPage.loggingIn") : t("loginPage.loginButton")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
