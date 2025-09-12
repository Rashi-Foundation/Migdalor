import React, { useEffect, useState } from "react";
import { http } from "../../api/http";

export default function AdminUsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyUser, setBusyUser] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await http.get("/users");
      // Ensure admins first
      const sorted = [...(data || [])].sort(
        (a, b) => b.isAdmin - a.isAdmin || a.username.localeCompare(b.username)
      );
      setUsers(sorted);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const changePassword = async (username) => {
    const newPassword = window.prompt(`Set new password for ${username}:`);
    if (!newPassword) return;
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    try {
      setBusyUser(username);
      await http.put(`/users/${encodeURIComponent(username)}/password`, {
        newPassword,
      });
      alert("Password updated");
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to change password");
    } finally {
      setBusyUser(null);
    }
  };

  const deleteUser = async (username) => {
    if (username === "admin") return; // UI guard: cannot delete built-in admin
    if (!window.confirm(`Delete user ${username}?`)) return;
    try {
      setBusyUser(username);
      await http.delete(`/users/${encodeURIComponent(username)}`);
      setUsers((prev) => prev.filter((u) => u.username !== username));
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to delete user");
    } finally {
      setBusyUser(null);
    }
  };

  if (loading) return <div className="theme-text-tertiary">טוען משתמשים…</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  if (!users.length)
    return <div className="theme-text-tertiary">No users.</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
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
          Users ({users.length})
        </h3>
        <div className="text-sm theme-text-secondary">
          {users.filter((u) => u.isAdmin).length} admin(s)
        </div>
      </div>

      <div className="grid gap-3">
        {users.map((u, idx) => (
          <div
            key={u.id}
            className={`theme-bg-tertiary rounded-xl p-4 border transition-all duration-200 hover:scale-[1.02] hover:shadow-md ${
              u.isAdmin
                ? "border-amber-300 dark:border-amber-700 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20"
                : "theme-border-primary"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    u.isAdmin
                      ? "bg-gradient-to-r from-amber-500 to-yellow-500"
                      : "bg-gradient-to-r from-blue-500 to-indigo-500"
                  }`}
                >
                  {u.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold theme-text-primary text-lg">
                      {u.username}
                    </span>
                    {u.isAdmin && (
                      <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-xs font-medium rounded-full flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L3.5 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.734.99A.996.996 0 0118 6v2a1 1 0 11-2 0v-.277l-1.754-1.132a1 1 0 11-.992-1.736L14.984 6l-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11.254 10.4 12 10.848a1 1 0 11-.992 1.736l-1.75-1a1 1 0 01-.372-1.364zM3.5 11.5a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm14 0a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zm-9.5 3a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Admin
                      </span>
                    )}
                  </div>
                  <div className="text-sm theme-text-secondary">
                    {u.isAdmin ? "Administrator" : "Regular User"}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => changePassword(u.username)}
                  disabled={busyUser === u.username}
                  className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    busyUser === u.username
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:scale-105 hover:shadow-md"
                  }`}
                >
                  {busyUser === u.username ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
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
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      />
                    </svg>
                  )}
                  Change Password
                </button>

                <button
                  onClick={() => deleteUser(u.username)}
                  disabled={u.username === "admin" || busyUser === u.username}
                  className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    u.username === "admin" || busyUser === u.username
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-500 to-pink-500 hover:scale-105 hover:shadow-md"
                  }`}
                  title={
                    u.username === "admin"
                      ? "Cannot delete 'admin' user"
                      : "Delete user"
                  }
                >
                  {busyUser === u.username ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  )}
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm theme-text-tertiary">
          💡 Admin users are highlighted and protected from deletion
        </p>
      </div>
    </div>
  );
}
