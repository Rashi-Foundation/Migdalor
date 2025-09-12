import React, { useState, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Bar, Line, Doughnut, Radar, PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
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
  FileText,
  BarChart3,
  PieChart,
  TrendingUp,
  Activity,
  Target,
  Clock,
  Users,
  Settings,
  RefreshCw,
  Sparkles,
  Zap,
  Award,
  Star,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ReportsPage = () => {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const reportRef = useRef(null);

  const { error, errorType, clearError, setNetworkError, setServerError } =
    useErrorHandler();

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [employeesRes, stationsRes] = await Promise.all([
          axios.get(`${serverUrl}/api/employees`),
          axios.get(`${serverUrl}/api/stations`),
        ]);
        setEmployees(employeesRes.data || []);
        setStations(stationsRes.data || []);
      } catch (err) {
        console.error("Error fetching initial data:", err);
      }
    };
    fetchInitialData();
  }, []);

  // Generate report
  const generateReport = async () => {
    try {
      setLoading(true);
      clearError();

      const params = new URLSearchParams();
      params.append("startDate", startDate.toISOString());
      params.append("endDate", endDate.toISOString());

      if (selectedEmployee) {
        params.append(
          "employee",
          selectedEmployee.person_id || selectedEmployee._id
        );
      }
      if (selectedStation) {
        params.append(
          "stationId",
          selectedStation.station_id || selectedStation._id
        );
      }

      const response = await axios.get(
        `${serverUrl}/api/report?${params.toString()}`
      );
      setReportData(response.data);
    } catch (err) {
      console.error("Error generating report:", err);
      const errorInfo = getErrorInfo(err);

      if (errorInfo.type === "network") {
        setNetworkError(errorInfo.message);
      } else if (errorInfo.type === "server") {
        setServerError(errorInfo.message);
      } else {
        setServerError(t("reports.errorGeneratingReport"));
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    if (!reportData) return null;

    let totalGood = 0;
    let totalInvalid = 0;
    let dailyData = [];

    if (Array.isArray(reportData)) {
      reportData.forEach((day) => {
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
      totalGood = reportData.goodValves || 0;
      totalInvalid = reportData.invalidValves || 0;
      dailyData = [
        {
          date: startDate.toISOString().split("T")[0],
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
  }, [reportData, startDate]);

  // Chart configurations
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: "bold",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  };

  // Creative chart data
  const qualityDistributionData = {
    labels: [t("reports.validValves"), t("reports.defectiveValves")],
    datasets: [
      {
        data: [stats?.totalGood || 0, stats?.totalInvalid || 0],
        backgroundColor: ["rgba(34, 197, 94, 0.8)", "rgba(239, 68, 68, 0.8)"],
        borderColor: ["rgba(34, 197, 94, 1)", "rgba(239, 68, 68, 1)"],
        borderWidth: 3,
        hoverOffset: 10,
      },
    ],
  };

  const productionTrendData = {
    labels:
      stats?.dailyData.map((day) => new Date(day.date).toLocaleDateString()) ||
      [],
    datasets: [
      {
        label: t("reports.validValves"),
        data: stats?.dailyData.map((day) => day.good) || [],
        borderColor: "rgba(34, 197, 94, 1)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgba(34, 197, 94, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: t("reports.defectiveValves"),
        data: stats?.dailyData.map((day) => day.invalid) || [],
        borderColor: "rgba(239, 68, 68, 1)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgba(239, 68, 68, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const qualityRadarData = {
    labels: [
      t("reports.qualityRate"),
      t("reports.efficiency"),
      t("reports.consistency"),
      t("reports.reliability"),
      t("reports.performance"),
    ],
    datasets: [
      {
        label: t("reports.qualityMetrics"),
        data: [
          parseFloat(stats?.qualityRate || 0),
          parseFloat(stats?.qualityRate || 0) * 0.9,
          parseFloat(stats?.qualityRate || 0) * 1.1,
          parseFloat(stats?.qualityRate || 0) * 0.95,
          parseFloat(stats?.qualityRate || 0) * 1.05,
        ],
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 3,
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const performancePolarData = {
    labels: [
      t("reports.monday"),
      t("reports.tuesday"),
      t("reports.wednesday"),
      t("reports.thursday"),
      t("reports.friday"),
      t("reports.saturday"),
      t("reports.sunday"),
    ],
    datasets: [
      {
        data: stats?.dailyData.map((day) => day.total) || [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 205, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(199, 199, 199, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 205, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(199, 199, 199, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  // Export to PDF with charts
  const exportToPDF = async () => {
    if (!reportData) {
      alert("No report data to export. Please generate a report first.");
      return;
    }

    setExporting(true);
    try {
      const element = reportRef.current;
      if (!element) {
        console.error("Report element not found");
        alert("Error: Report element not found");
        return;
      }

      console.log("Starting PDF export...");

      // Wait a bit for charts to render
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Try html2canvas first
      let canvas;
      try {
        canvas = await html2canvas(element, {
          scale: 1.5,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: true,
          width: element.scrollWidth,
          height: element.scrollHeight,
          scrollX: 0,
          scrollY: 0,
        });
        console.log(
          "Canvas created with html2canvas:",
          canvas.width,
          "x",
          canvas.height
        );
      } catch (html2canvasError) {
        console.warn(
          "html2canvas failed, trying alternative method:",
          html2canvasError
        );

        // Fallback: create a PDF with text data and charts
        const pdf = new jsPDF("p", "mm", "a4");

        // Add title
        pdf.setFontSize(20);
        pdf.text("Production Report", 20, 20);

        // Add date
        pdf.setFontSize(12);
        pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30);

        // Add summary data
        let yPosition = 50;
        pdf.setFontSize(14);
        pdf.text("Summary Statistics:", 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(12);
        pdf.text(`Total Production: ${stats?.total || 0}`, 20, yPosition);
        yPosition += 8;
        pdf.text(`Valid Valves: ${stats?.totalGood || 0}`, 20, yPosition);
        yPosition += 8;
        pdf.text(
          `Defective Valves: ${stats?.totalInvalid || 0}`,
          20,
          yPosition
        );
        yPosition += 8;
        pdf.text(`Quality Rate: ${stats?.qualityRate || 0}%`, 20, yPosition);
        yPosition += 8;
        pdf.text(
          `Days Analyzed: ${stats?.dailyData?.length || 0}`,
          20,
          yPosition
        );

        // Try to add charts
        try {
          // Add charts section
          yPosition += 20;
          pdf.setFontSize(16);
          pdf.text("Charts and Visualizations", 20, yPosition);
          yPosition += 15;

          // Try to capture individual chart elements
          const chartElements = element.querySelectorAll(
            ".chart-container, canvas"
          );

          for (let i = 0; i < chartElements.length; i++) {
            const chartElement = chartElements[i];

            try {
              // Wait a bit for chart to render
              await new Promise((resolve) => setTimeout(resolve, 500));

              const chartCanvas = await html2canvas(chartElement, {
                scale: 1,
                useCORS: true,
                allowTaint: true,
                backgroundColor: "#ffffff",
                logging: false,
                width: chartElement.scrollWidth,
                height: chartElement.scrollHeight,
              });

              // Check if we need a new page
              const chartHeight =
                (chartCanvas.height * 170) / chartCanvas.width;
              if (yPosition + chartHeight > 250) {
                pdf.addPage();
                yPosition = 20;
              }

              // Add chart to PDF
              const chartImgData = chartCanvas.toDataURL("image/png", 1.0);
              pdf.addImage(
                chartImgData,
                "PNG",
                20,
                yPosition,
                170,
                chartHeight
              );
              yPosition += chartHeight + 10;

              console.log(`Chart ${i + 1} added to PDF`);
            } catch (chartError) {
              console.warn(`Failed to capture chart ${i + 1}:`, chartError);
              // Continue with next chart
            }
          }
        } catch (chartsError) {
          console.warn("Failed to add charts to PDF:", chartsError);
        }

        // Add daily data table
        if (stats?.dailyData && stats.dailyData.length > 0) {
          // Check if we need a new page for the table
          if (yPosition > 200) {
            pdf.addPage();
            yPosition = 20;
          }

          yPosition += 10;
          pdf.setFontSize(14);
          pdf.text("Daily Production Data:", 20, yPosition);
          yPosition += 10;

          pdf.setFontSize(10);
          pdf.text("Date", 20, yPosition);
          pdf.text("Valid", 60, yPosition);
          pdf.text("Defective", 80, yPosition);
          pdf.text("Total", 100, yPosition);
          pdf.text("Quality %", 120, yPosition);
          yPosition += 5;

          stats.dailyData.forEach((day) => {
            if (yPosition > 280) {
              pdf.addPage();
              yPosition = 20;
            }

            const qualityRate =
              day.total > 0 ? ((day.good / day.total) * 100).toFixed(1) : 0;
            pdf.text(day.date, 20, yPosition);
            pdf.text(day.good.toString(), 60, yPosition);
            pdf.text(day.invalid.toString(), 80, yPosition);
            pdf.text(day.total.toString(), 100, yPosition);
            pdf.text(`${qualityRate}%`, 120, yPosition);
            yPosition += 5;
          });
        }

        const fileName = `production-report-${
          new Date().toISOString().split("T")[0]
        }.pdf`;
        pdf.save(fileName);
        console.log("PDF saved successfully (fallback method)");
        return;
      }

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      console.log("Image dimensions:", imgWidth, "x", imgHeight);

      // Add image to PDF
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      // Add title to PDF
      pdf.setFontSize(20);
      pdf.text("Production Report", 20, 20);

      const fileName = `production-report-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      console.log("Saving PDF:", fileName);

      pdf.save(fileName);
      console.log("PDF saved successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(`Error generating PDF: ${error.message}`);
    } finally {
      setExporting(false);
    }
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold theme-text-primary mb-2 flex items-center">
                <Sparkles className="mr-3 text-yellow-500" />
                {t("reports.title")}
              </h1>
              <p className="text-lg theme-text-secondary">
                {t("reports.subtitle")}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={exportToPDF}
                disabled={exporting || !reportData}
                className={`flex items-center px-4 py-2 text-white rounded-lg transition-colors ${
                  exporting
                    ? "bg-gray-500 cursor-not-allowed"
                    : reportData
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                <Download
                  className={`mr-2 h-4 w-4 ${exporting ? "animate-spin" : ""}`}
                />
                {exporting ? t("reports.exporting") : t("reports.exportPDF")}
              </button>
            </div>
          </div>

          {/* Report Controls */}
          <div className="theme-bg-secondary p-6 rounded-xl theme-shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold theme-text-primary mb-2">
                  <Users className="inline mr-2 h-4 w-4" />
                  {t("reports.selectEmployee")}
                </label>
                <select
                  value={selectedEmployee?._id || ""}
                  onChange={(e) =>
                    setSelectedEmployee(
                      employees.find((emp) => emp._id === e.target.value) ||
                        null
                    )
                  }
                  className="w-full p-3 theme-border-primary border rounded-lg theme-bg-primary theme-text-primary transition-colors"
                >
                  <option value="">{t("reports.allEmployees")}</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.first_name} {emp.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold theme-text-primary mb-2">
                  <Settings className="inline mr-2 h-4 w-4" />
                  {t("reports.selectStation")}
                </label>
                <select
                  value={selectedStation?._id || ""}
                  onChange={(e) =>
                    setSelectedStation(
                      stations.find(
                        (station) => station._id === e.target.value
                      ) || null
                    )
                  }
                  className="w-full p-3 theme-border-primary border rounded-lg theme-bg-primary theme-text-primary transition-colors"
                >
                  <option value="">{t("reports.allStations")}</option>
                  {stations.map((station) => (
                    <option key={station._id} value={station._id}>
                      {station.station_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold theme-text-primary mb-2">
                  <Calendar className="inline mr-2 h-4 w-4" />
                  {t("reports.startDate")}
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className="w-full p-3 theme-border-primary border rounded-lg theme-bg-primary theme-text-primary"
                  dateFormat="dd/MM/yyyy"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold theme-text-primary mb-2">
                  <Calendar className="inline mr-2 h-4 w-4" />
                  {t("reports.endDate")}
                </label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  className="w-full p-3 theme-border-primary border rounded-lg theme-bg-primary theme-text-primary"
                  dateFormat="dd/MM/yyyy"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={generateReport}
                  disabled={loading}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  {loading
                    ? t("reports.generating")
                    : t("reports.generateReport")}
                </button>
                <button
                  onClick={() => {
                    setSelectedEmployee(null);
                    setSelectedStation(null);
                    setStartDate(new Date());
                    setEndDate(new Date());
                    setReportData(null);
                  }}
                  className="flex items-center px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {t("reports.reset")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Report Content */}
        {reportData && (
          <div ref={reportRef} className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="theme-bg-secondary p-6 rounded-xl theme-shadow-lg border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm theme-text-tertiary font-medium">
                      {t("reports.totalProduction")}
                    </p>
                    <p className="text-3xl font-bold theme-text-primary">
                      {stats?.total || 0}
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-green-500" />
                </div>
              </div>

              <div className="theme-bg-secondary p-6 rounded-xl theme-shadow-lg border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm theme-text-tertiary font-medium">
                      {t("reports.validValves")}
                    </p>
                    <p className="text-3xl font-bold text-blue-600">
                      {stats?.totalGood || 0}
                    </p>
                  </div>
                  <Award className="h-8 w-8 text-blue-500" />
                </div>
              </div>

              <div className="theme-bg-secondary p-6 rounded-xl theme-shadow-lg border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm theme-text-tertiary font-medium">
                      {t("reports.defectiveValves")}
                    </p>
                    <p className="text-3xl font-bold text-red-600">
                      {stats?.totalInvalid || 0}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-red-500" />
                </div>
              </div>

              <div className="theme-bg-secondary p-6 rounded-xl theme-shadow-lg border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm theme-text-tertiary font-medium">
                      {t("reports.qualityRate")}
                    </p>
                    <p className="text-3xl font-bold text-purple-600">
                      {stats?.qualityRate || 0}%
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-purple-500" />
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Quality Distribution */}
              <div className="theme-bg-secondary p-6 rounded-xl theme-shadow-lg">
                <h3 className="text-xl font-semibold theme-text-primary mb-4 flex items-center">
                  <PieChart className="mr-2 h-5 w-5 text-green-500" />
                  {t("reports.qualityDistribution")}
                </h3>
                <div className="h-80 chart-container">
                  <Doughnut
                    data={qualityDistributionData}
                    options={chartOptions}
                  />
                </div>
              </div>

              {/* Production Trend */}
              <div className="theme-bg-secondary p-6 rounded-xl theme-shadow-lg">
                <h3 className="text-xl font-semibold theme-text-primary mb-4 flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-blue-500" />
                  {t("reports.productionTrend")}
                </h3>
                <div className="h-80 chart-container">
                  <Line data={productionTrendData} options={chartOptions} />
                </div>
              </div>

              {/* Quality Radar */}
              <div className="theme-bg-secondary p-6 rounded-xl theme-shadow-lg">
                <h3 className="text-xl font-semibold theme-text-primary mb-4 flex items-center">
                  <Target className="mr-2 h-5 w-5 text-purple-500" />
                  {t("reports.qualityMetrics")}
                </h3>
                <div className="h-80 chart-container">
                  <Radar data={qualityRadarData} options={chartOptions} />
                </div>
              </div>

              {/* Weekly Performance */}
              <div className="theme-bg-secondary p-6 rounded-xl theme-shadow-lg">
                <h3 className="text-xl font-semibold theme-text-primary mb-4 flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-orange-500" />
                  {t("reports.weeklyPerformance")}
                </h3>
                <div className="h-80 chart-container">
                  <PolarArea
                    data={performancePolarData}
                    options={chartOptions}
                  />
                </div>
              </div>
            </div>

            {/* Summary Section */}
            <div className="theme-bg-secondary p-8 rounded-xl theme-shadow-lg">
              <h3 className="text-2xl font-bold theme-text-primary mb-6 flex items-center">
                <FileText className="mr-3 h-6 w-6 text-indigo-500" />
                {t("reports.reportSummary")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {stats?.qualityRate || 0}%
                  </div>
                  <div className="theme-text-primary font-medium">
                    {t("reports.overallQuality")}
                  </div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {stats?.dailyData?.length || 0}
                  </div>
                  <div className="theme-text-primary font-medium">
                    {t("reports.daysAnalyzed")}
                  </div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    {stats?.total || 0}
                  </div>
                  <div className="theme-text-primary font-medium">
                    {t("reports.totalUnits")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!reportData && !loading && (
          <div className="text-center py-16">
            <div className="theme-bg-secondary p-8 rounded-xl theme-shadow-lg max-w-md mx-auto">
              <BarChart3 className="h-16 w-16 theme-text-tertiary mx-auto mb-4" />
              <h3 className="text-xl font-semibold theme-text-primary">
                {t("reports.noDataTitle")}
              </h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
