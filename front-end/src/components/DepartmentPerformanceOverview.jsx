import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import serverUrl from "@config/api";
import ErrorMessage, { useErrorHandler, getErrorInfo } from "./ErrorMessage";

const DepartmentPerformanceOverview = () => {
  const { t } = useTranslation();
  const [departmentData, setDepartmentData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { error, errorType, clearError, setNetworkError, setServerError } =
    useErrorHandler();

  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        clearError();
        setLoading(true);

        // Fetch employees and stations data
        const [employeesResponse, stationsResponse] = await Promise.all([
          fetch(`${serverUrl}/api/employees`),
          fetch(`${serverUrl}/api/stations`),
        ]);

        if (!employeesResponse.ok || !stationsResponse.ok) {
          throw new Error(`HTTP error! status: ${employeesResponse.status}`);
        }

        const employees = await employeesResponse.json();
        const stations = await stationsResponse.json();

        // Process department data
        const departmentStats = {};

        // Count employees by department
        employees.forEach((employee) => {
          const dept =
            employee.department || t("departmentPerformance.unknownDepartment");
          if (!departmentStats[dept]) {
            departmentStats[dept] = {
              name: dept,
              totalEmployees: 0,
              activeEmployees: 0,
              totalStations: 0,
              efficiency: 0,
            };
          }
          departmentStats[dept].totalEmployees++;
          if (employee.status === "פעיל") {
            departmentStats[dept].activeEmployees++;
          }
        });

        // Count stations by department
        stations.forEach((station) => {
          const dept =
            station.department || t("departmentPerformance.unknownDepartment");
          if (!departmentStats[dept]) {
            departmentStats[dept] = {
              name: dept,
              totalEmployees: 0,
              activeEmployees: 0,
              totalStations: 0,
              efficiency: 0,
            };
          }
          departmentStats[dept].totalStations++;
        });

        // Calculate efficiency (active employees / total employees * 100)
        const processedData = Object.values(departmentStats).map((dept) => ({
          ...dept,
          efficiency:
            dept.totalEmployees > 0
              ? Math.round(
                  (dept.activeEmployees / dept.totalEmployees) * 100 * 10
                ) / 10
              : 0,
        }));

        // Sort by efficiency descending
        processedData.sort((a, b) => b.efficiency - a.efficiency);

        setDepartmentData(processedData);
      } catch (err) {
        const errorInfo = getErrorInfo(err);
        if (errorInfo.type === "network") {
          setNetworkError(errorInfo.message);
        } else if (errorInfo.type === "server") {
          setServerError(errorInfo.message);
        } else {
          setServerError(t("departmentPerformance.errorLoadingData"));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentData();
  }, []);

  if (error) {
    return (
      <div className="theme-bg-secondary theme-shadow-md rounded-lg p-6 h-[28rem]">
        <ErrorMessage
          message={error}
          type={errorType}
          show={!!error}
          onClose={clearError}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="theme-bg-secondary theme-shadow-md rounded-lg p-6 h-[28rem]">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded mb-4"></div>
          <div className="h-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 90) return "text-green-600";
    if (efficiency >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getEfficiencyBgColor = (efficiency) => {
    if (efficiency >= 90) return "bg-green-100";
    if (efficiency >= 75) return "bg-yellow-100";
    return "bg-red-100";
  };

  const nextDepartment = () => {
    setCurrentIndex((prev) => (prev + 1) % departmentData.length);
  };

  const prevDepartment = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + departmentData.length) % departmentData.length
    );
  };

  const currentDept = departmentData[currentIndex];

  return (
    <div className="theme-bg-secondary theme-shadow-md rounded-lg p-6 h-[28rem] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold theme-text-primary">
          {t("departmentPerformance.title")}
        </h3>
        <div className="text-sm theme-text-secondary">
          {departmentData.length > 0 &&
            `${currentIndex + 1} / ${departmentData.length}`}
        </div>
      </div>

      {departmentData.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 text-4xl mb-2">📊</div>
            <div className="theme-text-secondary">
              {t("departmentPerformance.noData")}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Current Department Display */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold theme-text-primary mb-2">
                {currentDept.efficiency}%
              </div>
              <div className="text-lg font-semibold theme-text-primary mb-2">
                {currentDept.name}
              </div>
              <div className="text-sm theme-text-secondary">
                {currentDept.totalStations}{" "}
                {t("departmentPerformance.stations")} •{" "}
                {currentDept.totalEmployees}{" "}
                {t("departmentPerformance.employees")}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  currentDept.efficiency >= 90
                    ? "bg-green-500"
                    : currentDept.efficiency >= 75
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${Math.min(currentDept.efficiency, 100)}%` }}
              ></div>
            </div>

            {/* Employee Status */}
            <div className="flex justify-between text-sm theme-text-secondary mb-4">
              <span className="text-green-600">
                {currentDept.activeEmployees}{" "}
                {t("departmentPerformance.active")}
              </span>
              <span className="text-red-600">
                {currentDept.totalEmployees - currentDept.activeEmployees}{" "}
                {t("departmentPerformance.inactive")}
              </span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={prevDepartment}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              disabled={departmentData.length <= 1}
            >
              ←
            </button>

            {/* Dots Indicator */}
            <div className="flex space-x-2">
              {departmentData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-blue-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextDepartment}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              disabled={departmentData.length <= 1}
            >
              →
            </button>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {departmentData.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold theme-text-primary">
                {departmentData.length}
              </div>
              <div className="text-xs theme-text-secondary">
                {t("departmentPerformance.totalDepartments")}
              </div>
            </div>
            <div>
              <div className="text-lg font-bold theme-text-primary">
                {Math.round(
                  (departmentData.reduce(
                    (sum, dept) => sum + dept.efficiency,
                    0
                  ) /
                    departmentData.length) *
                    10
                ) / 10}
                %
              </div>
              <div className="text-xs theme-text-secondary">
                {t("departmentPerformance.averageEfficiency")}
              </div>
            </div>
            <div>
              <div className="text-lg font-bold theme-text-primary">
                {departmentData.reduce(
                  (sum, dept) => sum + dept.totalEmployees,
                  0
                )}
              </div>
              <div className="text-xs theme-text-secondary">
                {t("departmentPerformance.totalEmployees")}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentPerformanceOverview;
