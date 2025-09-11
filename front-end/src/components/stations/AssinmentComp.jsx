// components/stations/AssignmentComp.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { CalendarIcon, Trash2, FileDown } from "lucide-react";
import AddAssignmentForm from "./AddAssignmentForm";
import { http } from "../../api/http";
import { useMe } from "@hooks/useMe";

const Alert = ({ children, type = "info" }) => {
  const bgColor =
    type === "error"
      ? "bg-red-100 dark:bg-red-900/20"
      : "bg-yellow-100 dark:bg-yellow-900/20";
  const borderColor = type === "error" ? "border-red-500" : "border-yellow-500";
  const textColor =
    type === "error"
      ? "text-red-700 dark:text-red-300"
      : "text-yellow-700 dark:text-yellow-300";
  return (
    <div
      className={`${bgColor} border-l-4 ${borderColor} ${textColor} p-4 mb-4 transition-colors duration-300`}
      role="alert"
    >
      {children}
    </div>
  );
};

const DatePicker = ({ selectedDate, onDateChange }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 theme-bg-secondary theme-border-primary border rounded-md p-2 theme-shadow-sm hover:border-[var(--accent-primary)] transition-colors duration-200">
      <div className="flex items-center gap-2">
        <CalendarIcon className="theme-text-tertiary" size={20} />
        <label htmlFor="datePicker" className="theme-text-primary font-medium">
          {t("assignmentComp.selectDate")}
        </label>
      </div>
      <input
        id="datePicker"
        type="date"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
        className="outline-none border-none bg-transparent theme-text-primary font-semibold w-full sm:w-auto"
      />
    </div>
  );
};

/**
 * Props:
 *  - selectedStation
 *  - showForm
 *  - onCloseForm
 *  - isAdmin (optional) -> if not provided, inferred from useMe()
 */
