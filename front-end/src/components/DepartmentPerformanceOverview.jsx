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
      <div className="theme-bg-secondary theme-shadow-md rounded-lg p-6 h-[22rem]">
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
      <div className="theme-bg-secondary theme-shadow-md rounded-lg p-6 h-[22rem]">
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
    <div className="theme-bg-secondary theme-shadow-md rounded-lg p-6 h-[22rem] flex flex-col">
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
          {/* Current Department Display - Horizontal Layout */}
          <div className="flex-1 flex flex-row items-center space-x-6">
            {/* Left Side - Efficiency Display */}
            <div className="flex-1 text-center">
              <div className="text-2xl font-semibold theme-text-primary mb-2">
                {currentDept.name}
              </div>
              <div className="text-sm theme-text-secondary mb-4">
                {currentDept.totalStations}{" "}
                {t("departmentPerformance.stations")} •{" "}
                {currentDept.totalEmployees}{" "}
                {t("departmentPerformance.employees")}
              </div>

              <div className="text-5xl font-bold theme-text-primary mb-2">
                {currentDept.efficiency}%
              </div>
              <div className="text-sm theme-text-secondary mb-4">
                Employee Activity Rate
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

              {/* Performance Indicator */}
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  currentDept.efficiency >= 90
                    ? "bg-green-100 text-green-800"
                    : currentDept.efficiency >= 75
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {currentDept.efficiency >= 90
                  ? "Excellent Performance"
                  : currentDept.efficiency >= 75
                  ? "Good Performance"
                  : "Needs Improvement"}
              </div>
            </div>

            {/* Right Side - Employee Status Cards */}
            <div className="flex-1 grid grid-cols-2 gap-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {currentDept.activeEmployees}
                </div>
                <div className="text-xs text-green-700 font-medium">
                  Active Employees
                </div>
                <div className="text-xs text-green-600">
                  {currentDept.totalEmployees > 0
                    ? Math.round(
                        (currentDept.activeEmployees /
                          currentDept.totalEmployees) *
                          100
                      )
                    : 0}
                  % of total
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                <div className="text-3xl font-bold text-red-600 mb-1">
                  {currentDept.totalEmployees - currentDept.activeEmployees}
                </div>
                <div className="text-xs text-red-700 font-medium">
                  Inactive Employees
                </div>
                <div className="text-xs text-red-600">
                  {currentDept.totalEmployees > 0
                    ? Math.round(
                        ((currentDept.totalEmployees -
                          currentDept.activeEmployees) /
                          currentDept.totalEmployees) *
                          100
                      )
                    : 0}
                  % of total
                </div>
              </div>
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
    </div>
  );
};

export default DepartmentPerformanceOverview;
