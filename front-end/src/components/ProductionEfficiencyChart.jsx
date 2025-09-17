import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import serverUrl from "@config/api";
import ErrorMessage, { useErrorHandler, getErrorInfo } from "./ErrorMessage";

const ProductionEfficiencyChart = () => {
  const { t } = useTranslation();
  const [efficiencyData, setEfficiencyData] = useState({
    todayEfficiency: 0,
    totalProduction: 0,
    validComponents: 0,
    defectiveComponents: 0,
  });
  const [loading, setLoading] = useState(true);
  const { error, errorType, clearError, setNetworkError, setServerError } =
    useErrorHandler();

  useEffect(() => {
    const fetchEfficiencyData = async () => {
      try {
        clearError();
        setLoading(true);

        // Fetch dashboard data and Shluker results
        const [dashboardResponse, shlukerResponse] = await Promise.all([
          fetch(`${serverUrl}/api/dashboard-data`),
          fetch(`${serverUrl}/api/shluker-results`),
        ]);

        if (!dashboardResponse.ok || !shlukerResponse.ok) {
          throw new Error(`HTTP error! status: ${dashboardResponse.status}`);
        }

        const dashboardData = await dashboardResponse.json();
        const shlukerData = await shlukerResponse.json();

        // Calculate efficiency metrics
        const totalComponents = shlukerData.proper + shlukerData.improper;
        const todayEfficiency =
          totalComponents > 0
            ? (shlukerData.proper / totalComponents) * 100
            : 0;

        setEfficiencyData({
          todayEfficiency: Math.round(todayEfficiency * 10) / 10,
          totalProduction: totalComponents,
          validComponents: shlukerData.proper,
          defectiveComponents: shlukerData.improper,
        });
      } catch (err) {
        const errorInfo = getErrorInfo(err);
        if (errorInfo.type === "network") {
          setNetworkError(errorInfo.message);
        } else if (errorInfo.type === "server") {
          setServerError(errorInfo.message);
        } else {
          setServerError(t("productionEfficiency.errorLoadingData"));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEfficiencyData();
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

  // Removed efficiency change calculation since we no longer have yesterday data

  return (
    <div className="theme-bg-secondary theme-shadow-md rounded-lg p-6 h-[22rem] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold theme-text-primary">
          {t("productionEfficiency.title")}
        </h3>
      </div>

      {/* Main Efficiency Display */}
      <div className="text-center mb-4">
        <div className="text-4xl font-bold theme-text-primary mb-2">
          {efficiencyData.todayEfficiency}%
        </div>
        <div className="text-sm theme-text-secondary">
          {t("productionEfficiency.todayEfficiency")}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${
            efficiencyData.todayEfficiency >= 90
              ? "bg-green-500"
              : efficiencyData.todayEfficiency >= 75
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
          style={{ width: `${Math.min(efficiencyData.todayEfficiency, 100)}%` }}
        ></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-semibold theme-text-primary">
            {efficiencyData.validComponents}
          </div>
          <div className="text-sm theme-text-secondary">
            {t("productionEfficiency.validComponents")}
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold theme-text-primary">
            {efficiencyData.defectiveComponents}
          </div>
          <div className="text-sm theme-text-secondary">
            {t("productionEfficiency.defectiveComponents")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionEfficiencyChart;
