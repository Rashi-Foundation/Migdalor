import { useTranslation } from "react-i18next";
import Navbar from "@components/Navbar";
import DateTime from "@components/DateTime";
import { useMe } from "@hooks/useMe";
import { useState } from "react";
import { http } from "../api/http";
import CreateUserForm from "../components/users/CreateUserForm";
import AdminUsersTable from "../components/users/AdminUsersTable";
import ErrorMessage, {
  useErrorHandler,
  getErrorInfo,
} from "../components/ErrorMessage";

export default function SettingsPage() {
  const { t } = useTranslation();
  const { me, loading } = useMe();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordBusy, setPasswordBusy] = useState(false);

  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    account: true,
    security: false,
    userManagement: false,
  });

  const {
    error,
    errorType,
    clearError,
    setValidationError,
    setAuthError,
    setServerError,
    setSuccess,
  } = useErrorHandler();

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

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

  if (loading) {
    return (
      <div className="theme-bg-primary min-h-screen transition-colors duration-300">
        <Navbar />
        <DateTime />
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-primary)]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!me) {
    return (
      <div className="theme-bg-primary min-h-screen transition-colors duration-300">
        <Navbar />
        <DateTime />
        <div className="max-w-4xl mx-auto p-4">
          <div className="text-center py-12">
            <div className="text-red-500 text-xl">
              {t("settingsPage.userNotLoaded")}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="theme-bg-primary min-h-screen transition-colors duration-300">
      <Navbar />
      <DateTime />

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <ErrorMessage
          message={error}
          type={errorType}
          show={!!error}
          onClose={clearError}
          className="mb-4"
        />

        {/* Header */}
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full mb-4 shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold theme-text-primary mb-2">
            {t("settingsPage.title")}
          </h1>
          <p className="theme-text-secondary text-lg">
            Manage your account and system preferences
          </p>
        </div>

        {/* Account Information Section */}
        <CollapsibleSection
          title={t("settingsPage.account")}
          icon="👤"
          isExpanded={expandedSections.account}
          onToggle={() => toggleSection("account")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard
              label={t("settingsPage.username")}
              value={me.username}
              icon="🏷️"
            />
            <InfoCard
              label={t("settingsPage.admin")}
              value={me.isAdmin ? t("settingsPage.yes") : t("settingsPage.no")}
              icon={me.isAdmin ? "👑" : "👤"}
              highlight={me.isAdmin}
            />
          </div>
        </CollapsibleSection>

        {/* Security Section */}
        <CollapsibleSection
          title="Security"
          icon="🔒"
          isExpanded={expandedSections.security}
          onToggle={() => toggleSection("security")}
        >
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold theme-text-primary mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
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
                {t("settingsPage.password")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium theme-text-primary">
                    {t("settingsPage.newPassword")}
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-lg theme-border-primary border px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--accent-primary)] theme-bg-secondary theme-text-primary transition-all duration-200"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium theme-text-primary">
                    {t("settingsPage.confirmPassword")}
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-lg theme-border-primary border px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--accent-primary)] theme-bg-secondary theme-text-primary transition-all duration-200"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm theme-text-tertiary">
                  {t("settingsPage.minimum6Characters")}
                </p>
                <button
                  onClick={handleUpdatePassword}
                  disabled={passwordBusy}
                  className={`px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 flex items-center gap-2 ${
                    passwordBusy
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] hover:scale-105 hover:shadow-lg"
                  }`}
                >
                  {passwordBusy ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {t("settingsPage.updating")}
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
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      {t("settingsPage.changePassword")}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* User Management Section (Admin Only) */}
        {me.isAdmin && (
          <CollapsibleSection
            title={t("settingsPage.userManagement")}
            icon="👥"
            isExpanded={expandedSections.userManagement}
            onToggle={() => toggleSection("userManagement")}
            adminOnly
          >
            <div className="space-y-6">
              {/* Add User Section */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold theme-text-primary flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
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
                    Add New User
                  </h3>
                  <div className="text-sm theme-text-secondary">
                    Create and manage user accounts
                  </div>
                </div>
                <CreateUserForm />
              </div>

              {/* Users List */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold theme-text-primary flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    User List
                  </h3>
                  <div className="text-sm theme-text-secondary">
                    Manage existing users
                  </div>
                </div>
                <AdminUsersTable />
              </div>
            </div>
          </CollapsibleSection>
        )}
      </div>
    </div>
  );
}

// Collapsible Section Component
function CollapsibleSection({
  title,
  icon,
  isExpanded,
  onToggle,
  children,
  adminOnly = false,
}) {
  return (
    <div className="theme-bg-secondary theme-shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:theme-bg-tertiary transition-colors duration-200 rounded-t-xl"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <h2 className="text-xl font-semibold theme-text-primary">{title}</h2>
          {adminOnly && (
            <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-xs font-medium rounded-full">
              Admin
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 theme-text-secondary transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  );
}

// Enhanced Info Card Component
function InfoCard({ label, value, icon, highlight = false }) {
  return (
    <div
      className={`theme-border-primary border rounded-xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-md ${
        highlight
          ? "bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-300 dark:border-amber-700"
          : ""
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-lg">{icon}</span>
        <div className="text-sm theme-text-secondary font-medium">{label}</div>
      </div>
      <div
        className={`font-semibold break-words theme-text-primary text-lg ${
          highlight ? "text-amber-800 dark:text-amber-200" : ""
        }`}
      >
        {String(value)}
      </div>
    </div>
  );
}
