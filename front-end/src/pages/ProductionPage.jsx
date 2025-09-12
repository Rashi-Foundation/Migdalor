import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Pie, Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
} from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import serverUrl from "@config/api";
import ErrorMessage, {
  useErrorHandler,
  getErrorInfo,
} from "@components/ErrorMessage";
import Navbar from "@components/Navbar";
import {
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title
);

const ProductionPage = () => {
  const { t } = useTranslation();
  const [dateFilter, setDateFilter] = useState("today"); // "today", "monthly", "custom"
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [productionData, setProductionData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { error, errorType, clearError, setNetworkError, setServerError } =
    useErrorHandler();

  // Calculate date ranges based on filter
  const dateRange = useMemo(() => {
    const now = new Date();
    switch (dateFilter) {
      case "today":
        const today = new Date(now);
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return { start: today, end: tomorrow };
      case "monthly":
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        monthStart.setHours(0, 0, 0, 0);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        monthEnd.setHours(0, 0, 0, 0);
        return { start: monthStart, end: monthEnd };
      case "custom":
        const customStart = new Date(startDate);
        customStart.setHours(0, 0, 0, 0);
        const customEnd = new Date(endDate);
        customEnd.setHours(23, 59, 59, 999);
        return { start: customStart, end: customEnd };
      default:
        return { start: now, end: now };
    }
  }, [dateFilter, startDate, endDate]);

  // Fetch production data
  useEffect(() => {
    const fetchProductionData = async () => {
      try {
        setLoading(true);
        clearError();

        const params = new URLSearchParams();
        params.append("startDate", dateRange.start.toISOString());
        params.append("endDate", dateRange.end.toISOString());

        console.log("Fetching production data with date range:", {
          start: dateRange.start.toISOString(),
          end: dateRange.end.toISOString(),
          filter: dateFilter,
        });

        const response = await axios.get(
          `${serverUrl}/api/report?${params.toString()}`
        );

        console.log("Received production data:", response.data);
        setProductionData(response.data);
      } catch (err) {
        console.error("Error fetching production data:", err);
        const errorInfo = getErrorInfo(err);

        if (errorInfo.type === "network") {
          setNetworkError(errorInfo.message);
        } else if (errorInfo.type === "server") {
          setServerError(errorInfo.message);
        } else {
          setServerError(t("production.errorLoadingData"));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProductionData();
  }, [dateRange, t]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!productionData) return null;

    let totalGood = 0;
    let totalInvalid = 0;
    let dailyData = [];

    if (Array.isArray(productionData)) {
      // Multiple days data
      productionData.forEach((day) => {
        totalGood += day.goodValves || 0;
        totalInvalid += day.invalidValves || 0;
        dailyData.push({
          date: day._id,
          good: day.goodValves || 0,
          invalid: day.invalidValves || 0,
          total: (day.goodValves || 0) + (day.invalidValves || 0),
        });
      });
    } else {
      // Single day data
      totalGood = productionData.goodValves || 0;
      totalInvalid = productionData.invalidValves || 0;
      dailyData = [
        {
          date: dateRange.start.toISOString().split("T")[0],
          good: totalGood,
          invalid: totalInvalid,
          total: totalGood + totalInvalid,
        },
      ];
    }

    const total = totalGood + totalInvalid;
    const qualityRate = total > 0 ? ((totalGood / total) * 100).toFixed(1) : 0;
    const defectRate =
      total > 0 ? ((totalInvalid / total) * 100).toFixed(1) : 0;

    return {
      totalGood,
      totalInvalid,
      total,
      qualityRate,
      defectRate,
      dailyData,
    };
  }, [productionData, dateRange]);

  // Chart configurations
  const pieChartData = {
    labels: [t("production.validValves"), t("production.defectiveValves")],
    datasets: [
      {
        data: [stats?.totalGood || 0, stats?.totalInvalid || 0],
        backgroundColor: ["#10B981", "#EF4444"],
        borderColor: ["#059669", "#DC2626"],
        borderWidth: 2,
      },
    ],
  };

  const barChartData = {
    labels:
      stats?.dailyData.map((day) => new Date(day.date).toLocaleDateString()) ||
      [],
    datasets: [
      {
        label: t("production.validValves"),
        data: stats?.dailyData.map((day) => day.good) || [],
        backgroundColor: "#10B981",
        borderColor: "#059669",
        borderWidth: 1,
      },
      {
        label: t("production.defectiveValves"),
        data: stats?.dailyData.map((day) => day.invalid) || [],
        backgroundColor: "#EF4444",
        borderColor: "#DC2626",
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels:
      stats?.dailyData.map((day) => new Date(day.date).toLocaleDateString()) ||
      [],
    datasets: [
      {
        label: t("production.qualityRate"),
        data:
          stats?.dailyData.map((day) =>
            day.total > 0 ? ((day.good / day.total) * 100).toFixed(1) : 0
          ) || [],
        borderColor: "#8B5CF6",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  // Export function
  const exportToCSV = () => {
    if (!stats?.dailyData) return;

    const dateRangeStr = (() => {
      switch (dateFilter) {
        case "today":
          return `today-${new Date().toISOString().split("T")[0]}`;
        case "monthly":
          const now = new Date();
          return `monthly-${now.getFullYear()}-${String(
            now.getMonth() + 1
          ).padStart(2, "0")}`;
        case "custom":
          return `custom-${startDate.toISOString().split("T")[0]}-to-${
            endDate.toISOString().split("T")[0]
          }`;
        default:
          return `data-${new Date().toISOString().split("T")[0]}`;
      }
    })();

    // Create a well-structured CSV with proper formatting
    const csvRows = [];

    // Header section
    csvRows.push("=".repeat(80));
    csvRows.push(`PRODUCTION DATA REPORT - ${dateRangeStr.toUpperCase()}`);
    csvRows.push("=".repeat(80));
    csvRows.push("");
    csvRows.push(`Report Generated: ${new Date().toLocaleString()}`);
    csvRows.push(
      `Date Range: ${dateRange.start.toLocaleDateString()} to ${dateRange.end.toLocaleDateString()}`
    );
    csvRows.push(`Total Records: ${stats.dailyData.length}`);
    csvRows.push(`${t("production.filterType")}: ${dateFilter.toUpperCase()}`);
    csvRows.push("");
    csvRows.push("-".repeat(80));
    csvRows.push("");

    // Data table header
    csvRows.push(
      [
        t("production.date"),
        t("production.validValves"),
        t("production.defectiveValves"),
        t("production.total"),
        t("production.qualityRate"),
      ].join(",")
    );

    // Data rows
    if (stats.dailyData.length > 0) {
      stats.dailyData.forEach((day) => {
        csvRows.push(
          [
            day.date,
            day.good,
            day.invalid,
            day.total,
            day.total > 0
              ? ((day.good / day.total) * 100).toFixed(1) + "%"
              : "0%",
          ].join(",")
        );
      });
    } else {
      csvRows.push(t("production.noDataAvailable"));
    }

    csvRows.push("");
    csvRows.push("-".repeat(80));
    csvRows.push("");

    // Summary section
    csvRows.push(t("production.summaryStatistics"));
    csvRows.push("-".repeat(20));
    csvRows.push(`${t("production.totalValidValves")},${stats.totalGood}`);
    csvRows.push(
      `${t("production.totalDefectiveValves")},${stats.totalInvalid}`
    );
    csvRows.push(`${t("production.overallQualityRate")},${stats.qualityRate}%`);
    csvRows.push(`${t("production.totalProduction")},${stats.total}`);
    csvRows.push("");

    // Footer
    csvRows.push("=".repeat(80));
    csvRows.push(t("production.endOfReport"));
    csvRows.push("=".repeat(80));

    const csvContent = csvRows.join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `production-report-${dateRangeStr}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="theme-bg-primary min-h-screen transition-colors duration-300">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 theme-accent mx-auto mb-4"></div>
            <p className="theme-text-primary">{t("common.loading")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="theme-bg-primary min-h-screen transition-colors duration-300">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-96">
          <ErrorMessage
            message={error}
            type={errorType}
            show={!!error}
            onClose={clearError}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="theme-bg-primary min-h-screen transition-colors duration-300">
      <Navbar />
      <div className="container mx-auto px-4 py-8" id="production-dashboard">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold theme-text-primary mb-4 flex items-center">
            <Activity className="mr-3" />
            {t("production.title")}
          </h1>

          {/* Date Filter Controls */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Calendar className="theme-text-primary" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 theme-border-primary border rounded theme-bg-secondary theme-text-primary"
              >
                <option value="today">{t("production.today")}</option>
                <option value="monthly">{t("production.thisMonth")}</option>
                <option value="custom">{t("production.customRange")}</option>
              </select>
            </div>

            {dateFilter === "custom" && (
              <div className="flex items-center space-x-2">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  className="px-3 py-2 theme-border-primary border rounded theme-bg-secondary theme-text-primary"
                  dateFormat="dd/MM/yyyy"
                />
                <span className="theme-text-primary">-</span>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  className="px-3 py-2 theme-border-primary border rounded theme-bg-secondary theme-text-primary"
                  dateFormat="dd/MM/yyyy"
                />
              </div>
            )}

            <div className="flex items-center space-x-2 ml-auto">
              <button
                onClick={exportToCSV}
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
              >
                <Download className="mr-2 h-4 w-4" />
                {t("production.exportCSV")}
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="theme-bg-secondary p-6 rounded-lg theme-shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm theme-text-tertiary">
                  {t("production.totalProduction")}
                </p>
                <p className="text-3xl font-bold theme-text-primary">
                  {stats?.total || 0}
                </p>
              </div>
              <Target className="h-8 w-8 theme-accent" />
            </div>
          </div>

          <div className="theme-bg-secondary p-6 rounded-lg theme-shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm theme-text-tertiary">
                  {t("production.validValves")}
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {stats?.totalGood || 0}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="theme-bg-secondary p-6 rounded-lg theme-shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm theme-text-tertiary">
                  {t("production.defectiveValves")}
                </p>
                <p className="text-3xl font-bold text-red-600">
                  {stats?.totalInvalid || 0}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="theme-bg-secondary p-6 rounded-lg theme-shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm theme-text-tertiary">
                  {t("production.qualityRate")}
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {stats?.qualityRate || 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Quality Distribution Pie Chart */}
          <div className="theme-bg-secondary p-6 rounded-lg theme-shadow-md">
            <h3 className="text-xl font-semibold theme-text-primary mb-4 flex items-center">
              <PieChart className="mr-2 h-5 w-5" />
              {t("production.qualityDistribution")}
            </h3>
            <div className="h-64">
              <Pie data={pieChartData} options={chartOptions} />
            </div>
          </div>

          {/* Daily Production Bar Chart */}
          <div className="theme-bg-secondary p-6 rounded-lg theme-shadow-md">
            <h3 className="text-xl font-semibold theme-text-primary mb-4 flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              {t("production.dailyProduction")}
            </h3>
            <div className="h-64">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Quality Trend Line Chart */}
        {stats?.dailyData.length > 1 && (
          <div className="theme-bg-secondary p-6 rounded-lg theme-shadow-md mb-8">
            <h3 className="text-xl font-semibold theme-text-primary mb-4 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              {t("production.qualityTrend")}
            </h3>
            <div className="h-64">
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </div>
        )}

        {/* Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="theme-bg-secondary p-6 rounded-lg theme-shadow-md text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {stats?.qualityRate || 0}%
            </div>
            <div className="theme-text-primary font-medium">
              {t("production.overallQuality")}
            </div>
            <div className="text-sm theme-text-tertiary mt-1">
              {t("production.qualityDescription")}
            </div>
          </div>

          <div className="theme-bg-secondary p-6 rounded-lg theme-shadow-md text-center">
            <div className="text-4xl font-bold text-red-600 mb-2">
              {stats?.defectRate || 0}%
            </div>
            <div className="theme-text-primary font-medium">
              {t("production.defectRate")}
            </div>
            <div className="text-sm theme-text-tertiary mt-1">
              {t("production.defectDescription")}
            </div>
          </div>

          <div className="theme-bg-secondary p-6 rounded-lg theme-shadow-md text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {stats?.dailyData?.length || 0}
            </div>
            <div className="theme-text-primary font-medium">
              {t("production.daysAnalyzed")}
            </div>
            <div className="text-sm theme-text-tertiary mt-1">
              {t("production.analysisPeriod")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionPage;
