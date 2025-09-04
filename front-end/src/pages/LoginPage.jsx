import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { http } from "../api/http";

const LoginPage = () => {
  // login form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // UI state
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const navigate = useNavigate();

  const resetMessages = () => {
    setError(null);
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    resetMessages();
    setBusy(true);

    try {
      const { data } = await http.post("/login", { username, password });
      if (data?.success && data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user || {}));
        navigate("/home");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || "An error occurred during login"
      );
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

        {error && (
          <div className="mb-4 rounded-lg px-4 py-3 text-sm bg-red-100 text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmitLogin} className="flex flex-col items-center">
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
              busy ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-700"
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
