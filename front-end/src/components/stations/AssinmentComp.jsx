// components/stations/AssignmentComp.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { CalendarIcon, Trash2, FileDown, Edit2, Check, X } from "lucide-react";
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

const WeeklyTable = ({
  employees,
  assignments,
  weekDates,
  isAdmin,
  editingCell,
  editingValue,
  availableStations,
  onCellEdit,
  onCellSave,
  onCellCancel,
  onValueChange,
  t,
}) => {
  const getAssignmentsForStationAndDate = (stationName, date) => {
    return assignments.filter(
      (a) =>
        a.workingStation_name === stationName &&
        new Date(a.date).toISOString().split("T")[0] === date
    );
  };

  const isEditing = (stationName, assignmentIndex, date) => {
    return (
      editingCell &&
      editingCell.stationName === stationName &&
      editingCell.assignmentIndex === assignmentIndex &&
      editingCell.date === date
    );
  };

  const renderCell = (station, date) => {
    const stationAssignments = getAssignmentsForStationAndDate(
      station.station_name,
      date
    );
    const employeesList = stationAssignments
      .map((assignment) => `${assignment.first_name} ${assignment.last_name}`)
      .join(", ");

    if (isEditing(station.station_name, 0, date)) {
      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <select
              value={editingValue}
              onChange={(e) => onValueChange(e.target.value)}
              className="flex-1 px-2 py-1 border rounded text-sm theme-bg-primary theme-text-primary"
              autoFocus
            >
              <option value="">{t("assignmentComp.selectEmployee")}</option>
              {employees.map((employee) => (
                <option
                  key={employee.person_id}
                  value={`${employee.first_name} ${employee.last_name}`}
                >
                  {`${employee.first_name} ${employee.last_name}`}
                </option>
              ))}
            </select>
            <button
              onClick={onCellSave}
              className="text-green-600 hover:text-green-800 p-1"
              title={t("assignmentComp.saveAssignment")}
            >
              <Check size={14} />
            </button>
            <button
              onClick={onCellCancel}
              className="text-red-600 hover:text-red-800 p-1"
              title={t("assignmentComp.cancelEdit")}
            >
              <X size={14} />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {stationAssignments.length > 0 ? (
            <div className="space-y-1">
              {stationAssignments.map((assignment, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-right theme-text-primary text-sm">
                    {`${assignment.first_name} ${assignment.last_name}`}
                  </span>
                  {isAdmin && (
                    <button
                      onClick={() =>
                        handleRemoveEmployee(
                          station.station_name,
                          date,
                          assignment.person_id
                        )
                      }
                      className="text-red-600 hover:text-red-800 ml-2 transition-colors duration-200"
                      title={t("assignmentComp.removeEmployee")}
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <span className="text-right theme-text-tertiary text-sm">
              {t("assignmentComp.noAssignments")}
            </span>
          )}
        </div>
        {isAdmin && (
          <button
            onClick={() =>
              onCellEdit(station.station_name, 0, date, employeesList)
            }
            className="text-blue-600 hover:text-blue-800 ml-2 transition-colors duration-200"
            title={t("assignmentComp.addEmployee")}
          >
            <Edit2 size={14} />
          </button>
        )}
      </div>
    );
  };

  return (
    <table className="w-full border-collapse min-w-[800px]">
      <thead>
        <tr className="theme-bg-tertiary">
          <th className="theme-border-primary border p-2 text-right theme-text-primary sticky left-0 bg-inherit">
            {t("assignmentComp.stationName")}
          </th>
          {weekDates.map((date, dayIndex) => (
            <th
              key={date}
              className="theme-border-primary border p-2 text-center theme-text-primary"
            >
              {new Date(date).toLocaleDateString("he-IL", {
                weekday: "short",
              })}
              <br />
              <span className="text-xs">
                {new Date(date).toLocaleDateString("he-IL", {
                  day: "2-digit",
                  month: "2-digit",
                })}
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {availableStations.map((station) => (
          <tr
            key={station._id}
            className="hover:theme-bg-tertiary transition-colors duration-200"
          >
            <td className="theme-border-primary border p-2 text-right theme-text-primary sticky left-0 bg-inherit font-medium">
              {station.station_name}
            </td>
            {weekDates.map((date) => (
              <td
                key={date}
                className="theme-border-primary border p-2 min-w-[200px]"
              >
                {renderCell(station, date)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
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

  const [viewMode, setViewMode] = useState("daily"); // "daily" or "weekly"
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedWeekStart, setSelectedWeekStart] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek + 1);
    return monday.toISOString().split("T")[0];
  });
  const [employees, setEmployees] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [assignmentMessage, setAssignmentMessage] = useState("");
  const [editingCell, setEditingCell] = useState(null); // { employeeId, assignmentIndex, date }
  const [editingValue, setEditingValue] = useState("");
  const [availableStations, setAvailableStations] = useState([]);

  const fetchEmployees = useCallback(async () => {
    const { data } = await http.get("/employees"); // if protected, token is sent
    setEmployees(data);
  }, []);

  const fetchStations = useCallback(async () => {
    const { data } = await http.get("/stations");
    setAvailableStations(data);
  }, []);

  const fetchAssignments = useCallback(async () => {
    if (viewMode === "daily") {
      const { data } = await http.get(`/assignments?date=${selectedDate}`);
      setAssignments(data);
    } else {
      const { data } = await http.get(
        `/assignments/weekly?weekStart=${selectedWeekStart}`
      );
      setAssignments(data);
    }
  }, [selectedDate, selectedWeekStart, viewMode]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await fetchEmployees();
        await fetchStations();
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
  }, [fetchEmployees, fetchStations, fetchAssignments]);

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

  const saveAssignmentToDB = async (employee, workingStation, date = null) => {
    const assignmentData = {
      date: date || selectedDate,
      workingStation_name: workingStation,
      person_id: employee.person_id,
      number_of_hours: 4,
    };
    // admin-only route on server
    await http.post("/assignments", assignmentData);
  };

  const handleCellEdit = (stationName, assignmentIndex, date, currentValue) => {
    if (!isAdmin) return;
    setEditingCell({ stationName, assignmentIndex, date });
    setEditingValue(currentValue || "");
  };

  const handleCellSave = async () => {
    if (!editingCell || !isAdmin) return;

    try {
      if (editingValue.trim()) {
        // Find employee by name
        const employee = employees.find(
          (e) => `${e.first_name} ${e.last_name}` === editingValue.trim()
        );
        if (!employee) throw new Error("Employee not found");

        await saveAssignmentToDB(
          employee,
          editingCell.stationName,
          editingCell.date
        );
        setAssignmentMessage(
          t("assignmentComp.assignmentAdded", {
            name: `${employee.first_name} ${employee.last_name}`,
          })
        );
      } else {
        // If empty value, delete the assignment
        const existingAssignments = assignments.filter(
          (a) =>
            a.workingStation_name === editingCell.stationName &&
            new Date(a.date).toISOString().split("T")[0] === editingCell.date
        );
        if (existingAssignments[editingCell.assignmentIndex]) {
          const assignmentToDelete =
            existingAssignments[editingCell.assignmentIndex];
          await http.delete("/assignments", {
            data: {
              date: editingCell.date,
              person_id: assignmentToDelete.person_id,
              assignmentNumber: editingCell.assignmentIndex + 1,
            },
          });
          setAssignmentMessage(
            t("assignmentComp.assignmentDeletedSuccessfully", {
              name: `${assignmentToDelete.first_name} ${assignmentToDelete.last_name}`,
            })
          );
        }
      }

      await fetchAssignments();
      setEditingCell(null);
      setEditingValue("");
    } catch (error) {
      setError(
        "Failed to save assignment: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setEditingValue("");
  };

  const handleRemoveEmployee = async (stationName, date, personId) => {
    if (!isAdmin) return;

    try {
      const existingAssignments = assignments.filter(
        (a) =>
          a.workingStation_name === stationName &&
          new Date(a.date).toISOString().split("T")[0] === date &&
          a.person_id === personId
      );

      if (existingAssignments.length > 0) {
        const assignmentToDelete = existingAssignments[0];
        await http.delete("/assignments", {
          data: {
            date: date,
            person_id: personId,
            assignmentNumber: 1, // Since we're removing the first occurrence
          },
        });

        const employee = employees.find((e) => e.person_id === personId);
        setAssignmentMessage(
          t("assignmentComp.assignmentDeletedSuccessfully", {
            name: `${employee?.first_name} ${employee?.last_name}`,
          })
        );

        await fetchAssignments();
      }
    } catch (error) {
      setError(
        "Failed to remove employee: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Helper functions for weekly view
  const getWeekDates = (weekStart) => {
    const start = new Date(weekStart);
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  };

  const getWeekDisplayString = (weekStart) => {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${start.toLocaleDateString("he-IL")} - ${end.toLocaleDateString(
      "he-IL"
    )}`;
  };

  const getAssignmentsForEmployeeAndDate = (employeeId, date) => {
    return assignments.filter(
      (a) =>
        a.person_id === employeeId &&
        new Date(a.date).toISOString().split("T")[0] === date
    );
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
    let rows;

    if (viewMode === "daily") {
      rows = [
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
    } else {
      const weekDates = getWeekDates(selectedWeekStart);
      const dayNames = weekDates.map((date) =>
        new Date(date).toLocaleDateString("he-IL", { weekday: "short" })
      );

      rows = [
        [t("assignmentComp.stationName"), ...dayNames],
        ...availableStations.map((station) => {
          const row = [station.station_name];
          weekDates.forEach((date) => {
            const stationAssignments = assignments.filter(
              (a) =>
                a.workingStation_name === station.station_name &&
                new Date(a.date).toISOString().split("T")[0] === date
            );
            // Join all employees for this day with commas
            const employeesForDay = stationAssignments
              .map(
                (assignment) =>
                  `${assignment.first_name} ${assignment.last_name}`
              )
              .join(", ");
            row.push(employeesForDay);
          });
          return row;
        }),
      ];
    }

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
    a.download =
      viewMode === "daily"
        ? `Assignments_${selectedDate}.csv`
        : `Assignments_Week_${selectedWeekStart}.csv`;
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

      {/* View Mode Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("daily")}
              className={`px-4 py-2 rounded font-medium transition-all duration-200 ${
                viewMode === "daily"
                  ? "theme-accent text-white"
                  : "theme-bg-secondary theme-text-primary hover:theme-bg-primary"
              }`}
            >
              {t("assignmentComp.dailyView")}
            </button>
            <button
              onClick={() => setViewMode("weekly")}
              className={`px-4 py-2 rounded font-medium transition-all duration-200 ${
                viewMode === "weekly"
                  ? "theme-accent text-white"
                  : "theme-bg-secondary theme-text-primary hover:theme-bg-primary"
              }`}
            >
              {t("assignmentComp.weeklyView")}
            </button>
          </div>

          {viewMode === "daily" ? (
            <DatePicker
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 theme-bg-secondary theme-border-primary border rounded-md p-2 theme-shadow-sm hover:border-[var(--accent-primary)] transition-colors duration-200">
              <div className="flex items-center gap-2">
                <CalendarIcon className="theme-text-tertiary" size={20} />
                <label
                  htmlFor="weekPicker"
                  className="theme-text-primary font-medium"
                >
                  {t("assignmentComp.selectWeek")}
                </label>
              </div>
              <input
                id="weekPicker"
                type="date"
                value={selectedWeekStart}
                onChange={(e) => setSelectedWeekStart(e.target.value)}
                className="outline-none border-none bg-transparent theme-text-primary font-semibold w-full sm:w-auto"
              />
            </div>
          )}
        </div>

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
          {viewMode === "daily"
            ? t("assignmentComp.assignmentForDate", {
                date: new Date(selectedDate).toLocaleDateString("he-IL"),
              })
            : t("assignmentComp.assignmentForWeek", {
                week: getWeekDisplayString(selectedWeekStart),
              })}
        </h2>

        {error && <Alert type="error">{error}</Alert>}
        {assignmentMessage && <Alert>{assignmentMessage}</Alert>}

        <div className="overflow-x-auto">
          {viewMode === "daily" ? (
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
                              {employeeAssignments[index]
                                ?.workingStation_name || ""}
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
          ) : (
            <WeeklyTable
              employees={employees}
              assignments={assignments}
              weekDates={getWeekDates(selectedWeekStart)}
              isAdmin={isAdmin}
              editingCell={editingCell}
              editingValue={editingValue}
              availableStations={availableStations}
              onCellEdit={handleCellEdit}
              onCellSave={handleCellSave}
              onCellCancel={handleCellCancel}
              onValueChange={setEditingValue}
              t={t}
            />
          )}
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
