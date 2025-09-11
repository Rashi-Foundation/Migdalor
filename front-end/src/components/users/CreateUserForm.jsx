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
    <div className="theme-bg-secondary rounded-xl theme-shadow-md p-4 transition-colors duration-300">
      <h2 className="text-lg font-semibold mb-3 theme-text-primary">
        יצירת משתמש
      </h2>
      <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="block mb-1 text-sm font-medium theme-text-primary">
            Username
          </span>
          <input
            id="username"
            value={form.username}
            onChange={onChange}
            required
            className="w-full theme-border-primary border p-2 rounded text-sm theme-bg-secondary theme-text-primary transition-colors duration-200"
          />
        </label>
        <label className="block">
          <span className="block mb-1 text-sm font-medium theme-text-primary">
            Password
          </span>
          <input
            type="password"
            id="password"
            value={form.password}
            onChange={onChange}
            required
            minLength={6}
            className="w-full theme-border-primary border p-2 rounded text-sm theme-bg-secondary theme-text-primary transition-colors duration-200"
          />
        </label>
        <label className="inline-flex items-center gap-2 mt-6">
          <input
            type="checkbox"
            id="isAdmin"
            checked={form.isAdmin}
            onChange={onChange}
            className="h-4 w-4 theme-accent"
          />
          <span className="text-sm theme-text-primary">Admin</span>
        </label>

        <ErrorMessage
          message={error}
          type={errorType}
          show={!!error}
          onClose={clearError}
          className="sm:col-span-2 mb-3"
        />

        <div className="sm:col-span-2 flex justify-end gap-2">
          <button
            type="submit"
            disabled={busy}
            className="px-4 py-2 rounded theme-accent theme-accent-hover text-white text-sm font-medium transition-all duration-200 hover:scale-105"
          >
            {busy ? "שומר…" : "יצירת משתמש"}
          </button>
        </div>
      </form>

      {created && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="theme-border-primary border rounded-lg p-3 transition-colors duration-300">
            <div className="text-sm theme-text-secondary">ID</div>
            <div className="font-semibold break-words theme-text-primary">
              {created.id}
            </div>
          </div>
          <div className="theme-border-primary border rounded-lg p-3 transition-colors duration-300">
            <div className="text-sm theme-text-secondary">Username</div>
            <div className="font-semibold break-words theme-text-primary">
              {created.username}
            </div>
          </div>
          <div className="theme-border-primary border rounded-lg p-3 transition-colors duration-300">
            <div className="text-sm theme-text-secondary">Admin</div>
            <div className="font-semibold break-words theme-text-primary">
              {created.isAdmin ? "Yes" : "No"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
