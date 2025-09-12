import React, { useState } from "react";
import { http } from "../../api/http";
import ErrorMessage, { useErrorHandler, getErrorInfo } from "../ErrorMessage";

export default function CreateUserForm() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    isAdmin: false,
  });
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState(null);

  const {
    error,
    errorType,
    clearError,
    setValidationError,
    setServerError,
    setSuccess,
  } = useErrorHandler();

  const onChange = (e) => {
    const { id, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [id]: type === "checkbox" ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    clearError();
    setBusy(true);

    try {
      // Validate input
      if (!form.username.trim()) {
        setValidationError("נא להכניס שם משתמש");
        return;
      }
      if (!form.password.trim()) {
        setValidationError("נא להכניס סיסמה");
        return;
      }
      if (form.password.length < 6) {
        setValidationError("הסיסמה חייבת להיות באורך 6 תווים לפחות");
        return;
      }

      const res = await http.post("/register", {
        username: form.username.trim(),
        password: form.password,
        isAdmin: !!form.isAdmin,
      });

      setCreated(res.data?.user);
      setSuccess("המשתמש נוצר בהצלחה");
      setForm({ username: "", password: "", isAdmin: false });
    } catch (err) {
      const errorInfo = getErrorInfo(err);

      if (errorInfo.type === "validation") {
        setValidationError(errorInfo.message);
      } else if (errorInfo.type === "server") {
        setServerError(errorInfo.message);
      } else {
        setServerError("שגיאה ביצירת משתמש - נסה שוב");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex text-sm font-medium theme-text-primary items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Username
            </label>
            <input
              id="username"
              value={form.username}
              onChange={onChange}
              required
              placeholder="Enter username"
              className="w-full theme-border-primary border px-4 py-3 rounded-lg text-sm theme-bg-secondary theme-text-primary transition-all duration-200 focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="flex text-sm font-medium theme-text-primary items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Password
            </label>
            <input
              type="password"
              id="password"
              value={form.password}
              onChange={onChange}
              required
              minLength={6}
              placeholder="Enter password (min 6 characters)"
              className="w-full theme-border-primary border px-4 py-3 rounded-lg text-sm theme-bg-secondary theme-text-primary transition-all duration-200 focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <input
            type="checkbox"
            id="isAdmin"
            checked={form.isAdmin}
            onChange={onChange}
            className="h-5 w-5 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
          />
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-amber-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L3.5 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.734.99A.996.996 0 0118 6v2a1 1 0 11-2 0v-.277l-1.754-1.132a1 1 0 11-.992-1.736L14.984 6l-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11.254 10.4 12 10.848a1 1 0 11-.992 1.736l-1.75-1a1 1 0 01-.372-1.364zM3.5 11.5a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm14 0a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zm-9.5 3a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium theme-text-primary">
              Grant Administrator Privileges
            </span>
          </div>
        </div>

        <ErrorMessage
          message={error}
          type={errorType}
          show={!!error}
          onClose={clearError}
          className="mb-4"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={busy}
            className={`px-6 py-3 rounded-lg text-white text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              busy
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-emerald-500 hover:scale-105 hover:shadow-lg"
            }`}
          >
            {busy ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating User...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Create User
              </>
            )}
          </button>
        </div>
      </form>

      {created && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-4">
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold theme-text-primary">
              User Created Successfully!
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="theme-bg-secondary border theme-border-primary rounded-lg p-4">
              <div className="text-sm theme-text-secondary mb-1">User ID</div>
              <div className="font-semibold break-words theme-text-primary text-lg">
                {created.id}
              </div>
            </div>
            <div className="theme-bg-secondary border theme-border-primary rounded-lg p-4">
              <div className="text-sm theme-text-secondary mb-1">Username</div>
              <div className="font-semibold break-words theme-text-primary text-lg">
                {created.username}
              </div>
            </div>
            <div className="theme-bg-secondary border theme-border-primary rounded-lg p-4">
              <div className="text-sm theme-text-secondary mb-1">Role</div>
              <div className="font-semibold break-words theme-text-primary text-lg flex items-center gap-2">
                {created.isAdmin ? (
                  <>
                    <svg
                      className="w-4 h-4 text-amber-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L3.5 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.734.99A.996.996 0 0118 6v2a1 1 0 11-2 0v-.277l-1.754-1.132a1 1 0 11-.992-1.736L14.984 6l-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11.254 10.4 12 10.848a1 1 0 11-.992 1.736l-1.75-1a1 1 0 01-.372-1.364zM3.5 11.5a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm14 0a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zm-9.5 3a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Administrator
                  </>
                ) : (
                  "Regular User"
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
