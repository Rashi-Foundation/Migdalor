import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { http } from "../api/http";
import ErrorMessage, {
  useErrorHandler,
  getErrorInfo,
} from "../components/ErrorMessage";

const LoginPage = () => {
  // login form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // UI state
  const [busy, setBusy] = useState(false);

  const navigate = useNavigate();
  const {
    error,
    errorType,
    clearError,
    setAuthError,
    setNetworkError,
    setServerError,
  } = useErrorHandler();

  const resetMessages = () => {
    clearError();
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    resetMessages();
    setBusy(true);

    try {
      // Validate input
      if (!username.trim()) {
        setAuthError("נא להכניס שם משתמש");
        return;
      }
      if (!password.trim()) {
        setAuthError("נא להכניס סיסמה");
        return;
      }

      const { data } = await http.post("/login", { username, password });

      if (data?.success && data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user || {}));
        navigate("/home");
      } else {
        setAuthError("התחברות נכשלה - נסה שוב");
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
        setServerError("שגיאה לא צפויה - נסה שוב");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url('/loginPic.jpg')` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="z-10 max-w-md w-full mx-auto p-8 bg-white bg-opacity-90 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          התחברות
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
          className="flex flex-col items-center"
        >
          <div className="mb-4 w-full">
            <label className="block text-gray-700 text-sm font-bold mb-2 text-center">
              שם משתמש
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={busy}
              placeholder="הכנס את שם המשתמש שלך"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-6 w-full">
            <label className="block text-gray-700 text-sm font-bold mb-2 text-center">
              סיסמה
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={busy}
              placeholder="הכנס את הסיסמה שלך"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className={`w-full text-white font-bold py-2 px-4 rounded-lg mb-4 ${
              busy
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-700"
            }`}
          >
            {busy ? "מתחבר…" : "התחברות"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
