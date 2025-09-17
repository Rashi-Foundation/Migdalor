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
      : type === "success"
      ? "bg-green-200 dark:bg-green-900/30"
      : "bg-green-200 dark:bg-green-900/30";
  const borderColor =
    type === "error"
      ? "border-red-500"
      : type === "success"
      ? "border-green-600"
      : "border-green-600";
  const textColor =
    type === "error"
      ? "text-red-900 dark:text-red-300"
      : type === "success"
      ? "text-green-900 dark:text-green-100"
      : "text-green-900 dark:text-green-100";
  return (
    <div
      className={`${bgColor} border-l-4 ${borderColor} ${textColor} p-4 mb-4 rounded-r-md shadow-sm transition-colors duration-300`}
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

// Multi-employee assignment component
const MultiEmployeeSelector = ({
  employees,
  selectedEmployees,
  onSelectionChange,
  maxSelections = 2,
  t,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleEmployeeToggle = (employee) => {
    const isSelected = selectedEmployees.some(
      (emp) => emp.person_id === employee.person_id
    );

    if (isSelected) {
      onSelectionChange(
        selectedEmployees.filter((emp) => emp.person_id !== employee.person_id)
      );
    } else if (selectedEmployees.length < maxSelections) {
      onSelectionChange([...selectedEmployees, employee]);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left theme-bg-secondary theme-border-primary border rounded-md hover:theme-bg-primary transition-colors duration-200 flex items-center justify-between"
      >
        <span className="text-sm theme-text-primary">
          {selectedEmployees.length > 0
            ? selectedEmployees
                .map((emp) => `${emp.first_name} ${emp.last_name}`)
                .join(", ")
            : t("assignmentComp.selectEmployees")}
        </span>
        <span className="text-xs theme-text-tertiary">
          {selectedEmployees.length}/{maxSelections}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 theme-bg-primary theme-border-primary border rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
          {employees.map((employee) => {
            const isSelected = selectedEmployees.some(
              (emp) => emp.person_id === employee.person_id
            );
            return (
              <button
                key={employee.person_id}
                onClick={() => handleEmployeeToggle(employee)}
                className={`w-full px-3 py-2 text-left text-sm hover:theme-bg-tertiary transition-colors duration-200 flex items-center justify-between ${
                  isSelected
                    ? "bg-blue-600 text-white dark:bg-blue-700"
                    : "theme-text-primary"
                }`}
              >
                <span>{`${employee.first_name} ${employee.last_name}`}</span>
                {isSelected && <Check size={14} />}
              </button>
            );
          })}
        </div>
      )}
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
  onMultiEmployeeAssign,
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

    if (isEditing(station.station_name, 0, date)) {
      return (
        <div className="space-y-2">
          <MultiEmployeeSelector
            employees={employees}
            selectedEmployees={editingValue || []}
            onSelectionChange={onValueChange}
            maxSelections={2}
            t={t}
          />
          <div className="flex gap-1">
            <button
              onClick={onCellSave}
              className="flex-1 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-1"
              title={t("assignmentComp.saveAssignment")}
            >
              <Check size={12} />
              {t("common.save")}
            </button>
            <button
              onClick={onCellCancel}
              className="flex-1 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-1"
              title={t("assignmentComp.cancelEdit")}
            >
              <X size={12} />
              {t("common.cancel")}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-[60px] flex flex-col justify-between">
        <div className="flex-1">
          {stationAssignments.length > 0 ? (
            <div className="space-y-1">
              {stationAssignments.map((assignment, index) => {
                const employee = employees.find(
                  (emp) => emp.person_id === assignment.person_id
                );
                const displayName = employee
                  ? `${employee.first_name} ${employee.last_name}`
                  : `${assignment.first_name || ""} ${
                      assignment.last_name || ""
                    }`.trim();

                return (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs border border-blue-200 dark:border-blue-700 group hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200"
                  >
                    <span className="font-medium flex-1 text-right">
                      {index + 1}.{" "}
                      {displayName || t("assignmentComp.unknownEmployee")}
                    </span>
                    {isAdmin && (
                      <button
                        onClick={() =>
                          onMultiEmployeeAssign?.(
                            station.station_name,
                            date,
                            assignment.person_id,
                            "remove"
                          )
                        }
                        className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 transition-all duration-200 flex-shrink-0"
                        title={t("assignmentComp.removeEmployee")}
                      >
                        <X size={10} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <span className="text-right theme-text-tertiary text-xs">
              {t("assignmentComp.noAssignments")}
            </span>
          )}
        </div>
        {isAdmin && (
          <button
            onClick={() =>
              onCellEdit(station.station_name, 0, date, stationAssignments)
            }
            className="mt-1 w-full px-2 py-1 text-blue-600 hover:text-blue-800 text-xs border border-blue-300 rounded hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center gap-1"
            title={t("assignmentComp.addEmployee")}
          >
            <Edit2 size={10} />
            {t("assignmentComp.assign")}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse min-w-[600px]">
        <thead>
          <tr className="theme-bg-tertiary">
            <th className="theme-border-primary border p-2 text-right theme-text-primary sticky left-0 bg-inherit z-10 min-w-[120px]">
              {t("assignmentComp.stationName")}
            </th>
            {weekDates.map((date, dayIndex) => (
              <th
                key={date}
                className="theme-border-primary border p-2 text-center theme-text-primary min-w-[100px]"
              >
                <div className="text-xs font-medium">
                  {new Date(date).toLocaleDateString("he-IL", {
                    weekday: "short",
                  })}
                </div>
                <div className="text-xs theme-text-tertiary">
                  {new Date(date).toLocaleDateString("he-IL", {
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </div>
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
              <td className="theme-border-primary border p-2 text-right theme-text-primary sticky left-0 bg-inherit font-medium z-10">
                <div className="text-sm font-medium">
                  {station.station_name}
                </div>
                <div className="text-xs theme-text-tertiary">
                  {station.department}
                </div>
              </td>
              {weekDates.map((date) => (
                <td
                  key={date}
                  className="theme-border-primary border p-2 align-top"
                >
                  {renderCell(station, date)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
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

  const [viewMode, setViewMode] = useState("daily"); // "daily" or "weekly"
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedWeekStart, setSelectedWeekStart] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - dayOfWeek); // Sunday is day 0
    return sunday.toISOString().split("T")[0];
  });
  const [employees, setEmployees] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [assignmentMessage, setAssignmentMessage] = useState("");
  const [editingCell, setEditingCell] = useState(null); // { employeeId, assignmentIndex, date }
  const [editingValue, setEditingValue] = useState("");
  const [availableStations, setAvailableStations] = useState([]);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedStationForForm, setSelectedStationForForm] = useState(null);

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
      // Close modal if it was opened from daily view
      if (showAssignmentModal) {
        setShowAssignmentModal(false);
        setSelectedStationForForm(null);
      }
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

  const handleCellEdit = (
    stationName,
    assignmentIndex,
    date,
    currentAssignments
  ) => {
    if (!isAdmin) return;
    setEditingCell({ stationName, assignmentIndex, date });
    // Convert current assignments to employee objects
    const currentEmployees = currentAssignments
      .map((assignment) =>
        employees.find((emp) => emp.person_id === assignment.person_id)
      )
      .filter(Boolean);
    setEditingValue(currentEmployees);
  };

  const handleCellSave = async () => {
    if (!editingCell || !isAdmin) return;

    try {
      if (editingValue && editingValue.length > 0) {
        // Get current assignments for this station and date
        const existingAssignments = assignments.filter(
          (a) =>
            a.workingStation_name === editingCell.stationName &&
            new Date(a.date).toISOString().split("T")[0] === editingCell.date
        );

        // Remove existing assignments
        for (const assignment of existingAssignments) {
          await http.delete("/assignments", {
            data: {
              date: editingCell.date,
              person_id: assignment.person_id,
              assignmentNumber: 1,
            },
          });
        }

        // Add new assignments
        for (const employee of editingValue) {
          await saveAssignmentToDB(
            employee,
            editingCell.stationName,
            editingCell.date
          );
        }

        const employeeNames = editingValue
          .map((emp) => `${emp.first_name} ${emp.last_name}`)
          .join(", ");
        setAssignmentMessage(
          t("assignmentComp.assignmentsUpdated", {
            names: employeeNames,
          })
        );
      } else {
        // If no employees selected, delete all assignments for this station and date
        const existingAssignments = assignments.filter(
          (a) =>
            a.workingStation_name === editingCell.stationName &&
            new Date(a.date).toISOString().split("T")[0] === editingCell.date
        );

        for (const assignment of existingAssignments) {
          await http.delete("/assignments", {
            data: {
              date: editingCell.date,
              person_id: assignment.person_id,
              assignmentNumber: 1,
            },
          });
        }

        setAssignmentMessage(t("assignmentComp.allAssignmentsRemoved"));
      }

      await fetchAssignments();
      setEditingCell(null);
      setEditingValue([]);
    } catch (error) {
      setError(
        "Failed to save assignment: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setEditingValue([]);
  };

  const handleMultiEmployeeAssign = async (
    stationName,
    date,
    personId,
    action
  ) => {
    if (!isAdmin) return;

    try {
      if (action === "remove") {
        await http.delete("/assignments", {
          data: {
            date: date,
            person_id: personId,
            assignmentNumber: 1,
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
        "Failed to update assignment: " +
          (error.response?.data?.message || error.message)
      );
    }
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
        {assignmentMessage && <Alert type="success">{assignmentMessage}</Alert>}

        <div className="overflow-x-auto">
          {viewMode === "daily" ? (
            <div className="grid gap-4">
              {availableStations.map((station) => {
                const stationAssignments = assignments.filter(
                  (a) => a.workingStation_name === station.station_name
                );
                return (
                  <div
                    key={station._id}
                    className="theme-bg-secondary theme-border-primary border rounded-lg p-4 hover:theme-bg-tertiary transition-colors duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold theme-text-primary mb-2">
                          {station.station_name}
                        </h3>
                        <div className="text-sm theme-text-tertiary mb-2">
                          {station.department} - {station.product_name}
                        </div>
                        <div className="mb-3">
                          {stationAssignments.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {stationAssignments.map((a, index) => {
                                // Find the employee in the employees list
                                const employee = employees.find(
                                  (emp) => emp.person_id === a.person_id
                                );
                                const displayName = employee
                                  ? `${employee.first_name} ${employee.last_name}`
                                  : `${a.first_name || ""} ${
                                      a.last_name || ""
                                    }`.trim() ||
                                    t("assignmentComp.unknownEmployee");

                                return (
                                  <div
                                    key={a.person_id || index}
                                    className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm border border-blue-200 dark:border-blue-700"
                                  >
                                    <span className="font-medium">
                                      {index + 1}. {displayName}
                                    </span>
                                    {isAdmin && (
                                      <button
                                        onClick={() =>
                                          handleMultiEmployeeAssign(
                                            station.station_name,
                                            selectedDate,
                                            a.person_id,
                                            "remove"
                                          )
                                        }
                                        className="text-red-600 hover:text-red-800 transition-colors duration-200 ml-1"
                                        title={t("common.remove")}
                                      >
                                        <X size={14} />
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-sm theme-text-tertiary italic">
                              {t("assignmentComp.noAssignments")}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        {isAdmin && (
                          <button
                            onClick={() => {
                              setSelectedStationForForm(station);
                              setShowAssignmentModal(true);
                            }}
                            className="px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 flex items-center gap-2 bg-green-600 text-white hover:bg-green-700"
                            title={t("assignmentComp.performAssignment")}
                          >
                            <Edit2 size={16} />
                            {t("assignmentComp.performAssignment")}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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
              onMultiEmployeeAssign={handleMultiEmployeeAssign}
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

      {/* Assignment modal for daily view */}
      {isAdmin && showAssignmentModal && selectedStationForForm && (
        <AddAssignmentForm
          onClose={() => {
            setShowAssignmentModal(false);
            setSelectedStationForForm(null);
          }}
          onSubmit={handleAssignmentSubmit}
          selectedStation={selectedStationForForm}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
};

export default AssignmentComp;
