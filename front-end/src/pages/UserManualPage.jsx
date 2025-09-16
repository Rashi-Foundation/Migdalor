import React, { useRef, useState } from "react";
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
  Sun,
  Moon,
  Sparkles,
} from "lucide-react";

const UserManualPage = () => {
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

        // Add content sections with detailed information
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
          "Welcome to Migdalor, your comprehensive production management system designed to help you track, manage, and optimize your manufacturing operations. Built with modern web technologies, it provides real-time insights, advanced analytics, and seamless user experience.\n\nCore Features:\n• Real-time production tracking with MQTT integration\n• Advanced employee management and qualification tracking\n• Dynamic station assignments and workflow management\n• Comprehensive quality monitoring and analytics\n• Multi-format reporting with visualizations\n• Multi-language support (English/Hebrew)\n• Dark/Light theme switching\n• Mobile-responsive design\n\nSystem Requirements:\n• Modern web browser (Chrome, Firefox, Safari, Edge)\n• Stable internet connection\n• JavaScript enabled\n• Screen resolution: 1024x768+ (responsive design)\n• Cookies enabled for session management\n• Pop-up blockers disabled for exports\n\nSystem Architecture:\n• Frontend: React 19 with Vite, Tailwind CSS\n• Backend: Node.js with Express, MongoDB Atlas\n• Real-time: MQTT protocol integration\n\nNavigation Overview:\nMain Pages:\n• Home: Dashboard with key metrics and charts\n• Employees: Worker management and qualifications\n• Production: Real-time production tracking\n• Station Management: Assignment and workflow control\n• Reports: Advanced analytics and exports\n• Settings: User preferences and system configuration\n\nKey Capabilities:\n• Interactive charts and visualizations\n• Real-time data updates\n• Export to PDF and CSV formats\n• Advanced filtering and search\n• Role-based access control\n• Mobile-optimized interface"
        );

        addSection(
          "2. Login Process",
          "Accessing the System:\nTo access Migdalor, you need valid login credentials provided by your system administrator.\n\nStep-by-Step Process:\n1. Navigate to Login Page - Open your web browser and go to the Migdalor login page\n2. Enter Credentials - Enter your username and password in the provided fields\n3. Click Login - Click the 'Login' button to access the system\n\nTroubleshooting:\n• If login fails, check your credentials\n• Contact your administrator for password reset\n• Ensure your account is active"
        );

        addSection(
          "3. Dashboard Overview",
          "Home Dashboard:\nThe dashboard provides a comprehensive overview of your production system with real-time metrics, interactive charts, and key performance indicators. All data updates automatically and provides actionable insights for decision-making.\n\nReal-time Updates Cards:\nThe top section displays four key metrics that update in real-time:\n• Active Workers: Currently working employees\n• Inactive Workers: Non-working employees\n• Daily Defects: Defective products today\n• Inactive Stations: Stations not in use\n\nNote: Click on 'Active Workers' or 'Inactive Workers' cards to navigate directly to the Employees page with filtered results.\n\nInteractive Charts & Visualizations:\n• Production Efficiency Chart: Displays production efficiency trends over time with interactive data points. Hover over chart elements to see detailed information.\n• Department Performance Overview: Compares performance metrics across different departments with visual indicators.\n• Production Quality Dashboard: Comprehensive quality metrics with grade system and trend analysis.\n\nReal-time Features:\n• Automatic Updates: Data refreshes every few seconds, no manual refresh required, MQTT integration for live data\n• Interactive Elements: Clickable cards for navigation, hover effects on charts, responsive touch controls"
        );

        addSection(
          "4. Employee Management",
          "Managing Employees:\nThe employee management section allows you to add, edit, and manage employee information, qualifications, and status.\n\nAdding New Employees:\n1. Navigate to the Employees page\n2. Click 'Add Employee' button\n3. Fill in personal information (name, ID, contact details)\n4. Select department and position\n5. Add qualifications if applicable\n6. Set employee status (Active/Inactive)\n7. Click 'Save' to create the employee record\n\nEditing Employee Information:\n1. Find the employee in the employee list\n2. Click the 'Edit' button next to their name\n3. Modify the required information\n4. Click 'Save' to update the record\n\nSearching and Filtering:\n• Use the search bar to find employees by name\n• Filter by department using the dropdown\n• Filter by status (Active/Inactive)\n• Sort by different criteria"
        );

        addSection(
          "5. Station Management",
          "Station Management System:\nComprehensive station management with assignment workflows, real-time monitoring, and administrative controls for production optimization.\n\nStation Assignment Workflow:\nAssignment Process:\n1. Select Station: Choose from available production stations\n2. Choose Employee: Select qualified worker from dropdown\n3. Set Schedule: Define start and end times\n4. Confirm Assignment: Review and save assignment\n5. Monitor Progress: Track real-time performance\n\nAssignment Features:\n• Real-time availability checking\n• Qualification validation\n• Conflict detection and prevention\n• Automatic status updates\n• Historical assignment tracking\n\nViewing & Monitoring:\nDaily View:\n• Time-based assignment grid\n• Employee names and roles\n• Station status indicators\n• Quick edit and delete options\n\nWeekly View:\n• 7-day assignment calendar\n• Workload distribution analysis\n• Capacity utilization metrics\n• Export to Excel functionality\n\nAdministrative Controls:\nAdmin Functions:\n• Create new station assignments\n• Edit existing assignments\n• Delete assignments when needed\n• View assignment history\n• Monitor assignment conflicts\n\nUser Functions:\n• View assigned stations\n• Check assignment status\n• View schedule details\n• Access station information\n• Report issues or conflicts\n\nReal-time Features:\n• Live Updates: Assignment status changes instantly, real-time availability updates, automatic conflict detection\n• Monitoring: Live station status tracking, employee activity monitoring, performance metrics updates"
        );

        addSection(
          "6. Production Tracking",
          "Production Monitoring:\nTrack production metrics, quality rates, and performance trends in real-time with advanced filtering, interactive charts, and export capabilities.\n\nKey Performance Metrics:\n• Total Production: All products manufactured\n• Valid Valves: Quality-approved products\n• Defective Valves: Products failing quality checks\n• Quality Rate: Overall quality percentage\n\nAdvanced Date Filtering:\n• Today: Current day's production data with real-time updates\n• This Month: Monthly production overview with daily breakdowns\n• Custom Range: Select specific start and end dates for analysis\n\nPro Tip: Use custom date ranges to compare performance across different periods or analyze specific production cycles.\n\nInteractive Charts & Visualizations:\n• Quality Distribution Pie Chart: Visual representation of valid vs defective products with hover tooltips\n• Daily Production Bar Chart: Shows production volume over time with separate bars for valid and defective products\n• Quality Trend Line Chart: Tracks quality percentage over time to identify trends and patterns\n\nData Export & Analysis:\nCSV Export Features:\n• Complete production data with timestamps\n• Quality metrics and calculations\n• Daily breakdown with totals\n• Summary statistics section\n• Formatted for Excel compatibility\n\nAnalysis Capabilities:\n• Performance indicators calculation\n• Quality rate analysis\n• Defect rate tracking\n• Days analyzed counter\n• Trend identification\n\nReal-time Updates:\n• Automatic Refresh: Data updates every few seconds, charts refresh automatically, no page reload required\n• Live Monitoring: MQTT integration for live data, real-time quality tracking, instant metric updates"
        );

        addSection(
          "7. Reports Generation",
          "Advanced Reporting System:\nGenerate comprehensive reports with creative visualizations, advanced filtering options, and multiple export formats for detailed analysis and decision-making.\n\nReport Generation Process:\nStep-by-Step Process:\n1. Navigate to Reports: Click 'Reports' in the main navigation\n2. Set Filters: Select employee, station, and date range\n3. Generate: Click 'Generate Report' button\n4. Review: Analyze charts and statistics\n5. Export: Download PDF or share results\n\nFilter Options:\n• Employee: Filter by specific worker or all employees\n• Station: Filter by production station or all stations\n• Date Range: Custom start and end dates\n• Reset: Clear all filters and start fresh\n\nAdvanced Chart Types & Visualizations:\n• Quality Distribution (Doughnut Chart): Interactive doughnut chart showing the proportion of valid vs defective products with hover effects\n• Production Trend (Line Chart): Dual-line chart tracking both valid and defective production over time with filled areas\n• Quality Metrics (Radar Chart): Multi-dimensional radar chart showing quality performance across different metrics\n• Weekly Performance (Polar Area Chart): Polar area chart displaying production performance across days of the week\n\nExport & Sharing Options:\nPDF Export Features:\n• High-resolution charts and visualizations\n• Complete report with all statistics\n• Professional formatting and layout\n• Summary section with key metrics\n• Daily data table with calculations\n• Automatic filename with date stamp\n\nData Analysis Features:\n• Interactive chart exploration\n• Real-time data filtering\n• Performance indicator calculations\n• Trend analysis capabilities\n• Comparative analysis tools\n• Export-ready data formats\n\nReport Summary & Statistics:\nEach generated report includes a comprehensive summary section with key performance indicators:\n• Quality %: Overall Quality Rate\n• Days: Days Analyzed\n• Units: Total Units Produced\n\nReal-time Report Generation:\n• Live Data Integration: Reports use real-time production data, charts update with latest information, no manual data refresh required\n• Performance Optimization: Fast report generation, responsive chart rendering, efficient data processing"
        );

        addSection(
          "8. Advanced Features",
          "Advanced System Features:\nExplore advanced features including MQTT integration, real-time monitoring, mobile responsiveness, and accessibility features.\n\nMQTT Real-time Integration:\nThe system uses MQTT protocol for real-time communication between devices and services.\n\nMQTT Features:\n• Real-time data transmission\n• Device-to-cloud communication\n• Automatic data synchronization\n• Live production monitoring\n• Instant quality updates\n\nData Flow:\n• Production devices → MQTT broker\n• Broker → Migdalor system\n• Real-time dashboard updates\n• Automatic database storage\n• Live chart updates\n\nMobile Responsiveness:\nResponsive Design:\nThe system automatically adapts to different screen sizes and devices:\n• Mobile phones (320px+)\n• Tablets (768px+)\n• Desktop computers (1024px+)\n• Large displays (1440px+)\n\nTouch Optimization:\nOptimized for touch interactions on mobile devices:\n• Large touch targets (44px minimum)\n• Swipe gestures for navigation\n• Pinch-to-zoom on charts\n• Touch-friendly form controls\n\nInternationalization & Accessibility:\nLanguage Support:\n• English (default)\n• Hebrew (RTL support)\n• Automatic language detection\n• Persistent language preference\n• Real-time language switching\n\nAccessibility Features:\n• Keyboard navigation support\n• Screen reader compatibility\n• High contrast mode\n• Focus indicators\n• ARIA labels and descriptions\n\nTheme System:\nThe system supports both light and dark themes with automatic switching capabilities:\n• Light Theme: Clean, bright interface for daytime use\n• Dark Theme: Reduced eye strain for low-light environments\n\nPerformance Features:\nOptimization:\n• Lazy loading for charts\n• Efficient data caching\n• Optimized API calls\n• Fast page transitions\n\nMonitoring:\n• Real-time performance metrics\n• Error tracking and reporting\n• System health monitoring\n• Automatic error recovery"
        );

        addSection(
          "9. Keyboard Shortcuts & Tips",
          "Keyboard Shortcuts & Pro Tips:\nMaster the system with keyboard shortcuts, efficiency tips, and best practices for optimal productivity.\n\nKeyboard Shortcuts:\nNavigation:\n• Go to Home: Alt + H\n• Go to Employees: Alt + E\n• Go to Production: Alt + P\n• Go to Reports: Alt + R\n\nActions:\n• Search: Ctrl + F\n• Refresh Data: F5\n• Export: Ctrl + E\n• Toggle Theme: Ctrl + T\n\nPro Tips & Best Practices:\nDashboard Optimization:\n• Use the dashboard cards to quickly navigate to filtered views\n• Click on 'Active Workers' to see only working employees\n• Monitor quality trends using the interactive charts\n• Set up bookmarks for frequently accessed reports\n\nReport Generation:\n• Use custom date ranges to compare different periods\n• Filter by specific employees to analyze individual performance\n• Export reports regularly for backup and analysis\n• Use the reset button to clear filters and start fresh\n\nProduction Monitoring:\n• Check production data multiple times per day for real-time insights\n• Use the 'Today' filter for current day monitoring\n• Export CSV data for detailed analysis in Excel\n• Monitor quality trends to identify improvement opportunities\n\nEfficiency Tips:\nData Management:\n• Use search filters to quickly find specific data\n• Sort columns by clicking headers\n• Export data regularly for backup\n• Use date filters to focus on relevant periods\n\nSystem Usage:\n• Keep the system open in a browser tab for quick access\n• Use keyboard shortcuts for faster navigation\n• Enable notifications for important updates\n• Bookmark frequently used pages\n\nSystem Maintenance:\nRegular Tasks:\n• Clear browser cache monthly\n• Update browser to latest version\n• Check internet connection stability\n• Log out when not in use\n\nPerformance:\n• Close unused browser tabs\n• Restart browser if system feels slow\n• Use Chrome or Firefox for best performance\n• Enable JavaScript for full functionality"
        );

        addSection(
          "10. Settings & Configuration",
          "System Settings & Configuration:\nComprehensive settings management for personal preferences, account configuration, and system administration with role-based access controls.\n\nLanguage & Internationalization:\nLanguage Options:\n• English: Default language with LTR support\n• Hebrew: RTL language support\n\nLanguage Features:\n• Auto-save: Language preference saved automatically\n• Real-time switching: Changes apply immediately\n• RTL Support: Right-to-left layout for Hebrew\n• Browser Detection: Automatic language detection\n• Persistent: Remembers choice across sessions\n\nTheme & Visual Preferences:\nTheme Options:\n• Light Theme: Clean, bright interface for daytime use\n• Dark Theme: Reduced eye strain for low-light environments\n\nTheme Features:\n• Instant switching: Changes apply immediately\n• System preference: Follows OS theme setting\n• Persistent: Remembers choice across sessions\n• Accessibility: High contrast support\n• Consistent: All components follow theme\n\nAccount Management & Security:\nPersonal Account Settings:\nProfile Management:\n• Update personal information\n• Change contact details\n• Modify display preferences\n• Set notification preferences\n\nSecurity Settings:\n• Change password regularly\n• View login history\n• Manage active sessions\n• Enable two-factor authentication\n\nAccount Status & Permissions:\nAccount Information:\n• View account status (Active/Inactive)\n• Check role permissions\n• Review access levels\n• Monitor account activity\n\nSession Management:\n• View active sessions\n• Log out from all devices\n• Manage session timeouts\n• Monitor login attempts\n\nUser Management (Admin Only):\nUser Administration:\n• Create Users: Add new system users with roles\n• Edit Users: Modify user information and permissions\n• Delete Users: Remove users from the system\n• View All Users: Complete user directory\n• Role Management: Assign and modify user roles\n\nSecurity Controls:\n• Password Reset: Reset user passwords\n• Account Lock/Unlock: Manage account status\n• Permission Audit: Review user access levels\n• Activity Monitoring: Track user actions\n• Bulk Operations: Manage multiple users\n\nSystem Preferences & Notifications:\nNotification Settings:\n• Email Notifications: Configure email alerts\n• Browser Notifications: Enable/disable popup alerts\n• System Alerts: Set up system-wide notifications\n• Frequency Control: Manage notification frequency\n\nDisplay Preferences:\n• Date Format: Choose date display format\n• Time Zone: Set local time zone\n• Number Format: Configure number display\n• Chart Preferences: Set default chart types\n\nSettings Best Practices:\nSecurity Recommendations:\n• Change password every 90 days\n• Use strong, unique passwords\n• Log out when not in use\n• Monitor account activity regularly\n\nPerformance Tips:\n• Choose appropriate theme for environment\n• Set language preference early\n• Configure notifications to avoid spam\n• Review settings after system updates"
        );

        addSection(
          "11. Troubleshooting",
          "Comprehensive Troubleshooting Guide:\nIf you encounter any issues while using Migdalor, refer to this comprehensive troubleshooting guide with step-by-step solutions.\n\nAuthentication & Login Issues:\nCannot Log In:\n1. Check Credentials: Verify username and password are correct\n2. Check Caps Lock: Ensure Caps Lock is not enabled\n3. Clear Browser Cache: Clear cookies and cache, then try again\n4. Contact Administrator: If problem persists, contact system admin\n\nAccount Locked:\n1. Wait Period: Wait 15 minutes before attempting to log in again\n2. Contact Admin: Request account unlock from administrator\n3. Password Reset: Request password reset if needed\n\nPerformance & Loading Issues:\nSlow Loading:\n1. Check Internet: Verify stable internet connection\n2. Refresh Page: Press F5 or Ctrl+R to refresh\n3. Close Tabs: Close unnecessary browser tabs\n4. Restart Browser: Close and reopen browser completely\n\nCharts Not Displaying:\n1. Enable JavaScript: Ensure JavaScript is enabled in browser\n2. Clear Cache: Clear browser cache and cookies\n3. Disable Ad Blockers: Temporarily disable ad blockers\n4. Try Different Browser: Test with Chrome or Firefox\n\nData & Export Issues:\nMissing Data:\n1. Check Date Filters: Verify date range includes data period\n2. Refresh Data: Click refresh button or press F5\n3. Check Filters: Clear all filters and try again\n4. Contact Support: Report missing data to administrator\n\nExport Not Working:\n1. Disable Popup Blockers: Allow popups for this site\n2. Check Downloads: Look in browser downloads folder\n3. Try Different Browser: Use Chrome or Firefox\n4. Check Storage: Ensure sufficient disk space\n\nBrowser & Compatibility Issues:\nRecommended Browsers:\n• Chrome: Version 90+ (Best performance)\n• Firefox: Version 88+ (Good compatibility)\n• Safari: Version 14+ (Mac users)\n• Edge: Version 90+ (Windows users)\n\nSystem Requirements:\n• JavaScript: Must be enabled\n• Cookies: Must be allowed\n• Screen: Minimum 1024x768 resolution\n• Internet: Stable broadband connection\n\nMobile & Responsive Issues:\nMobile Optimization:\n• Touch Targets: All buttons are touch-friendly\n• Responsive Design: Adapts to screen size\n• Orientation: Works in portrait and landscape\n• Performance: Optimized for mobile devices\n\nMobile Troubleshooting:\n• Zoom: Pinch to zoom on charts\n• Scroll: Swipe to navigate\n• Refresh: Pull down to refresh data\n• Cache: Clear mobile browser cache\n\nStill Need Help?\nContact Support:\n• Email your system administrator\n• Include error messages and screenshots\n• Describe steps that led to the issue\n• Mention your browser and device type\n\nEmergency Procedures:\n• Try accessing from different device\n• Use incognito/private browsing mode\n• Check if other users have same issue\n• Document issue for technical support"
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
              operations. Built with modern web technologies, it provides
              real-time insights, advanced analytics, and seamless user
              experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h5 className="font-semibold text-green-800 mb-2">
                Core Features
              </h5>
              <ul className="text-green-700 space-y-1">
                <li>• Real-time production tracking with MQTT integration</li>
                <li>
                  • Advanced employee management and qualification tracking
                </li>
                <li>• Dynamic station assignments and workflow management</li>
                <li>• Comprehensive quality monitoring and analytics</li>
                <li>• Multi-format reporting with visualizations</li>
                <li>• Multi-language support (English/Hebrew)</li>
                <li>• Dark/Light theme switching</li>
                <li>• Mobile-responsive design</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h5 className="font-semibold text-purple-800 mb-2">
                System Requirements
              </h5>
              <ul className="text-purple-700 space-y-1">
                <li>• Modern web browser (Chrome, Firefox, Safari, Edge)</li>
                <li>• Stable internet connection</li>
                <li>• JavaScript enabled</li>
                <li>• Screen resolution: 1024x768+ (responsive design)</li>
                <li>• Cookies enabled for session management</li>
                <li>• Pop-up blockers disabled for exports</li>
              </ul>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <h5 className="font-semibold text-orange-800 mb-2">
              System Architecture
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="bg-white p-3 rounded">
                <strong>Frontend:</strong> React 19 with Vite, Tailwind CSS
              </div>
              <div className="bg-white p-3 rounded">
                <strong>Backend:</strong> Node.js with Express, MongoDB Atlas
              </div>
              <div className="bg-white p-3 rounded">
                <strong>Real-time:</strong> MQTT protocol integration
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg">
            <h5 className="font-semibold text-indigo-800 mb-2">
              Navigation Overview
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <strong>Main Pages:</strong>
                <ul className="ml-4 space-y-1">
                  <li>
                    • <strong>Home:</strong> Dashboard with key metrics and
                    charts
                  </li>
                  <li>
                    • <strong>Employees:</strong> Worker management and
                    qualifications
                  </li>
                  <li>
                    • <strong>Production:</strong> Real-time production tracking
                  </li>
                  <li>
                    • <strong>Station Management:</strong> Assignment and
                    workflow control
                  </li>
                  <li>
                    • <strong>Reports:</strong> Advanced analytics and exports
                  </li>
                  <li>
                    • <strong>Settings:</strong> User preferences and system
                    configuration
                  </li>
                </ul>
              </div>
              <div>
                <strong>Key Capabilities:</strong>
                <ul className="ml-4 space-y-1">
                  <li>• Interactive charts and visualizations</li>
                  <li>• Real-time data updates</li>
                  <li>• Export to PDF and CSV formats</li>
                  <li>• Advanced filtering and search</li>
                  <li>• Role-based access control</li>
                  <li>• Mobile-optimized interface</li>
                </ul>
              </div>
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
              system with real-time metrics, interactive charts, and key
              performance indicators. All data updates automatically and
              provides actionable insights for decision-making.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="font-semibold flex items-center mb-3">
                <Activity className="h-4 w-4 mr-2 text-blue-500" />
                Real-time Updates Cards
              </h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm mb-3">
                  The top section displays four key metrics that update in
                  real-time:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <h6 className="font-semibold text-green-800">
                          Active Workers
                        </h6>
                        <p className="text-2xl font-bold text-green-600">
                          Count
                        </p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Currently working employees
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-red-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <h6 className="font-semibold text-red-800">
                          Inactive Workers
                        </h6>
                        <p className="text-2xl font-bold text-red-600">Count</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-red-500" />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Non-working employees
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <h6 className="font-semibold text-purple-800">
                          Daily Defects
                        </h6>
                        <p className="text-2xl font-bold text-purple-600">
                          Count
                        </p>
                      </div>
                      <Target className="h-8 w-8 text-purple-500" />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Defective products today
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-orange-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <h6 className="font-semibold text-orange-800">
                          Inactive Stations
                        </h6>
                        <p className="text-2xl font-bold text-orange-600">
                          Count
                        </p>
                      </div>
                      <Settings className="h-8 w-8 text-orange-500" />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Stations not in use
                    </p>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-blue-50 rounded">
                  <p className="text-xs text-blue-800">
                    <strong>Note:</strong> Click on "Active Workers" or
                    "Inactive Workers" cards to navigate directly to the
                    Employees page with filtered results.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-semibold flex items-center mb-3">
                <BarChart3 className="h-4 w-4 mr-2 text-blue-500" />
                Interactive Charts & Visualizations
              </h5>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-lg border">
                  <h6 className="font-semibold text-gray-800 mb-2">
                    Production Efficiency Chart
                  </h6>
                  <p className="text-sm text-gray-600 mb-2">
                    Displays production efficiency trends over time with
                    interactive data points. Hover over chart elements to see
                    detailed information.
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>
                      • Shows efficiency percentage over selected time period
                    </li>
                    <li>• Interactive tooltips with exact values</li>
                    <li>• Responsive design adapts to screen size</li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <h6 className="font-semibold text-gray-800 mb-2">
                    Department Performance Overview
                  </h6>
                  <p className="text-sm text-gray-600 mb-2">
                    Compares performance metrics across different departments
                    with visual indicators.
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Department-wise performance comparison</li>
                    <li>• Color-coded performance indicators</li>
                    <li>• Real-time data updates</li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <h6 className="font-semibold text-gray-800 mb-2">
                    Production Quality Dashboard
                  </h6>
                  <p className="text-sm text-gray-600 mb-2">
                    Comprehensive quality metrics with grade system and trend
                    analysis.
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Quality score percentage with grade (A-D)</li>
                    <li>• Weekly trend visualization</li>
                    <li>• Top quality issues identification</li>
                    <li>• Defect rate tracking</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h5 className="font-semibold text-yellow-800 mb-2 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Real-time Features
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <strong>Automatic Updates:</strong>
                  <ul className="ml-4 space-y-1">
                    <li>• Data refreshes every few seconds</li>
                    <li>• No manual refresh required</li>
                    <li>• MQTT integration for live data</li>
                  </ul>
                </div>
                <div>
                  <strong>Interactive Elements:</strong>
                  <ul className="ml-4 space-y-1">
                    <li>• Clickable cards for navigation</li>
                    <li>• Hover effects on charts</li>
                    <li>• Responsive touch controls</li>
                  </ul>
                </div>
              </div>
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
              real-time with advanced filtering, interactive charts, and export
              capabilities.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="font-semibold flex items-center mb-3">
                <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                Key Performance Metrics
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <h6 className="font-semibold text-green-800">
                        Total Production
                      </h6>
                      <p className="text-2xl font-bold text-green-600">Count</p>
                    </div>
                    <Target className="h-8 w-8 text-green-500" />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    All products manufactured
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <h6 className="font-semibold text-blue-800">
                        Valid Valves
                      </h6>
                      <p className="text-2xl font-bold text-blue-600">Count</p>
                    </div>
                    <Award className="h-8 w-8 text-blue-500" />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Quality-approved products
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border-l-4 border-red-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <h6 className="font-semibold text-red-800">
                        Defective Valves
                      </h6>
                      <p className="text-2xl font-bold text-red-600">Count</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Products failing quality checks
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border-l-4 border-purple-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <h6 className="font-semibold text-purple-800">
                        Quality Rate
                      </h6>
                      <p className="text-2xl font-bold text-purple-600">%</p>
                    </div>
                    <Star className="h-8 w-8 text-purple-500" />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Overall quality percentage
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-semibold flex items-center mb-3">
                <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                Advanced Date Filtering
              </h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <div className="bg-white p-3 rounded border">
                    <h6 className="font-semibold text-green-600 mb-1">Today</h6>
                    <p className="text-sm text-gray-600">
                      Current day's production data with real-time updates
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <h6 className="font-semibold text-blue-600 mb-1">
                      This Month
                    </h6>
                    <p className="text-sm text-gray-600">
                      Monthly production overview with daily breakdowns
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <h6 className="font-semibold text-purple-600 mb-1">
                      Custom Range
                    </h6>
                    <p className="text-sm text-gray-600">
                      Select specific start and end dates for analysis
                    </p>
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm text-blue-800">
                    <strong>Pro Tip:</strong> Use custom date ranges to compare
                    performance across different periods or analyze specific
                    production cycles.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-semibold flex items-center mb-3">
                <BarChart3 className="h-4 w-4 mr-2 text-blue-500" />
                Interactive Charts & Visualizations
              </h5>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-lg border">
                  <h6 className="font-semibold text-gray-800 mb-2">
                    Quality Distribution Pie Chart
                  </h6>
                  <p className="text-sm text-gray-600 mb-2">
                    Visual representation of valid vs defective products with
                    hover tooltips.
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Green section: Valid products</li>
                    <li>• Red section: Defective products</li>
                    <li>• Hover for exact percentages</li>
                    <li>• Click to focus on specific segment</li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <h6 className="font-semibold text-gray-800 mb-2">
                    Daily Production Bar Chart
                  </h6>
                  <p className="text-sm text-gray-600 mb-2">
                    Shows production volume over time with separate bars for
                    valid and defective products.
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Blue bars: Valid products</li>
                    <li>• Red bars: Defective products</li>
                    <li>• X-axis: Dates in selected range</li>
                    <li>• Y-axis: Production count</li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <h6 className="font-semibold text-gray-800 mb-2">
                    Quality Trend Line Chart
                  </h6>
                  <p className="text-sm text-gray-600 mb-2">
                    Tracks quality percentage over time to identify trends and
                    patterns.
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Purple line: Quality percentage trend</li>
                    <li>• Filled area: Visual emphasis</li>
                    <li>• Smooth curves: Trend analysis</li>
                    <li>• Interactive data points</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-semibold flex items-center mb-3">
                <Download className="h-4 w-4 mr-2 text-green-500" />
                Data Export & Analysis
              </h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-semibold text-gray-800 mb-2">
                      CSV Export Features
                    </h6>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Complete production data with timestamps</li>
                      <li>• Quality metrics and calculations</li>
                      <li>• Daily breakdown with totals</li>
                      <li>• Summary statistics section</li>
                      <li>• Formatted for Excel compatibility</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-semibold text-gray-800 mb-2">
                      Analysis Capabilities
                    </h6>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Performance indicators calculation</li>
                      <li>• Quality rate analysis</li>
                      <li>• Defect rate tracking</li>
                      <li>• Days analyzed counter</li>
                      <li>• Trend identification</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-green-50 rounded">
                  <p className="text-xs text-green-800">
                    <strong>Export Button:</strong> Click the green "Export CSV"
                    button to download comprehensive production data for further
                    analysis.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h5 className="font-semibold text-yellow-800 mb-2 flex items-center">
                <RefreshCw className="h-4 w-4 mr-2" />
                Real-time Updates
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <strong>Automatic Refresh:</strong>
                  <ul className="ml-4 space-y-1">
                    <li>• Data updates every few seconds</li>
                    <li>• Charts refresh automatically</li>
                    <li>• No page reload required</li>
                  </ul>
                </div>
                <div>
                  <strong>Live Monitoring:</strong>
                  <ul className="ml-4 space-y-1">
                    <li>• MQTT integration for live data</li>
                    <li>• Real-time quality tracking</li>
                    <li>• Instant metric updates</li>
                  </ul>
                </div>
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
              Advanced Reporting System
            </h4>
            <p className="text-purple-700">
              Generate comprehensive reports with creative visualizations,
              advanced filtering options, and multiple export formats for
              detailed analysis and decision-making.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="font-semibold flex items-center mb-3">
                <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                Report Generation Process
              </h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-semibold text-gray-800 mb-2">
                      Step-by-Step Process
                    </h6>
                    <ol className="space-y-2 text-sm">
                      <li>
                        1. <strong>Navigate to Reports:</strong> Click "Reports"
                        in the main navigation
                      </li>
                      <li>
                        2. <strong>Set Filters:</strong> Select employee,
                        station, and date range
                      </li>
                      <li>
                        3. <strong>Generate:</strong> Click "Generate Report"
                        button
                      </li>
                      <li>
                        4. <strong>Review:</strong> Analyze charts and
                        statistics
                      </li>
                      <li>
                        5. <strong>Export:</strong> Download PDF or share
                        results
                      </li>
                    </ol>
                  </div>
                  <div>
                    <h6 className="font-semibold text-gray-800 mb-2">
                      Filter Options
                    </h6>
                    <ul className="space-y-1 text-sm">
                      <li>
                        • <strong>Employee:</strong> Filter by specific worker
                        or all employees
                      </li>
                      <li>
                        • <strong>Station:</strong> Filter by production station
                        or all stations
                      </li>
                      <li>
                        • <strong>Date Range:</strong> Custom start and end
                        dates
                      </li>
                      <li>
                        • <strong>Reset:</strong> Clear all filters and start
                        fresh
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-semibold flex items-center mb-3">
                <BarChart3 className="h-4 w-4 mr-2 text-blue-500" />
                Advanced Chart Types & Visualizations
              </h5>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-lg border">
                  <h6 className="font-semibold text-green-600 mb-2">
                    Quality Distribution (Doughnut Chart)
                  </h6>
                  <p className="text-sm text-gray-600 mb-2">
                    Interactive doughnut chart showing the proportion of valid
                    vs defective products with hover effects.
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Green section: Valid products with percentage</li>
                    <li>• Red section: Defective products with percentage</li>
                    <li>• Hover for exact values and counts</li>
                    <li>• Click segments to focus on specific data</li>
                    <li>• Smooth animations and transitions</li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <h6 className="font-semibold text-blue-600 mb-2">
                    Production Trend (Line Chart)
                  </h6>
                  <p className="text-sm text-gray-600 mb-2">
                    Dual-line chart tracking both valid and defective production
                    over time with filled areas.
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Blue line: Valid products trend</li>
                    <li>• Red line: Defective products trend</li>
                    <li>• Filled areas for visual emphasis</li>
                    <li>• Interactive data points with tooltips</li>
                    <li>• Smooth curves for trend analysis</li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <h6 className="font-semibold text-purple-600 mb-2">
                    Quality Metrics (Radar Chart)
                  </h6>
                  <p className="text-sm text-gray-600 mb-2">
                    Multi-dimensional radar chart showing quality performance
                    across different metrics.
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Quality Rate: Overall quality percentage</li>
                    <li>• Efficiency: Production efficiency metrics</li>
                    <li>• Consistency: Performance consistency</li>
                    <li>• Reliability: System reliability score</li>
                    <li>• Performance: Overall performance rating</li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <h6 className="font-semibold text-orange-600 mb-2">
                    Weekly Performance (Polar Area Chart)
                  </h6>
                  <p className="text-sm text-gray-600 mb-2">
                    Polar area chart displaying production performance across
                    days of the week.
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Monday through Sunday performance</li>
                    <li>• Color-coded by day of week</li>
                    <li>• Area size represents production volume</li>
                    <li>• Interactive hover effects</li>
                    <li>• Pattern identification capabilities</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-semibold flex items-center mb-3">
                <Download className="h-4 w-4 mr-2 text-green-500" />
                Export & Sharing Options
              </h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-semibold text-gray-800 mb-2">
                      PDF Export Features
                    </h6>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• High-resolution charts and visualizations</li>
                      <li>• Complete report with all statistics</li>
                      <li>• Professional formatting and layout</li>
                      <li>• Summary section with key metrics</li>
                      <li>• Daily data table with calculations</li>
                      <li>• Automatic filename with date stamp</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-semibold text-gray-800 mb-2">
                      Data Analysis Features
                    </h6>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Interactive chart exploration</li>
                      <li>• Real-time data filtering</li>
                      <li>• Performance indicator calculations</li>
                      <li>• Trend analysis capabilities</li>
                      <li>• Comparative analysis tools</li>
                      <li>• Export-ready data formats</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-blue-50 rounded">
                  <p className="text-sm text-blue-800">
                    <strong>Pro Tip:</strong> Use the reset button to clear all
                    filters and generate a comprehensive report for the entire
                    system, or apply specific filters to focus on particular
                    employees, stations, or time periods.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-semibold flex items-center mb-3">
                <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
                Report Summary & Statistics
              </h5>
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-sm text-gray-600 mb-3">
                  Each generated report includes a comprehensive summary section
                  with key performance indicators:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      Quality %
                    </div>
                    <div className="text-sm text-gray-600">
                      Overall Quality Rate
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      Days
                    </div>
                    <div className="text-sm text-gray-600">Days Analyzed</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      Units
                    </div>
                    <div className="text-sm text-gray-600">
                      Total Units Produced
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h5 className="font-semibold text-yellow-800 mb-2 flex items-center">
                <RefreshCw className="h-4 w-4 mr-2" />
                Real-time Report Generation
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <strong>Live Data Integration:</strong>
                  <ul className="ml-4 space-y-1">
                    <li>• Reports use real-time production data</li>
                    <li>• Charts update with latest information</li>
                    <li>• No manual data refresh required</li>
                  </ul>
                </div>
                <div>
                  <strong>Performance Optimization:</strong>
                  <ul className="ml-4 space-y-1">
                    <li>• Fast report generation</li>
                    <li>• Responsive chart rendering</li>
                    <li>• Efficient data processing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "station-management-detailed",
      title: "Station Management",
      icon: <Settings className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-semibold text-orange-800 mb-2">
              Station Management System
            </h4>
            <p className="text-orange-700">
              Comprehensive station management with assignment workflows,
              real-time monitoring, and administrative controls for production
              optimization.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="font-semibold flex items-center mb-3">
                <Target className="h-4 w-4 mr-2 text-green-500" />
                Station Assignment Workflow
              </h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-semibold text-gray-800 mb-2">
                      Assignment Process
                    </h6>
                    <ol className="space-y-2 text-sm">
                      <li>
                        1. <strong>Select Station:</strong> Choose from
                        available production stations
                      </li>
                      <li>
                        2. <strong>Choose Employee:</strong> Select qualified
                        worker from dropdown
                      </li>
                      <li>
                        3. <strong>Set Schedule:</strong> Define start and end
                        times
                      </li>
                      <li>
                        4. <strong>Confirm Assignment:</strong> Review and save
                        assignment
                      </li>
                      <li>
                        5. <strong>Monitor Progress:</strong> Track real-time
                        performance
                      </li>
                    </ol>
                  </div>
                  <div>
                    <h6 className="font-semibold text-gray-800 mb-2">
                      Assignment Features
                    </h6>
                    <ul className="space-y-1 text-sm">
                      <li>• Real-time availability checking</li>
                      <li>• Qualification validation</li>
                      <li>• Conflict detection and prevention</li>
                      <li>• Automatic status updates</li>
                      <li>• Historical assignment tracking</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-semibold flex items-center mb-3">
                <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                Viewing & Monitoring
              </h5>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-lg border">
                  <h6 className="font-semibold text-gray-800 mb-2">
                    Daily View
                  </h6>
                  <p className="text-sm text-gray-600 mb-2">
                    View all assignments for a specific day with employee and
                    station details.
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Time-based assignment grid</li>
                    <li>• Employee names and roles</li>
                    <li>• Station status indicators</li>
                    <li>• Quick edit and delete options</li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <h6 className="font-semibold text-gray-800 mb-2">
                    Weekly View
                  </h6>
                  <p className="text-sm text-gray-600 mb-2">
                    Comprehensive weekly overview with pattern analysis and
                    capacity planning.
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• 7-day assignment calendar</li>
                    <li>• Workload distribution analysis</li>
                    <li>• Capacity utilization metrics</li>
                    <li>• Export to Excel functionality</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-semibold flex items-center mb-3">
                <Users className="h-4 w-4 mr-2 text-purple-500" />
                Administrative Controls
              </h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-semibold text-gray-800 mb-2">
                      Admin Functions
                    </h6>
                    <ul className="space-y-1 text-sm">
                      <li>• Create new station assignments</li>
                      <li>• Edit existing assignments</li>
                      <li>• Delete assignments when needed</li>
                      <li>• View assignment history</li>
                      <li>• Monitor assignment conflicts</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-semibold text-gray-800 mb-2">
                      User Functions
                    </h6>
                    <ul className="space-y-1 text-sm">
                      <li>• View assigned stations</li>
                      <li>• Check assignment status</li>
                      <li>• View schedule details</li>
                      <li>• Access station information</li>
                      <li>• Report issues or conflicts</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h5 className="font-semibold text-yellow-800 mb-2 flex items-center">
                <RefreshCw className="h-4 w-4 mr-2" />
                Real-time Features
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <strong>Live Updates:</strong>
                  <ul className="ml-4 space-y-1">
                    <li>• Assignment status changes instantly</li>
                    <li>• Real-time availability updates</li>
                    <li>• Automatic conflict detection</li>
                  </ul>
                </div>
                <div>
                  <strong>Monitoring:</strong>
                  <ul className="ml-4 space-y-1">
                    <li>• Live station status tracking</li>
                    <li>• Employee activity monitoring</li>
                    <li>• Performance metrics updates</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "advanced-features",
      title: "Advanced Features",
      icon: <Zap className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-semibold text-indigo-800 mb-2">
              Advanced System Features
            </h4>
            <p className="text-indigo-700">
              Explore advanced features including MQTT integration, real-time
              monitoring, mobile responsiveness, and accessibility features.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="font-semibold flex items-center mb-3">
                <Activity className="h-4 w-4 mr-2 text-green-500" />
                MQTT Real-time Integration
              </h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-3">
                  The system uses MQTT protocol for real-time communication
                  between devices and services.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-semibold text-gray-800 mb-2">
                      MQTT Features
                    </h6>
                    <ul className="space-y-1 text-sm">
                      <li>• Real-time data transmission</li>
                      <li>• Device-to-cloud communication</li>
                      <li>• Automatic data synchronization</li>
                      <li>• Live production monitoring</li>
                      <li>• Instant quality updates</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-semibold text-gray-800 mb-2">
                      Data Flow
                    </h6>
                    <ul className="space-y-1 text-sm">
                      <li>• Production devices → MQTT broker</li>
                      <li>• Broker → Migdalor system</li>
                      <li>• Real-time dashboard updates</li>
                      <li>• Automatic database storage</li>
                      <li>• Live chart updates</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-semibold flex items-center mb-3">
                <Smartphone className="h-4 w-4 mr-2 text-blue-500" />
                Mobile Responsiveness
              </h5>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-lg border">
                  <h6 className="font-semibold text-gray-800 mb-2">
                    Responsive Design
                  </h6>
                  <p className="text-sm text-gray-600 mb-2">
                    The system automatically adapts to different screen sizes
                    and devices.
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Mobile phones (320px+)</li>
                    <li>• Tablets (768px+)</li>
                    <li>• Desktop computers (1024px+)</li>
                    <li>• Large displays (1440px+)</li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <h6 className="font-semibold text-gray-800 mb-2">
                    Touch Optimization
                  </h6>
                  <p className="text-sm text-gray-600 mb-2">
                    Optimized for touch interactions on mobile devices.
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Large touch targets (44px minimum)</li>
                    <li>• Swipe gestures for navigation</li>
                    <li>• Pinch-to-zoom on charts</li>
                    <li>• Touch-friendly form controls</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-semibold flex items-center mb-3">
                <Globe className="h-4 w-4 mr-2 text-purple-500" />
                Internationalization & Accessibility
              </h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-semibold text-gray-800 mb-2">
                      Language Support
                    </h6>
                    <ul className="space-y-1 text-sm">
                      <li>• English (default)</li>
                      <li>• Hebrew (RTL support)</li>
                      <li>• Automatic language detection</li>
                      <li>• Persistent language preference</li>
                      <li>• Real-time language switching</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-semibold text-gray-800 mb-2">
                      Accessibility Features
                    </h6>
                    <ul className="space-y-1 text-sm">
                      <li>• Keyboard navigation support</li>
                      <li>• Screen reader compatibility</li>
                      <li>• High contrast mode</li>
                      <li>• Focus indicators</li>
                      <li>• ARIA labels and descriptions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-semibold flex items-center mb-3">
                <Eye className="h-4 w-4 mr-2 text-orange-500" />
                Theme System
              </h5>
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-sm text-gray-600 mb-3">
                  The system supports both light and dark themes with automatic
                  switching capabilities.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-gray-100 p-3 rounded">
                    <h6 className="font-semibold text-gray-800 mb-1">
                      Light Theme
                    </h6>
                    <p className="text-xs text-gray-600">
                      Clean, bright interface for daytime use
                    </p>
                  </div>
                  <div className="bg-gray-800 text-white p-3 rounded">
                    <h6 className="font-semibold mb-1">Dark Theme</h6>
                    <p className="text-xs text-gray-300">
                      Reduced eye strain for low-light environments
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h5 className="font-semibold text-yellow-800 mb-2 flex items-center">
                <RefreshCw className="h-4 w-4 mr-2" />
                Performance Features
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <strong>Optimization:</strong>
                  <ul className="ml-4 space-y-1">
                    <li>• Lazy loading for charts</li>
                    <li>• Efficient data caching</li>
                    <li>• Optimized API calls</li>
                    <li>• Fast page transitions</li>
                  </ul>
                </div>
                <div>
                  <strong>Monitoring:</strong>
                  <ul className="ml-4 space-y-1">
                    <li>• Real-time performance metrics</li>
                    <li>• Error tracking and reporting</li>
                    <li>• System health monitoring</li>
                    <li>• Automatic error recovery</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "keyboard-shortcuts",
      title: "Keyboard Shortcuts & Tips",
      icon: <Target className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-teal-50 p-4 rounded-lg">
            <h4 className="font-semibold text-teal-800 mb-2">
              Keyboard Shortcuts & Pro Tips
            </h4>
            <p className="text-teal-700">
              Master the system with keyboard shortcuts, efficiency tips, and
              best practices for optimal productivity.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="font-semibold flex items-center mb-3">
                <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                Keyboard Shortcuts
              </h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-semibold text-gray-800 mb-2">
                      Navigation
                    </h6>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Go to Home</span>
                        <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">
                          Alt + H
                        </kbd>
                      </div>
                      <div className="flex justify-between">
                        <span>Go to Employees</span>
                        <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">
                          Alt + E
                        </kbd>
                      </div>
                      <div className="flex justify-between">
                        <span>Go to Production</span>
                        <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">
                          Alt + P
                        </kbd>
                      </div>
                      <div className="flex justify-between">
                        <span>Go to Reports</span>
                        <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">
                          Alt + R
                        </kbd>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h6 className="font-semibold text-gray-800 mb-2">
                      Actions
                    </h6>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Search</span>
                        <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">
                          Ctrl + F
                        </kbd>
                      </div>
                      <div className="flex justify-between">
                        <span>Refresh Data</span>
                        <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">
                          F5
                        </kbd>
                      </div>
                      <div className="flex justify-between">
                        <span>Export</span>
                        <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">
                          Ctrl + E
                        </kbd>
                      </div>
                      <div className="flex justify-between">
                        <span>Toggle Theme</span>
                        <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">
                          Ctrl + T
                        </kbd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-semibold flex items-center mb-3">
                <Star className="h-4 w-4 mr-2 text-blue-500" />
                Pro Tips & Best Practices
              </h5>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-lg border">
                  <h6 className="font-semibold text-gray-800 mb-2">
                    Dashboard Optimization
                  </h6>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>
                      • Use the dashboard cards to quickly navigate to filtered
                      views
                    </li>
                    <li>
                      • Click on "Active Workers" to see only working employees
                    </li>
                    <li>
                      • Monitor quality trends using the interactive charts
                    </li>
                    <li>• Set up bookmarks for frequently accessed reports</li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <h6 className="font-semibold text-gray-800 mb-2">
                    Report Generation
                  </h6>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>
                      • Use custom date ranges to compare different periods
                    </li>
                    <li>
                      • Filter by specific employees to analyze individual
                      performance
                    </li>
                    <li>• Export reports regularly for backup and analysis</li>
                    <li>
                      • Use the reset button to clear filters and start fresh
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <h6 className="font-semibold text-gray-800 mb-2">
                    Production Monitoring
                  </h6>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>
                      • Check production data multiple times per day for
                      real-time insights
                    </li>
                    <li>• Use the "Today" filter for current day monitoring</li>
                    <li>• Export CSV data for detailed analysis in Excel</li>
                    <li>
                      • Monitor quality trends to identify improvement
                      opportunities
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-semibold flex items-center mb-3">
                <Award className="h-4 w-4 mr-2 text-green-500" />
                Efficiency Tips
              </h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-semibold text-gray-800 mb-2">
                      Data Management
                    </h6>
                    <ul className="space-y-1 text-sm">
                      <li>
                        • Use search filters to quickly find specific data
                      </li>
                      <li>• Sort columns by clicking headers</li>
                      <li>• Export data regularly for backup</li>
                      <li>• Use date filters to focus on relevant periods</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-semibold text-gray-800 mb-2">
                      System Usage
                    </h6>
                    <ul className="space-y-1 text-sm">
                      <li>
                        • Keep the system open in a browser tab for quick access
                      </li>
                      <li>• Use keyboard shortcuts for faster navigation</li>
                      <li>• Enable notifications for important updates</li>
                      <li>• Bookmark frequently used pages</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-semibold text-blue-800 mb-2 flex items-center">
                <Info className="h-4 w-4 mr-2" />
                System Maintenance
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <strong>Regular Tasks:</strong>
                  <ul className="ml-4 space-y-1">
                    <li>• Clear browser cache monthly</li>
                    <li>• Update browser to latest version</li>
                    <li>• Check internet connection stability</li>
                    <li>• Log out when not in use</li>
                  </ul>
                </div>
                <div>
                  <strong>Performance:</strong>
                  <ul className="ml-4 space-y-1">
                    <li>• Close unused browser tabs</li>
                    <li>• Restart browser if system feels slow</li>
                    <li>• Use Chrome or Firefox for best performance</li>
                    <li>• Enable JavaScript for full functionality</li>
                  </ul>
                </div>
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
              System Settings & Configuration
            </h4>
            <p className="text-gray-700">
              Comprehensive settings management for personal preferences,
              account configuration, and system administration with role-based
              access controls.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="font-semibold flex items-center mb-3">
                <Globe className="h-4 w-4 mr-2 text-blue-500" />
                Language & Internationalization
              </h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-semibold text-gray-800 mb-2">
                      Language Options
                    </h6>
                    <div className="space-y-2">
                      <div className="bg-white p-3 rounded border">
                        <div className="flex items-center justify-between">
                          <div>
                            <h6 className="font-semibold text-gray-800">
                              English
                            </h6>
                            <p className="text-xs text-gray-600">
                              Default language with LTR support
                            </p>
                          </div>
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold">EN</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <div className="flex items-center justify-between">
                          <div>
                            <h6 className="font-semibold text-gray-800">
                              Hebrew
                            </h6>
                            <p className="text-xs text-gray-600">
                              RTL language support
                            </p>
                          </div>
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-bold">עב</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h6 className="font-semibold text-gray-800 mb-2">
                      Language Features
                    </h6>
                    <ul className="space-y-1 text-sm">
                      <li>
                        • <strong>Auto-save:</strong> Language preference saved
                        automatically
                      </li>
                      <li>
                        • <strong>Real-time switching:</strong> Changes apply
                        immediately
                      </li>
                      <li>
                        • <strong>RTL Support:</strong> Right-to-left layout for
                        Hebrew
                      </li>
                      <li>
                        • <strong>Browser Detection:</strong> Automatic language
                        detection
                      </li>
                      <li>
                        • <strong>Persistent:</strong> Remembers choice across
                        sessions
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-semibold flex items-center mb-3">
                <Eye className="h-4 w-4 mr-2 text-purple-500" />
                Theme & Visual Preferences
              </h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-semibold text-gray-800 mb-2">
                      Theme Options
                    </h6>
                    <div className="space-y-2">
                      <div className="bg-white p-3 rounded border">
                        <div className="flex items-center justify-between">
                          <div>
                            <h6 className="font-semibold text-gray-800">
                              Light Theme
                            </h6>
                            <p className="text-xs text-gray-600">
                              Clean, bright interface for daytime use
                            </p>
                          </div>
                          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Sun className="h-4 w-4 text-yellow-600" />
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-800 text-white p-3 rounded border">
                        <div className="flex items-center justify-between">
                          <div>
                            <h6 className="font-semibold">Dark Theme</h6>
                            <p className="text-xs text-gray-300">
                              Reduced eye strain for low-light environments
                            </p>
                          </div>
                          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                            <Moon className="h-4 w-4 text-gray-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h6 className="font-semibold text-gray-800 mb-2">
                      Theme Features
                    </h6>
                    <ul className="space-y-1 text-sm">
                      <li>
                        • <strong>Instant switching:</strong> Changes apply
                        immediately
                      </li>
                      <li>
                        • <strong>System preference:</strong> Follows OS theme
                        setting
                      </li>
                      <li>
                        • <strong>Persistent:</strong> Remembers choice across
                        sessions
                      </li>
                      <li>
                        • <strong>Accessibility:</strong> High contrast support
                      </li>
                      <li>
                        • <strong>Consistent:</strong> All components follow
                        theme
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-semibold flex items-center mb-3">
                <Shield className="h-4 w-4 mr-2 text-green-500" />
                Account Management & Security
              </h5>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-lg border">
                  <h6 className="font-semibold text-gray-800 mb-2">
                    Personal Account Settings
                  </h6>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h6 className="font-semibold text-gray-700 mb-1">
                        Profile Management
                      </h6>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Update personal information</li>
                        <li>• Change contact details</li>
                        <li>• Modify display preferences</li>
                        <li>• Set notification preferences</li>
                      </ul>
                    </div>
                    <div>
                      <h6 className="font-semibold text-gray-700 mb-1">
                        Security Settings
                      </h6>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Change password regularly</li>
                        <li>• View login history</li>
                        <li>• Manage active sessions</li>
                        <li>• Enable two-factor authentication</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <h6 className="font-semibold text-gray-800 mb-2">
                    Account Status & Permissions
                  </h6>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h6 className="font-semibold text-gray-700 mb-1">
                        Account Information
                      </h6>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• View account status (Active/Inactive)</li>
                        <li>• Check role permissions</li>
                        <li>• Review access levels</li>
                        <li>• Monitor account activity</li>
                      </ul>
                    </div>
                    <div>
                      <h6 className="font-semibold text-gray-700 mb-1">
                        Session Management
                      </h6>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• View active sessions</li>
                        <li>• Log out from all devices</li>
                        <li>• Manage session timeouts</li>
                        <li>• Monitor login attempts</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-semibold flex items-center mb-3">
                <Users className="h-4 w-4 mr-2 text-purple-500" />
                User Management (Admin Only)
              </h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-semibold text-gray-800 mb-2">
                      User Administration
                    </h6>
                    <ul className="space-y-1 text-sm">
                      <li>
                        • <strong>Create Users:</strong> Add new system users
                        with roles
                      </li>
                      <li>
                        • <strong>Edit Users:</strong> Modify user information
                        and permissions
                      </li>
                      <li>
                        • <strong>Delete Users:</strong> Remove users from the
                        system
                      </li>
                      <li>
                        • <strong>View All Users:</strong> Complete user
                        directory
                      </li>
                      <li>
                        • <strong>Role Management:</strong> Assign and modify
                        user roles
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-semibold text-gray-800 mb-2">
                      Security Controls
                    </h6>
                    <ul className="space-y-1 text-sm">
                      <li>
                        • <strong>Password Reset:</strong> Reset user passwords
                      </li>
                      <li>
                        • <strong>Account Lock/Unlock:</strong> Manage account
                        status
                      </li>
                      <li>
                        • <strong>Permission Audit:</strong> Review user access
                        levels
                      </li>
                      <li>
                        • <strong>Activity Monitoring:</strong> Track user
                        actions
                      </li>
                      <li>
                        • <strong>Bulk Operations:</strong> Manage multiple
                        users
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-yellow-50 rounded">
                  <p className="text-xs text-yellow-800">
                    <strong>Admin Note:</strong> User management features are
                    only available to users with administrator privileges.
                    Regular users can only view and modify their own account
                    settings.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-semibold flex items-center mb-3">
                <Activity className="h-4 w-4 mr-2 text-orange-500" />
                System Preferences & Notifications
              </h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-semibold text-gray-800 mb-2">
                      Notification Settings
                    </h6>
                    <ul className="space-y-1 text-sm">
                      <li>
                        • <strong>Email Notifications:</strong> Configure email
                        alerts
                      </li>
                      <li>
                        • <strong>Browser Notifications:</strong> Enable/disable
                        popup alerts
                      </li>
                      <li>
                        • <strong>System Alerts:</strong> Set up system-wide
                        notifications
                      </li>
                      <li>
                        • <strong>Frequency Control:</strong> Manage
                        notification frequency
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-semibold text-gray-800 mb-2">
                      Display Preferences
                    </h6>
                    <ul className="space-y-1 text-sm">
                      <li>
                        • <strong>Date Format:</strong> Choose date display
                        format
                      </li>
                      <li>
                        • <strong>Time Zone:</strong> Set local time zone
                      </li>
                      <li>
                        • <strong>Number Format:</strong> Configure number
                        display
                      </li>
                      <li>
                        • <strong>Chart Preferences:</strong> Set default chart
                        types
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-semibold text-blue-800 mb-2 flex items-center">
                <Info className="h-4 w-4 mr-2" />
                Settings Best Practices
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <strong>Security Recommendations:</strong>
                  <ul className="ml-4 space-y-1">
                    <li>• Change password every 90 days</li>
                    <li>• Use strong, unique passwords</li>
                    <li>• Log out when not in use</li>
                    <li>• Monitor account activity regularly</li>
                  </ul>
                </div>
                <div>
                  <strong>Performance Tips:</strong>
                  <ul className="ml-4 space-y-1">
                    <li>• Choose appropriate theme for environment</li>
                    <li>• Set language preference early</li>
                    <li>• Configure notifications to avoid spam</li>
                    <li>• Review settings after system updates</li>
                  </ul>
                </div>
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
              Comprehensive Troubleshooting Guide
            </h4>
            <p className="text-red-700">
              If you encounter any issues while using Migdalor, refer to this
              comprehensive troubleshooting guide with step-by-step solutions.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="font-semibold text-orange-600 mb-3 flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Authentication & Login Issues
              </h5>
              <div className="space-y-3">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h6 className="font-semibold text-orange-800 mb-2">
                    Cannot Log In
                  </h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start space-x-2">
                      <span className="text-orange-600 font-bold">1.</span>
                      <div>
                        <strong>Check Credentials:</strong> Verify username and
                        password are correct
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-orange-600 font-bold">2.</span>
                      <div>
                        <strong>Check Caps Lock:</strong> Ensure Caps Lock is
                        not enabled
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-orange-600 font-bold">3.</span>
                      <div>
                        <strong>Clear Browser Cache:</strong> Clear cookies and
                        cache, then try again
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-orange-600 font-bold">4.</span>
                      <div>
                        <strong>Contact Administrator:</strong> If problem
                        persists, contact system admin
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h6 className="font-semibold text-orange-800 mb-2">
                    Account Locked
                  </h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start space-x-2">
                      <span className="text-orange-600 font-bold">1.</span>
                      <div>
                        <strong>Wait Period:</strong> Wait 15 minutes before
                        attempting to log in again
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-orange-600 font-bold">2.</span>
                      <div>
                        <strong>Contact Admin:</strong> Request account unlock
                        from administrator
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-orange-600 font-bold">3.</span>
                      <div>
                        <strong>Password Reset:</strong> Request password reset
                        if needed
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-semibold text-blue-600 mb-3 flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Performance & Loading Issues
              </h5>
              <div className="space-y-3">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h6 className="font-semibold text-blue-800 mb-2">
                    Slow Loading
                  </h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-600 font-bold">1.</span>
                      <div>
                        <strong>Check Internet:</strong> Verify stable internet
                        connection
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-600 font-bold">2.</span>
                      <div>
                        <strong>Refresh Page:</strong> Press F5 or Ctrl+R to
                        refresh
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-600 font-bold">3.</span>
                      <div>
                        <strong>Close Tabs:</strong> Close unnecessary browser
                        tabs
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-600 font-bold">4.</span>
                      <div>
                        <strong>Restart Browser:</strong> Close and reopen
                        browser completely
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h6 className="font-semibold text-blue-800 mb-2">
                    Charts Not Displaying
                  </h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-600 font-bold">1.</span>
                      <div>
                        <strong>Enable JavaScript:</strong> Ensure JavaScript is
                        enabled in browser
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-600 font-bold">2.</span>
                      <div>
                        <strong>Clear Cache:</strong> Clear browser cache and
                        cookies
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-600 font-bold">3.</span>
                      <div>
                        <strong>Disable Ad Blockers:</strong> Temporarily
                        disable ad blockers
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-600 font-bold">4.</span>
                      <div>
                        <strong>Try Different Browser:</strong> Test with Chrome
                        or Firefox
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-semibold text-purple-600 mb-3 flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Data & Export Issues
              </h5>
              <div className="space-y-3">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h6 className="font-semibold text-purple-800 mb-2">
                    Missing Data
                  </h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start space-x-2">
                      <span className="text-purple-600 font-bold">1.</span>
                      <div>
                        <strong>Check Date Filters:</strong> Verify date range
                        includes data period
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-purple-600 font-bold">2.</span>
                      <div>
                        <strong>Refresh Data:</strong> Click refresh button or
                        press F5
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-purple-600 font-bold">3.</span>
                      <div>
                        <strong>Check Filters:</strong> Clear all filters and
                        try again
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-purple-600 font-bold">4.</span>
                      <div>
                        <strong>Contact Support:</strong> Report missing data to
                        administrator
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h6 className="font-semibold text-purple-800 mb-2">
                    Export Not Working
                  </h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start space-x-2">
                      <span className="text-purple-600 font-bold">1.</span>
                      <div>
                        <strong>Disable Popup Blockers:</strong> Allow popups
                        for this site
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-purple-600 font-bold">2.</span>
                      <div>
                        <strong>Check Downloads:</strong> Look in browser
                        downloads folder
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-purple-600 font-bold">3.</span>
                      <div>
                        <strong>Try Different Browser:</strong> Use Chrome or
                        Firefox
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-purple-600 font-bold">4.</span>
                      <div>
                        <strong>Check Storage:</strong> Ensure sufficient disk
                        space
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-semibold text-green-600 mb-3 flex items-center">
                <Monitor className="h-4 w-4 mr-2" />
                Browser & Compatibility Issues
              </h5>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-semibold text-green-800 mb-2">
                      Recommended Browsers
                    </h6>
                    <ul className="space-y-1 text-sm">
                      <li>
                        • <strong>Chrome:</strong> Version 90+ (Best
                        performance)
                      </li>
                      <li>
                        • <strong>Firefox:</strong> Version 88+ (Good
                        compatibility)
                      </li>
                      <li>
                        • <strong>Safari:</strong> Version 14+ (Mac users)
                      </li>
                      <li>
                        • <strong>Edge:</strong> Version 90+ (Windows users)
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-semibold text-green-800 mb-2">
                      System Requirements
                    </h6>
                    <ul className="space-y-1 text-sm">
                      <li>
                        • <strong>JavaScript:</strong> Must be enabled
                      </li>
                      <li>
                        • <strong>Cookies:</strong> Must be allowed
                      </li>
                      <li>
                        • <strong>Screen:</strong> Minimum 1024x768 resolution
                      </li>
                      <li>
                        • <strong>Internet:</strong> Stable broadband connection
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-semibold text-teal-600 mb-3 flex items-center">
                <Smartphone className="h-4 w-4 mr-2" />
                Mobile & Responsive Issues
              </h5>
              <div className="bg-teal-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-semibold text-teal-800 mb-2">
                      Mobile Optimization
                    </h6>
                    <ul className="space-y-1 text-sm">
                      <li>
                        • <strong>Touch Targets:</strong> All buttons are
                        touch-friendly
                      </li>
                      <li>
                        • <strong>Responsive Design:</strong> Adapts to screen
                        size
                      </li>
                      <li>
                        • <strong>Orientation:</strong> Works in portrait and
                        landscape
                      </li>
                      <li>
                        • <strong>Performance:</strong> Optimized for mobile
                        devices
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-semibold text-teal-800 mb-2">
                      Mobile Troubleshooting
                    </h6>
                    <ul className="space-y-1 text-sm">
                      <li>
                        • <strong>Zoom:</strong> Pinch to zoom on charts
                      </li>
                      <li>
                        • <strong>Scroll:</strong> Swipe to navigate
                      </li>
                      <li>
                        • <strong>Refresh:</strong> Pull down to refresh data
                      </li>
                      <li>
                        • <strong>Cache:</strong> Clear mobile browser cache
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h5 className="font-semibold text-yellow-800 mb-2 flex items-center">
                <Info className="h-4 w-4 mr-2" />
                Still Need Help?
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <strong>Contact Support:</strong>
                  <ul className="ml-4 space-y-1">
                    <li>• Email your system administrator</li>
                    <li>• Include error messages and screenshots</li>
                    <li>• Describe steps that led to the issue</li>
                    <li>• Mention your browser and device type</li>
                  </ul>
                </div>
                <div>
                  <strong>Emergency Procedures:</strong>
                  <ul className="ml-4 space-y-1">
                    <li>• Try accessing from different device</li>
                    <li>• Use incognito/private browsing mode</li>
                    <li>• Check if other users have same issue</li>
                    <li>• Document issue for technical support</li>
                  </ul>
                </div>
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
