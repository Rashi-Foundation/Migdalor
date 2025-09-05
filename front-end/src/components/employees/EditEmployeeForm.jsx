// components/EditEmployeeForm.jsx
import React, { useState, useEffect } from "react";
import { http } from "../../api/http";
import DepartmentDropdown from "../DepartmentDropdown";
import StationSelector from "../StationSelector";
import StatusDropdown from "./StatusDropdown";
import { useMe } from "@hooks/useMe";

const EditEmployeeForm = ({
  employee,
  onClose,
  onUpdateEmployee,
  initialStations = [], // ✅ new
  initialStationAverages = {}, // ✅ new
}) => {
  const { me } = useMe();
  const isAdmin = !!me?.isAdmin;

  // Profile fields (Employee schema only)
  const [person_id] = useState(employee.person_id);
  const [first_name, setFirstName] = useState(employee.first_name || "");
  const [last_name, setLastName] = useState(employee.last_name || "");
  const [email, setEmail] = useState(employee.email || "");
  const [phone, setPhone] = useState(employee.phone || "");
  const [department, setDepartment] = useState(employee.department || "");
  const [role, setRole] = useState(employee.role || "Employee");
  const [status, setStatus] = useState(employee.status || "פעיל");
  

  // Qualifications (init from props instead of fetching)
  const [stations, setStations] = useState(initialStations);
  const [stationAverages, setStationAverages] = useState(
    initialStationAverages
  );

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  // If parent props change (e.g., after refetch), sync once
  useEffect(() => {
    setStations(initialStations);
    setStationAverages(initialStationAverages);
  }, [initialStations, initialStationAverages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    setBusy(true);
    setMsg(null);

    try {
      // 1) Update profile
      const updatePayload = {
        first_name,
        last_name,
        email,
        phone,
        department,
        role,
        status,
      };
      await http.put(`/employees/${person_id}`, updatePayload);

      // 2) Upsert qualifications
      const qualOps = Object.entries(stationAverages).map(
        ([station_name, avg]) =>
          http.put(`/qualifications`, {
            person_id,
            station_name,
            avg: parseFloat(avg),
          })
      );
      await Promise.all(qualOps);

      setMsg({ type: "success", text: "עודכן בהצלחה" });
      onUpdateEmployee?.({
        ...employee,
        first_name,
        last_name,
        email,
        phone,
        department,
        role,
        status,
      });

      setTimeout(() => onClose?.(), 1200);
    } catch (error) {
      console.error("Error updating employee:", error);
      setMsg({
        type: "error",
        text: error?.response?.data?.message || "שגיאה בעדכון",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-lg flex flex-col max-h-[90vh]">
        <h2 className="text-xl sm:text-2xl font-bold p-6 pb-0">
          עריכת פרטי עובד
        </h2>

        <div className="overflow-y-auto flex-grow p-6 pt-4">
          {msg && (
            <div
              className={`mb-3 rounded px-3 py-2 text-sm ${
                msg.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {msg.text}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {/* person_id (read only) */}
            <label className="block">
              <span className="block mb-1 text-sm font-medium">person_id</span>
              <input
                className="w-full border p-2 rounded text-sm bg-gray-100"
                value={person_id}
                readOnly
              />
            </label>

            {/* username */}
            {/* Username removed: Employees do not have usernames */}

            <label className="block">
              <span className="block mb-1 text-sm font-medium">First name</span>
              <input
                className="w-full border p-2 rounded text-sm"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={!isAdmin}
              />
            </label>

            <label className="block">
              <span className="block mb-1 text-sm font-medium">Last name</span>
              <input
                className="w-full border p-2 rounded text-sm"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                disabled={!isAdmin}
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="block mb-1 text-sm font-medium">Email</span>
              <input
                type="email"
                className="w-full border p-2 rounded text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isAdmin}
              />
            </label>

            <label className="block">
              <span className="block mb-1 text-sm font-medium">Phone</span>
              <input
                className="w-full border p-2 rounded text-sm"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!isAdmin}
              />
            </label>

            <div>
              <span className="block mb-1 text-sm font-medium">מחלקה</span>
              <DepartmentDropdown
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2 text-sm"
                disabled={!isAdmin}
              />
            </div>

            <label className="block">
              <span className="block mb-1 text-sm font-medium">תפקיד</span>
              <input
                className="w-full border p-2 rounded text-sm"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={!isAdmin}
              />
            </label>

            <div>
              <span className="block mb-1 text-sm font-medium">סטטוס</span>
              <StatusDropdown
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 text-sm"
                disabled={!isAdmin}
              />
            </div>

            {/* Admin flag removed: Employees are not auth users */}

            {/* Qualifications editor (still editable for admins) */}
            <div className="sm:col-span-2">
              <StationSelector
                selectedStations={stations}
                onChange={setStations}
                onAverageChange={setStationAverages}
                initialAverages={stationAverages}
                disabled={!isAdmin}
              />
            </div>

            {/* Password fields removed: Employees do not have passwords */}
          </form>
        </div>

        <div className="p-6 pt-0 border-t">
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded text-sm font-medium hover:bg-gray-400 transition-colors"
            >
              ביטול
            </button>
            {isAdmin && (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded bg-[#1F6231] text-white text-sm font-medium hover:bg-[#309d49] transition-colors"
                disabled={busy}
              >
                {busy ? "מעדכן..." : "עדכן פרטים"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEmployeeForm;
