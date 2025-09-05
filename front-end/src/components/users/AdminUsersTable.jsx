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

  if (loading) return <div className="text-gray-500">טוען משתמשים…</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  if (!users.length) return <div className="text-gray-500">No users.</div>;

  return (
    <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
      <h3 className="text-lg font-semibold mb-3">רשימת משתמשים</h3>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left bg-gray-100">
            <th className="px-3 py-2">Username</th>
            <th className="px-3 py-2">Admin</th>
            <th className="px-3 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, idx) => (
            <tr key={u.id} className={idx === 0 ? "bg-amber-50" : ""}>
              <td className="px-3 py-2 font-medium">{u.username}</td>
              <td className="px-3 py-2">{u.isAdmin ? "Yes" : "No"}</td>
              <td className="px-3 py-2">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => changePassword(u.username)}
                    disabled={busyUser === u.username}
                    className={`px-3 py-1 rounded text-white text-xs font-semibold ${
                      busyUser === u.username
                        ? "bg-gray-400"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    Change Password
                  </button>
                  <button
                    onClick={() => deleteUser(u.username)}
                    disabled={u.username === "admin" || busyUser === u.username}
                    className={`px-3 py-1 rounded text-white text-xs font-semibold ${
                      u.username === "admin" || busyUser === u.username
                        ? "bg-gray-400"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                    title={
                      u.username === "admin"
                        ? "Cannot delete 'admin' user"
                        : "Delete user"
                    }
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-gray-500 mt-2">
        הערה: משתמשי מנהל מסודרים ראשונים וחסומים למחיקה.
      </p>
    </div>
  );
}
