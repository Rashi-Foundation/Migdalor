import React, { useState } from "react";
import { http } from "../../api/http";

export default function CreateUserForm() {
  const [form, setForm] = useState({ username: "", password: "", isAdmin: false });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [created, setCreated] = useState(null);

  const onChange = (e) => {
    const { id, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [id]: type === "checkbox" ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setBusy(true);
    try {
      if (!form.username.trim() || !form.password.trim()) {
        setMsg("נדרש שם משתמש וסיסמה");
        return;
      }
      const res = await http.post("/register", {
        username: form.username.trim(),
        password: form.password,
        isAdmin: !!form.isAdmin,
      });
      setCreated(res.data?.user);
      setMsg("נוצר משתמש בהצלחה");
      setForm({ username: "", password: "", isAdmin: false });
    } catch (err) {
      setMsg(err?.response?.data?.message || "שגיאה ביצירת משתמש");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-3">יצירת משתמש</h2>
      <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="block mb-1 text-sm font-medium">Username</span>
          <input
            id="username"
            value={form.username}
            onChange={onChange}
            required
            className="w-full border p-2 rounded text-sm"
          />
        </label>
        <label className="block">
          <span className="block mb-1 text-sm font-medium">Password</span>
          <input
            type="password"
            id="password"
            value={form.password}
            onChange={onChange}
            required
            minLength={6}
            className="w-full border p-2 rounded text-sm"
          />
        </label>
        <label className="inline-flex items-center gap-2 mt-6">
          <input
            type="checkbox"
            id="isAdmin"
            checked={form.isAdmin}
            onChange={onChange}
            className="h-4 w-4"
          />
          <span className="text-sm">Admin</span>
        </label>

        {msg && (
          <div
            className={`sm:col-span-2 rounded px-3 py-2 text-sm ${
              msg.includes("שגיאה") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
            }`}
          >
            {msg}
          </div>
        )}

        <div className="sm:col-span-2 flex justify-end gap-2">
          <button
            type="submit"
            disabled={busy}
            className="px-4 py-2 rounded bg-[#1F6231] text-white text-sm font-medium hover:bg-[#309d49]"
          >
            {busy ? "שומר…" : "יצירת משתמש"}
          </button>
        </div>
      </form>

      {created && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border rounded-lg p-3">
            <div className="text-sm text-gray-500">ID</div>
            <div className="font-semibold break-words">{created.id}</div>
          </div>
          <div className="border rounded-lg p-3">
            <div className="text-sm text-gray-500">Username</div>
            <div className="font-semibold break-words">{created.username}</div>
          </div>
          <div className="border rounded-lg p-3">
            <div className="text-sm text-gray-500">Admin</div>
            <div className="font-semibold break-words">{created.isAdmin ? "Yes" : "No"}</div>
          </div>
        </div>
      )}
    </div>
  );
}

