import { useTranslation } from "react-i18next";
import Navbar from "@components/Navbar";
import DateTime from "@components/DateTime";
import { useMe } from "@hooks/useMe";
import { useState } from "react";
import { http } from "../api/http";
import CreateUserForm from "./users/CreateUserForm";
import AdminUsersTable from "./users/AdminUsersTable";
import ErrorMessage, { useErrorHandler, getErrorInfo } from "./ErrorMessage";

export default function Settings() {
  const { t } = useTranslation();
  const { me, loading } = useMe();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordBusy, setPasswordBusy] = useState(false);

  const {
    error,
    errorType,
    clearError,
    setValidationError,
    setAuthError,
    setServerError,
    setSuccess,
  } = useErrorHandler();

  const handleUpdatePassword = async () => {
    clearError();

    if (newPassword.length < 6) {
      setValidationError(t("settingsPage.passwordMustBe6Characters"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setValidationError(t("settingsPage.passwordsDoNotMatch"));
      return;
    }

    try {
      setPasswordBusy(true);
      await http.put("/me/password", { newPassword });
      setSuccess(t("settingsPage.passwordUpdatedSuccessfully"));
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const errorInfo = getErrorInfo(err);

      if (errorInfo.type === "auth") {
        setAuthError(t("settingsPage.loginAgain"));
      } else if (errorInfo.type === "validation") {
        setValidationError(errorInfo.message);
      } else if (errorInfo.type === "server") {
        setServerError(errorInfo.message);
      } else {
        setServerError(t("settingsPage.errorUpdatingPassword"));
      }
    } finally {
      setPasswordBusy(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <DateTime />

      <div className="max-w-3xl mx-auto p-4">
        <ErrorMessage
          message={error}
          type={errorType}
          show={!!error}
          onClose={clearError}
          className="mb-4"
        />

        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold mb-4">{t("settingsPage.title")}</h1>

          {loading ? (
            <div className="text-gray-500">
              {t("settingsPage.loadingProfile")}
            </div>
          ) : !me ? (
            <div className="text-red-600">
              {t("settingsPage.userNotLoaded")}
            </div>
          ) : (
            <>
              {/* Minimal account info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <InfoCard
                  label={t("settingsPage.username")}
                  value={me.username}
                />
                <InfoCard
                  label={t("settingsPage.admin")}
                  value={
                    me.isAdmin ? t("settingsPage.yes") : t("settingsPage.no")
                  }
                />
              </div>

              {/* Password change */}
              <div>
                <div className="mb-2">
                  <span className="text-base font-semibold">
                    {t("settingsPage.password")}
                  </span>
                </div>
                <div className="text-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="password"
                    className="rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-[#1F6231]"
                    placeholder={t("settingsPage.newPassword")}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <input
                    type="password"
                    className="rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-[#1F6231]"
                    placeholder={t("settingsPage.confirmPassword")}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    onClick={handleUpdatePassword}
                    disabled={passwordBusy}
                    className={`px-6 py-2 rounded-lg text-white font-semibold ${
                      passwordBusy
                        ? "bg-gray-400"
                        : "bg-[#1F6231] hover:bg-[#309d49]"
                    }`}
                  >
                    {passwordBusy
                      ? t("settingsPage.updating")
                      : t("settingsPage.changePassword")}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {t("settingsPage.minimum6Characters")}
                </p>
              </div>
              {me.isAdmin && (
                <div className="mt-8 space-y-4">
                  <h2 className="text-xl font-semibold">
                    {t("settingsPage.userManagement")}
                  </h2>
                  <AdminUsersTable />
                  <CreateUserForm />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/** Small helper so your cards look uniform */
function InfoCard({ label, value, full = false }) {
  return (
    <div className={`border rounded-lg p-4 ${full ? "sm:col-span-2" : ""}`}>
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className="font-semibold break-words">{String(value)}</div>
    </div>
  );
}
