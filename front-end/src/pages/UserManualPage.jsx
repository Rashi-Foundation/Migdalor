import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Navbar from "@components/Navbar";
import {
  Download,
  BookOpen,
  Users,
  Settings,
  BarChart3,
  Activity,
  FileText,
  Home,
  Calendar,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Info,
  ArrowRight,
  ArrowDown,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Shield,
  Zap,
  Target,
  TrendingUp,
  Clock,
  Award,
  Star,
  RefreshCw,
  Filter,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const UserManualPage = () => {
  const { t } = useTranslation();
  const [exporting, setExporting] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const manualRef = useRef(null);

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const exportToPDF = async () => {
    setExporting(true);
    try {
      const element = manualRef.current;
      if (!element) {
        console.error("Manual element not found");
        alert("Error: Manual element not found");
        return;
      }

      console.log("Starting PDF export...");

      // Wait a bit for content to render
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
          "html2canvas failed, using fallback method:",
          html2canvasError
        );

        // Fallback: create a PDF with text content
        const pdf = new jsPDF("p", "mm", "a4");

        // Add title
        pdf.setFontSize(24);
        pdf.text("Migdalor User Manual", 20, 20);

        // Add subtitle
        pdf.setFontSize(16);
        pdf.text(
          "Complete Guide to Using the Production Management System",
          20,
          30
        );

        // Add generation date
        pdf.setFontSize(12);
        pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 40);

        // Add content sections
        let yPosition = 60;
        const addSection = (title, content) => {
          if (yPosition > 250) {
            pdf.addPage();
            yPosition = 20;
          }

          pdf.setFontSize(16);
          pdf.text(title, 20, yPosition);
          yPosition += 10;

          pdf.setFontSize(12);
          const lines = pdf.splitTextToSize(content, 170);
          pdf.text(lines, 20, yPosition);
          yPosition += lines.length * 5 + 10;
        };

        addSection(
          "1. Getting Started",
          "Welcome to Migdalor, your comprehensive production management system. This manual will guide you through all features and functionalities."
        );
        addSection(
          "2. Login Process",
          "Access the system using your username and password. Contact your administrator if you need credentials."
        );
        addSection(
          "3. Dashboard Overview",
          "The home page provides an overview of production metrics, employee status, and key performance indicators."
        );
        addSection(
          "4. Employee Management",
          "Add, edit, and manage employee information, qualifications, and status."
        );
        addSection(
          "5. Station Management",
          "Assign employees to stations and manage production workflows."
        );
        addSection(
          "6. Production Tracking",
          "Monitor production metrics, quality rates, and performance trends."
        );
        addSection(
          "7. Reports Generation",
          "Generate comprehensive reports with visualizations and export options."
        );
        addSection(
          "8. Settings & Configuration",
          "Manage user accounts, preferences, and system settings."
        );

        const fileName = `migdalor-user-manual-${
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

      const fileName = `migdalor-user-manual-${
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

  const sections = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <BookOpen className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">
              Welcome to Migdalor
            </h4>
            <p className="text-blue-700">
              Migdalor is a comprehensive production management system designed
              to help you track, manage, and optimize your manufacturing
              operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h5 className="font-semibold text-green-800 mb-2">
                Key Features
              </h5>
              <ul className="text-green-700 space-y-1">
                <li>• Real-time production tracking</li>
                <li>• Employee management</li>
                <li>• Station assignments</li>
                <li>• Quality monitoring</li>
                <li>• Comprehensive reporting</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h5 className="font-semibold text-purple-800 mb-2">
                System Requirements
              </h5>
              <ul className="text-purple-700 space-y-1">
                <li>• Modern web browser</li>
                <li>• Internet connection</li>
                <li>• JavaScript enabled</li>
                <li>• Screen resolution: 1024x768+</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "login-process",
      title: "Login Process",
      icon: <Shield className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">
              Accessing the System
            </h4>
            <p className="text-yellow-700">
              To access Migdalor, you need valid login credentials provided by
              your system administrator.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <h5 className="font-semibold">Navigate to Login Page</h5>
                <p className="text-gray-600">
                  Open your web browser and go to the Migdalor login page
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <h5 className="font-semibold">Enter Credentials</h5>
                <p className="text-gray-600">
                  Enter your username and password in the provided fields
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <h5 className="font-semibold">Click Login</h5>
                <p className="text-gray-600">
                  Click the "Login" button to access the system
                </p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <h5 className="font-semibold text-red-800 mb-2">Troubleshooting</h5>
            <ul className="text-red-700 space-y-1">
              <li>• If login fails, check your credentials</li>
              <li>• Contact your administrator for password reset</li>
              <li>• Ensure your account is active</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "dashboard-overview",
      title: "Dashboard Overview",
      icon: <Home className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">
              Home Dashboard
            </h4>
            <p className="text-green-700">
              The dashboard provides a comprehensive overview of your production
              system with real-time metrics and key performance indicators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h5 className="font-semibold flex items-center">
                <Activity className="h-4 w-4 mr-2 text-blue-500" />
                Key Metrics
              </h5>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Active Workers Count
                </li>
                <li className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                  Inactive Workers Count
                </li>
                <li className="flex items-center">
                  <Target className="h-4 w-4 text-purple-500 mr-2" />
                  Daily Defects
                </li>
                <li className="flex items-center">
                  <Settings className="h-4 w-4 text-orange-500 mr-2" />
                  Inactive Stations
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h5 className="font-semibold flex items-center">
                <BarChart3 className="h-4 w-4 mr-2 text-blue-500" />
                Charts & Visualizations
              </h5>
              <ul className="space-y-2 text-sm">
                <li>• Production Efficiency Chart</li>
                <li>• Department Performance Overview</li>
                <li>• Production Quality Dashboard</li>
                <li>• Real-time Updates Cards</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "employee-management",
      title: "Employee Management",
      icon: <Users className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">
              Managing Employees
            </h4>
            <p className="text-blue-700">
              The employee management section allows you to add, edit, and
              manage employee information, qualifications, and status.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="font-semibold flex items-center mb-2">
                <Plus className="h-4 w-4 mr-2 text-green-500" />
                Adding New Employees
              </h5>
              <div className="bg-gray-50 p-3 rounded-lg">
                <ol className="space-y-2 text-sm">
                  <li>1. Navigate to the Employees page</li>
                  <li>2. Click "Add Employee" button</li>
                  <li>
                    3. Fill in personal information (name, ID, contact details)
                  </li>
                  <li>4. Select department and position</li>
                  <li>5. Add qualifications if applicable</li>
                  <li>6. Set employee status (Active/Inactive)</li>
                  <li>7. Click "Save" to create the employee record</li>
                </ol>
              </div>
            </div>

            <div>
              <h5 className="font-semibold flex items-center mb-2">
                <Edit className="h-4 w-4 mr-2 text-blue-500" />
                Editing Employee Information
              </h5>
              <div className="bg-gray-50 p-3 rounded-lg">
                <ol className="space-y-2 text-sm">
                  <li>1. Find the employee in the employee list</li>
                  <li>2. Click the "Edit" button next to their name</li>
                  <li>3. Modify the required information</li>
                  <li>4. Click "Save" to update the record</li>
                </ol>
              </div>
            </div>

            <div>
              <h5 className="font-semibold flex items-center mb-2">
                <Search className="h-4 w-4 mr-2 text-purple-500" />
                Searching and Filtering
              </h5>
              <div className="bg-gray-50 p-3 rounded-lg">
                <ul className="space-y-1 text-sm">
                  <li>• Use the search bar to find employees by name</li>
                  <li>• Filter by department using the dropdown</li>
                  <li>• Filter by status (Active/Inactive)</li>
                  <li>• Sort by different criteria</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "station-management",
      title: "Station Management",
      icon: <Settings className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-semibold text-orange-800 mb-2">
              Station Operations
            </h4>
            <p className="text-orange-700">
              Station management allows you to assign employees to production
              stations and manage workflow assignments.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="font-semibold flex items-center mb-2">
                <Target className="h-4 w-4 mr-2 text-green-500" />
                Assignment Process
              </h5>
              <div className="bg-gray-50 p-3 rounded-lg">
                <ol className="space-y-2 text-sm">
                  <li>1. Navigate to the Station Management page</li>
                  <li>2. Select a station from the station list</li>
                  <li>3. Choose an employee from the dropdown</li>
                  <li>4. Set assignment details (start/end time)</li>
                  <li>5. Click "Assign" to create the assignment</li>
                </ol>
              </div>
            </div>

            <div>
              <h5 className="font-semibold flex items-center mb-2">
                <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                Viewing Assignments
              </h5>
              <div className="bg-gray-50 p-3 rounded-lg">
                <ul className="space-y-1 text-sm">
                  <li>• Switch between Daily and Weekly views</li>
                  <li>• Select specific dates to view assignments</li>
                  <li>• Export assignment data to Excel</li>
                  <li>• View assignment history</li>
                </ul>
              </div>
            </div>

            <div>
              <h5 className="font-semibold flex items-center mb-2">
                <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                Managing Assignments
              </h5>
              <div className="bg-gray-50 p-3 rounded-lg">
                <ul className="space-y-1 text-sm">
                  <li>• Edit existing assignments (Admin only)</li>
                  <li>• Delete assignments when needed</li>
                  <li>• View assignment status and details</li>
                  <li>• Monitor assignment conflicts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "production-tracking",
      title: "Production Tracking",
      icon: <Activity className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">
              Production Monitoring
            </h4>
            <p className="text-green-700">
              Track production metrics, quality rates, and performance trends in
              real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h5 className="font-semibold flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                Key Metrics
              </h5>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Total Production Count
                </li>
                <li className="flex items-center">
                  <Award className="h-4 w-4 text-blue-500 mr-2" />
                  Valid Valves Produced
                </li>
                <li className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                  Defective Valves Count
                </li>
                <li className="flex items-center">
                  <Star className="h-4 w-4 text-purple-500 mr-2" />
                  Quality Rate Percentage
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h5 className="font-semibold flex items-center">
                <BarChart3 className="h-4 w-4 mr-2 text-blue-500" />
                Visualizations
              </h5>
              <ul className="space-y-2 text-sm">
                <li>• Quality Distribution Pie Chart</li>
                <li>• Daily Production Bar Chart</li>
                <li>• Quality Trend Line Chart</li>
                <li>• Performance Indicators</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-semibold text-blue-800 mb-2">Date Filtering</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
              <div className="bg-white p-2 rounded">
                <strong>Today:</strong> Current day's production data
              </div>
              <div className="bg-white p-2 rounded">
                <strong>This Month:</strong> Monthly production overview
              </div>
              <div className="bg-white p-2 rounded">
                <strong>Custom Range:</strong> Select specific date range
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "reports-generation",
      title: "Reports Generation",
      icon: <FileText className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">
              Advanced Reporting
            </h4>
            <p className="text-purple-700">
              Generate comprehensive reports with creative visualizations and
              export options for detailed analysis.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="font-semibold flex items-center mb-2">
                <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                Generating Reports
              </h5>
              <div className="bg-gray-50 p-3 rounded-lg">
                <ol className="space-y-2 text-sm">
                  <li>1. Navigate to the Reports page</li>
                  <li>2. Select filters (Employee, Station, Date Range)</li>
                  <li>3. Click "Generate Report" button</li>
                  <li>4. View the generated report with charts</li>
                  <li>5. Export to PDF or other formats</li>
                </ol>
              </div>
            </div>

            <div>
              <h5 className="font-semibold flex items-center mb-2">
                <BarChart3 className="h-4 w-4 mr-2 text-blue-500" />
                Report Types
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-lg border">
                  <h6 className="font-semibold text-green-600">
                    Quality Distribution
                  </h6>
                  <p className="text-sm text-gray-600">
                    Doughnut chart showing valid vs defective valves
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <h6 className="font-semibold text-blue-600">
                    Production Trend
                  </h6>
                  <p className="text-sm text-gray-600">
                    Line chart showing production over time
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <h6 className="font-semibold text-purple-600">
                    Quality Metrics
                  </h6>
                  <p className="text-sm text-gray-600">
                    Radar chart showing performance indicators
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <h6 className="font-semibold text-orange-600">
                    Weekly Performance
                  </h6>
                  <p className="text-sm text-gray-600">
                    Polar area chart for weekly analysis
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-semibold flex items-center mb-2">
                <Download className="h-4 w-4 mr-2 text-green-500" />
                Export Options
              </h5>
              <div className="bg-gray-50 p-3 rounded-lg">
                <ul className="space-y-1 text-sm">
                  <li>• Export to PDF with charts and visualizations</li>
                  <li>• Download Excel files for data analysis</li>
                  <li>• Print reports directly from the browser</li>
                  <li>• Share reports via email or other methods</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "settings-configuration",
      title: "Settings & Configuration",
      icon: <Settings className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">
              System Settings
            </h4>
            <p className="text-gray-700">
              Manage your account settings, preferences, and system
              configuration options.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="font-semibold flex items-center mb-2">
                <Globe className="h-4 w-4 mr-2 text-blue-500" />
                Language & Theme
              </h5>
              <div className="bg-gray-50 p-3 rounded-lg">
                <ul className="space-y-1 text-sm">
                  <li>• Switch between English and Hebrew</li>
                  <li>• Toggle between light and dark themes</li>
                  <li>• Language preference is saved automatically</li>
                  <li>• Theme changes apply immediately</li>
                </ul>
              </div>
            </div>

            <div>
              <h5 className="font-semibold flex items-center mb-2">
                <Shield className="h-4 w-4 mr-2 text-green-500" />
                Account Management
              </h5>
              <div className="bg-gray-50 p-3 rounded-lg">
                <ul className="space-y-1 text-sm">
                  <li>• Change your password</li>
                  <li>• Update personal information</li>
                  <li>• View account status and permissions</li>
                  <li>• Manage login sessions</li>
                </ul>
              </div>
            </div>

            <div>
              <h5 className="font-semibold flex items-center mb-2">
                <Users className="h-4 w-4 mr-2 text-purple-500" />
                User Management (Admin Only)
              </h5>
              <div className="bg-gray-50 p-3 rounded-lg">
                <ul className="space-y-1 text-sm">
                  <li>• Create new user accounts</li>
                  <li>• Manage user permissions</li>
                  <li>• View all system users</li>
                  <li>• Reset user passwords</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      icon: <AlertTriangle className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">
              Common Issues & Solutions
            </h4>
            <p className="text-red-700">
              If you encounter any issues while using Migdalor, refer to this
              troubleshooting guide.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="font-semibold text-orange-600 mb-2">
                Login Issues
              </h5>
              <div className="bg-orange-50 p-3 rounded-lg">
                <ul className="space-y-1 text-sm">
                  <li>
                    • <strong>Problem:</strong> Cannot log in
                  </li>
                  <li>
                    • <strong>Solution:</strong> Check username and password,
                    contact administrator
                  </li>
                  <li>
                    • <strong>Problem:</strong> Account locked
                  </li>
                  <li>
                    • <strong>Solution:</strong> Wait 15 minutes or contact
                    administrator
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h5 className="font-semibold text-blue-600 mb-2">
                Performance Issues
              </h5>
              <div className="bg-blue-50 p-3 rounded-lg">
                <ul className="space-y-1 text-sm">
                  <li>
                    • <strong>Problem:</strong> Slow loading
                  </li>
                  <li>
                    • <strong>Solution:</strong> Check internet connection,
                    refresh page
                  </li>
                  <li>
                    • <strong>Problem:</strong> Charts not displaying
                  </li>
                  <li>
                    • <strong>Solution:</strong> Enable JavaScript, clear
                    browser cache
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h5 className="font-semibold text-purple-600 mb-2">
                Data Issues
              </h5>
              <div className="bg-purple-50 p-3 rounded-lg">
                <ul className="space-y-1 text-sm">
                  <li>
                    • <strong>Problem:</strong> Missing data
                  </li>
                  <li>
                    • <strong>Solution:</strong> Check date filters, refresh
                    data
                  </li>
                  <li>
                    • <strong>Problem:</strong> Export not working
                  </li>
                  <li>
                    • <strong>Solution:</strong> Try different browser, check
                    popup blockers
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h5 className="font-semibold text-green-600 mb-2">
                Browser Compatibility
              </h5>
              <div className="bg-green-50 p-3 rounded-lg">
                <ul className="space-y-1 text-sm">
                  <li>
                    • <strong>Recommended:</strong> Chrome, Firefox, Safari,
                    Edge (latest versions)
                  </li>
                  <li>
                    • <strong>Required:</strong> JavaScript enabled, cookies
                    allowed
                  </li>
                  <li>
                    • <strong>Mobile:</strong> Responsive design works on
                    tablets and phones
                  </li>
                  <li>
                    • <strong>Screen Size:</strong> Minimum 1024x768 resolution
                    recommended
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="theme-bg-primary min-h-screen transition-colors duration-300">
      <Navbar />
      <div className="responsive-container py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
              <h1 className="responsive-heading font-bold theme-text-primary mb-2 flex items-center">
                <BookOpen className="mr-2 sm:mr-3 text-blue-500 h-6 w-6 sm:h-8 sm:w-8" />
                User Manual
              </h1>
              <p className="responsive-text theme-text-secondary">
                Complete guide to using the Migdalor Production Management
                System
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={exportToPDF}
                disabled={exporting}
                className={`flex items-center px-3 sm:px-4 py-2 text-white rounded-lg transition-colors touch-button ${
                  exporting
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                <Download
                  className={`mr-2 h-4 w-4 ${exporting ? "animate-spin" : ""}`}
                />
                <span className="text-sm sm:text-base">
                  {exporting ? "Exporting..." : "Export PDF"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Manual Content */}
        <div ref={manualRef} className="space-y-6">
          {/* Table of Contents */}
          <div className="responsive-card">
            <h2 className="text-xl font-bold theme-text-primary mb-4 flex items-center">
              <FileText className="mr-2 h-5 w-5 text-blue-500" />
              Table of Contents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => toggleSection(section.id)}
                  className="flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="flex items-center">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </span>
                    {section.title}
                  </span>
                  {expandedSections[section.id] ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Manual Sections */}
          {sections.map((section, index) => (
            <div key={section.id} className="responsive-card">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                    {index + 1}
                  </span>
                  <div className="flex items-center">
                    {section.icon}
                    <h2 className="text-xl font-bold theme-text-primary ml-3">
                      {section.title}
                    </h2>
                  </div>
                </div>
                {expandedSections[section.id] ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>

              {expandedSections[section.id] && (
                <div className="mt-4 p-4 border-t">{section.content}</div>
              )}
            </div>
          ))}

          {/* Footer */}
          <div className="responsive-card bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="text-center">
              <h3 className="text-xl font-bold theme-text-primary mb-2">
                Need More Help?
              </h3>
              <p className="theme-text-secondary mb-4">
                If you need additional assistance or have questions not covered
                in this manual, please contact your system administrator.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm">
                <div className="flex items-center">
                  <Info className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Last updated: {new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-green-500" />
                  <span>Version: 1.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManualPage;
