import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import serverUrl from "@config/api";
import ErrorMessage, { useErrorHandler, getErrorInfo } from "./ErrorMessage";

const ProductionQualityDashboard = () => {
  const { t } = useTranslation();
  const [qualityData, setQualityData] = useState({
    qualityScore: 0,
    defectRate: 0,
    qualityTrend: [],
    topIssues: [],
    qualityGrade: "A",
    improvement: 0,
  });
  const [loading, setLoading] = useState(true);
  const { error, errorType, clearError, setNetworkError, setServerError } =
    useErrorHandler();

  useEffect(() => {
    const fetchQualityData = async () => {
      try {
        clearError();
        setLoading(true);

        // Fetch Shluker results and dashboard data
        const [shlukerResponse, dashboardResponse] = await Promise.all([
          fetch(`${serverUrl}/api/shluker-results`),
          fetch(`${serverUrl}/api/dashboard-data`),
        ]);

        if (!shlukerResponse.ok || !dashboardResponse.ok) {
          throw new Error(`HTTP error! status: ${shlukerResponse.status}`);
        }

        const shlukerData = await shlukerResponse.json();
        const dashboardData = await dashboardResponse.json();

        // Calculate quality metrics
        const totalComponents = shlukerData.proper + shlukerData.improper;
        const qualityScore =
          totalComponents > 0
            ? (shlukerData.proper / totalComponents) * 100
            : 0;
        const defectRate =
          totalComponents > 0
            ? (shlukerData.improper / totalComponents) * 100
            : 0;

        // Determine quality grade
        let qualityGrade = "A";
        if (qualityScore < 70) qualityGrade = "D";
        else if (qualityScore < 80) qualityGrade = "C";
        else if (qualityScore < 90) qualityGrade = "B";

        // Generate mock quality trend (last 7 days)
        const qualityTrend = Array.from({ length: 7 }, (_, i) => ({
          day: new Date(
            Date.now() - (6 - i) * 24 * 60 * 60 * 1000
          ).toLocaleDateString("en-US", { weekday: "short" }),
          score: Math.max(
            60,
            Math.min(100, qualityScore + (Math.random() - 0.5) * 20)
          ),
        }));

        // Generate mock top issues
        const topIssues = [
          {
            name: t("productionQuality.issues.dimensionError"),
            count: Math.floor(Math.random() * 10) + 1,
            severity: "high",
          },
          {
            name: t("productionQuality.issues.surfaceDefect"),
            count: Math.floor(Math.random() * 8) + 1,
            severity: "medium",
          },
          {
            name: t("productionQuality.issues.materialIssue"),
            count: Math.floor(Math.random() * 5) + 1,
            severity: "low",
          },
        ].sort((a, b) => b.count - a.count);

        // Calculate improvement (mock data)
        const improvement = (Math.random() - 0.5) * 10;

        setQualityData({
          qualityScore: Math.round(qualityScore * 10) / 10,
          defectRate: Math.round(defectRate * 10) / 10,
          qualityTrend,
          topIssues,
          qualityGrade,
          improvement: Math.round(improvement * 10) / 10,
        });
      } catch (err) {
        const errorInfo = getErrorInfo(err);
        if (errorInfo.type === "network") {
          setNetworkError(errorInfo.message);
        } else if (errorInfo.type === "server") {
          setServerError(errorInfo.message);
        } else {
          setServerError(t("productionQuality.errorLoadingData"));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQualityData();
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

  const getGradeColor = (grade) => {
    switch (grade) {
      case "A":
        return "text-green-600 bg-green-100";
      case "B":
        return "text-blue-600 bg-blue-100";
      case "C":
        return "text-yellow-600 bg-yellow-100";
      case "D":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="theme-bg-secondary theme-shadow-md rounded-lg p-6 h-[28rem] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold theme-text-primary">
          {t("productionQuality.title")}
        </h3>
        <div
          className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(
            qualityData.qualityGrade
          )}`}
        >
          {qualityData.qualityGrade}
        </div>
      </div>

      {/* Main Quality Score */}
      <div className="text-center mb-4">
        <div className="text-4xl font-bold theme-text-primary mb-1">
          {qualityData.qualityScore}%
        </div>
        <div className="text-sm theme-text-secondary">
          {t("productionQuality.qualityScore")}
        </div>
        <div
          className={`text-xs ${
            qualityData.improvement >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {qualityData.improvement >= 0 ? "↗" : "↘"}{" "}
          {Math.abs(qualityData.improvement)}%
        </div>
      </div>

      {/* Quality Trend Chart */}
      <div className="mb-4">
        <div className="text-sm font-semibold theme-text-primary mb-2">
          {t("productionQuality.weeklyTrend")}
        </div>
        <div className="flex items-end justify-between h-16">
          {qualityData.qualityTrend.map((day, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className="bg-blue-500 rounded-t w-4 transition-all duration-300"
                style={{ height: `${(day.score / 100) * 48}px` }}
              ></div>
              <div className="text-xs theme-text-secondary mt-1">{day.day}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Issues */}
      <div className="flex-1">
        <div className="text-sm font-semibold theme-text-primary mb-2">
          {t("productionQuality.topIssues")}
        </div>
        <div className="space-y-1">
          {qualityData.topIssues.slice(0, 2).map((issue, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-xs"
            >
              <span className="theme-text-primary truncate flex-1">
                {issue.name}
              </span>
              <span
                className={`font-semibold ${getSeverityColor(issue.severity)}`}
              >
                {issue.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quality Metrics */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold theme-text-primary">
              {qualityData.defectRate}%
            </div>
            <div className="text-xs theme-text-secondary">
              {t("productionQuality.defectRate")}
            </div>
          </div>
          <div>
            <div className="text-lg font-bold theme-text-primary">
              {qualityData.qualityGrade}
            </div>
            <div className="text-xs theme-text-secondary">
              {t("productionQuality.grade")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionQualityDashboard;