const AssignmentComp = ({
  selectedStation,
  showForm,
  onCloseForm,
  isAdmin: isAdminProp,
}) => {
  const { t } = useTranslation();
  const { me } = useMe();
  const isAdmin = isAdminProp ?? !!me?.isAdmin;

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [employees, setEmployees] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [assignmentMessage, setAssignmentMessage] = useState("");

  const fetchEmployees = useCallback(async () => {
    const { data } = await http.get("/employees"); // if protected, token is sent
    setEmployees(data);
  }, []);

  const fetchAssignments = useCallback(async () => {
    const { data } = await http.get(`/assignments?date=${selectedDate}`);
    setAssignments(data);
  }, [selectedDate]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await fetchEmployees();
        await fetchAssignments();
      } catch (err) {
        setError(
          "Failed to fetch data: " +
            (err.response?.data?.message || err.message)
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [fetchEmployees, fetchAssignments]);

  const handleAssignmentSubmit = async (newAssignments) => {
    if (!isAdmin) {
      setError(t("assignmentComp.onlyAdminCanAssign"));
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      let message = "";

      for (const newAssignment of newAssignments) {
        const employee = employees.find(
          (e) => `${e.first_name} ${e.last_name}` === newAssignment.fullName
        );
        if (!employee) {
          message +=
            t("assignmentComp.employeeNotFound", {
              name: newAssignment.fullName,
            }) + " ";
          continue;
        }

        const existingAssignments = assignments.filter(
          (a) => a.person_id === employee.person_id
        );

        // We still only add up to 2 per your original logic
        if (existingAssignments.length <= 1) {
          await saveAssignmentToDB(employee, newAssignment.assignment1);
          message +=
            t("assignmentComp.assignmentAdded", {
              name: newAssignment.fullName,
            }) + " ";
        } else {
          message +=
            t("assignmentComp.alreadyHasTwoAssignments", {
              name: newAssignment.fullName,
            }) + " ";
        }
      }

      await fetchAssignments();
      setAssignmentMessage(
        message || t("assignmentComp.assignmentsAddedSuccessfully")
      );
    } catch (error) {
      setError(
        "Failed to submit assignments: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setIsLoading(false);
      onCloseForm?.();
    }
  };

  const saveAssignmentToDB = async (employee, workingStation) => {
    const assignmentData = {
      date: selectedDate,
      workingStation_name: workingStation,
      person_id: employee.person_id,
      number_of_hours: 4,
    };
    // admin-only route on server
    await http.post("/assignments", assignmentData);
  };

  const handleDeleteAssignment = async (fullName, assignmentIndex) => {
    if (!isAdmin) {
      setError(t("assignmentComp.onlyAdminCanDelete"));
      return;
    }
    try {
      const employee = employees.find(
        (e) => `${e.first_name} ${e.last_name}` === fullName
      );
      if (!employee) throw new Error("Employee not found");

      const resp = await http.delete("/assignments", {
        data: {
          date: selectedDate,
          person_id: employee.person_id,
          assignmentNumber: assignmentIndex + 1,
        },
      });

      if (resp.status === 200) {
        setAssignmentMessage(
          t("assignmentComp.assignmentDeletedSuccessfully", { name: fullName })
        );
        await fetchAssignments();
      } else {
        throw new Error("Failed to delete assignment");
      }
    } catch (error) {
      setError(
        "Failed to delete assignment: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const exportToCsv = () => {
    const rows = [
      [
        t("assignmentComp.fullName"),
        t("assignmentComp.assignment1"),
        t("assignmentComp.assignment2"),
      ],
      ...employees.map((employee) => {
        const employeeAssignments = assignments.filter(
          (a) => a.person_id === employee.person_id
        );
        return [
          `${employee.first_name} ${employee.last_name}`,
          employeeAssignments[0]?.workingStation_name || "",
          employeeAssignments[1]?.workingStation_name || "",
        ];
      }),
    ];

    // CSV escape
    const csv = rows
      .map((row) =>
        row
          .map((cell) => {
            const s = String(cell ?? "");
            return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
          })
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Assignments_${selectedDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  if (isLoading) return <div>{t("assignmentComp.loading")}</div>;

  return (
    <div className="p-4 sm:p-6 theme-bg-tertiary rounded-lg theme-shadow-md transition-colors duration-300">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 theme-text-primary">
        {t("assignmentComp.title")}
      </h1>

      {!isAdmin && <Alert>{t("assignmentComp.viewOnlyMode")}</Alert>}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <DatePicker
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
        <button
          onClick={exportToCsv}
          className="theme-accent theme-accent-hover text-white font-bold py-2 px-4 rounded inline-flex items-center transition-all duration-200 hover:scale-105"
        >
          <FileDown className="mr-2" />
          {t("assignmentComp.exportToExcel")}
        </button>
      </div>

      <div className="mt-4 sm:mt-6 theme-bg-secondary theme-border-primary border rounded-lg p-4 transition-colors duration-300">
        <h2 className="font-bold mb-4 text-lg sm:text-xl theme-text-primary">
          {t("assignmentComp.assignmentForDate", {
            date: new Date(selectedDate).toLocaleDateString("he-IL"),
          })}
        </h2>

        {error && <Alert type="error">{error}</Alert>}
        {assignmentMessage && <Alert>{assignmentMessage}</Alert>}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="theme-bg-tertiary">
                <th className="theme-border-primary border p-2 text-right theme-text-primary">
                  {t("assignmentComp.fullName")}
                </th>
                <th className="theme-border-primary border p-2 text-right theme-text-primary">
                  {t("assignmentComp.assignment1")}
                </th>
                <th className="theme-border-primary border p-2 text-right theme-text-primary">
                  {t("assignmentComp.assignment2")}
                </th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => {
                const employeeAssignments = assignments.filter(
                  (a) => a.person_id === employee.person_id
                );
                return (
                  <tr
                    key={employee.person_id}
                    className="hover:theme-bg-tertiary transition-colors duration-200"
                  >
                    <td className="theme-border-primary border p-2 text-right theme-text-primary">
                      {`${employee.first_name} ${employee.last_name}`}
                    </td>
                    {[0, 1].map((index) => (
                      <td
                        key={index}
                        className="theme-border-primary border p-2"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-right theme-text-primary">
                            {employeeAssignments[index]?.workingStation_name ||
                              ""}
                          </span>
                          {isAdmin && employeeAssignments[index] && (
                            <button
                              onClick={() =>
                                handleDeleteAssignment(
                                  `${employee.first_name} ${employee.last_name}`,
                                  index
                                )
                              }
                              className="text-red-600 hover:text-red-800 ml-2 transition-colors duration-200"
                              title={t("assignmentComp.deleteAssignment")}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add form only for admins */}
      {isAdmin && showForm && (
        <AddAssignmentForm
          onClose={onCloseForm}
          onSubmit={handleAssignmentSubmit}
          selectedStation={selectedStation}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
};

export default AssignmentComp;
