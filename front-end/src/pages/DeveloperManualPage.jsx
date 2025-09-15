import React, { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Navbar from "@components/Navbar";
import {
  Download,
  BookOpen,
  Database,
  Code,
  Server,
  Cloud,
  Settings,
  Terminal,
  GitBranch,
  Monitor,
  FileText,
  ArrowDown,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Info,
  Shield,
  Zap,
  Target,
  Clock,
  Award,
  Star,
  RefreshCw,
  Eye,
  EyeOff,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Activity,
  Users,
  BarChart3,
  TrendingUp,
} from "lucide-react";

const DeveloperManualPage = () => {
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
      await new Promise((resolve) => setTimeout(resolve, 1000));

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
      } catch (html2canvasError) {
        console.warn(
          "html2canvas failed, using fallback method:",
          html2canvasError
        );

        const pdf = new jsPDF("p", "mm", "a4");

        pdf.setFontSize(24);
        pdf.text("Migdalor Developer Manual", 20, 20);

        pdf.setFontSize(16);
        pdf.text("Complete Technical Documentation", 20, 30);

        pdf.setFontSize(12);
        pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 40);

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
          "1. System Architecture",
          "Migdalor is a full-stack production management system built with React frontend and Node.js/Express backend."
        );
        addSection(
          "2. Database Schema",
          "MongoDB with Mongoose ODM. Collections include Users, Employees, Stations, Assignments, Qualifications, WorkingStations, Departments, and Products."
        );
        addSection(
          "3. API Endpoints",
          "RESTful API with authentication, CRUD operations for all entities, and specialized report generation endpoints."
        );
        addSection(
          "4. Authentication",
          "JWT-based authentication with bcrypt password hashing and role-based access control."
        );
        addSection(
          "5. Frontend Architecture",
          "React 19 with Vite, TypeScript, Tailwind CSS, Chart.js for visualizations, and i18n support."
        );
        addSection(
          "6. Deployment",
          "Docker containerization, MongoDB Atlas cloud database, and production deployment configurations."
        );

        const fileName = `migdalor-developer-manual-${
          new Date().toISOString().split("T")[0]
        }.pdf`;
        pdf.save(fileName);
        return;
      }

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      const fileName = `migdalor-developer-manual-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(`Error generating PDF: ${error.message}`);
    } finally {
      setExporting(false);
    }
  };

  const sections = [
    {
      id: "system-overview",
      title: "System Architecture",
      icon: <Monitor className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">
              Migdalor Production Management System
            </h4>
            <p className="text-blue-700">
              A comprehensive full-stack application for managing production
              operations, employee assignments, and quality tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h5 className="font-semibold flex items-center">
                <Terminal className="h-4 w-4 mr-2 text-green-500" />
                Backend Technologies
              </h5>
              <ul className="space-y-2 text-sm">
                <li>• Node.js 18+ with Express.js</li>
                <li>• MongoDB with Mongoose ODM</li>
                <li>• JWT authentication</li>
                <li>• bcrypt password hashing</li>
                <li>• MQTT for real-time communication</li>
                <li>• RESTful API design</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h5 className="font-semibold flex items-center">
                <Monitor className="h-4 w-4 mr-2 text-blue-500" />
                Frontend Technologies
              </h5>
              <ul className="space-y-2 text-sm">
                <li>• React 19 with Vite</li>
                <li>• Tailwind CSS for styling</li>
                <li>• Chart.js for visualizations</li>
                <li>• React Router for navigation</li>
                <li>• i18next for internationalization</li>
                <li>• Axios for API communication</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-semibold text-gray-800 mb-2">
              System Characteristics
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="bg-white p-3 rounded">
                <strong>Scalability:</strong> Microservices-ready architecture
              </div>
              <div className="bg-white p-3 rounded">
                <strong>Security:</strong> JWT authentication, CORS protection
              </div>
              <div className="bg-white p-3 rounded">
                <strong>Performance:</strong> Optimized queries, caching support
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h5 className="font-semibold text-red-800 mb-3 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security Implementation
            </h5>
            <div className="space-y-3 text-sm">
              <div>
                <h6 className="font-semibold text-red-700 mb-1">
                  Authentication & Authorization
                </h6>
                <ul className="text-red-600 space-y-1 ml-4">
                  <li>
                    • JWT-based authentication with configurable expiration
                  </li>
                  <li>• bcrypt password hashing with salt rounds</li>
                  <li>• Role-based access control (Admin/User roles)</li>
                  <li>• Protected routes and API endpoints</li>
                </ul>
              </div>
              <div>
                <h6 className="font-semibold text-red-700 mb-1">
                  Data Protection
                </h6>
                <ul className="text-red-600 space-y-1 ml-4">
                  <li>• Environment variables for sensitive configuration</li>
                  <li>• CORS protection for cross-origin requests</li>
                  <li>• Input validation and sanitization</li>
                  <li>• Secure database connections (MongoDB Atlas)</li>
                </ul>
              </div>
              <div>
                <h6 className="font-semibold text-red-700 mb-1">
                  Production Security
                </h6>
                <ul className="text-red-600 space-y-1 ml-4">
                  <li>• HTTPS enforcement in production</li>
                  <li>• Database IP whitelisting</li>
                  <li>• Regular security updates and monitoring</li>
                  <li>
                    • Secure secret management (AWS Secrets Manager recommended)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "database-schema",
      title: "Database Schema",
      icon: <Database className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">
              MongoDB Collections
            </h4>
            <p className="text-green-700">
              The system uses MongoDB Atlas with the following collections for
              data management.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white border rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Users className="h-4 w-4 mr-2 text-blue-500" />
                Users Collection
              </h5>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-left">Field</th>
                      <th className="px-3 py-2 text-left">Type</th>
                      <th className="px-3 py-2 text-left">Required</th>
                      <th className="px-3 py-2 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-3 py-2 font-mono">_id</td>
                      <td className="px-3 py-2">ObjectId</td>
                      <td className="px-3 py-2">Yes</td>
                      <td className="px-3 py-2">MongoDB primary key</td>
                    </tr>
                    <tr className="border-t bg-gray-50">
                      <td className="px-3 py-2 font-mono">username</td>
                      <td className="px-3 py-2">String</td>
                      <td className="px-3 py-2">Yes</td>
                      <td className="px-3 py-2">Unique username for login</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-3 py-2 font-mono">password</td>
                      <td className="px-3 py-2">String</td>
                      <td className="px-3 py-2">Yes</td>
                      <td className="px-3 py-2">bcrypt hashed password</td>
                    </tr>
                    <tr className="border-t bg-gray-50">
                      <td className="px-3 py-2 font-mono">isAdmin</td>
                      <td className="px-3 py-2">Boolean</td>
                      <td className="px-3 py-2">No</td>
                      <td className="px-3 py-2">Admin privileges flag</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-3 py-2 font-mono">createdAt</td>
                      <td className="px-3 py-2">Date</td>
                      <td className="px-3 py-2">Auto</td>
                      <td className="px-3 py-2">Record creation timestamp</td>
                    </tr>
                    <tr className="border-t bg-gray-50">
                      <td className="px-3 py-2 font-mono">updatedAt</td>
                      <td className="px-3 py-2">Date</td>
                      <td className="px-3 py-2">Auto</td>
                      <td className="px-3 py-2">Record update timestamp</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Users className="h-4 w-4 mr-2 text-green-500" />
                Employees Collection
              </h5>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-left">Field</th>
                      <th className="px-3 py-2 text-left">Type</th>
                      <th className="px-3 py-2 text-left">Required</th>
                      <th className="px-3 py-2 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-3 py-2 font-mono">_id</td>
                      <td className="px-3 py-2">ObjectId</td>
                      <td className="px-3 py-2">Yes</td>
                      <td className="px-3 py-2">MongoDB primary key</td>
                    </tr>
                    <tr className="border-t bg-gray-50">
                      <td className="px-3 py-2 font-mono">person_id</td>
                      <td className="px-3 py-2">String</td>
                      <td className="px-3 py-2">Yes</td>
                      <td className="px-3 py-2">Unique employee identifier</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-3 py-2 font-mono">first_name</td>
                      <td className="px-3 py-2">String</td>
                      <td className="px-3 py-2">Yes</td>
                      <td className="px-3 py-2">Employee first name</td>
                    </tr>
                    <tr className="border-t bg-gray-50">
                      <td className="px-3 py-2 font-mono">last_name</td>
                      <td className="px-3 py-2">String</td>
                      <td className="px-3 py-2">Yes</td>
                      <td className="px-3 py-2">Employee last name</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-3 py-2 font-mono">email</td>
                      <td className="px-3 py-2">String</td>
                      <td className="px-3 py-2">No</td>
                      <td className="px-3 py-2">Contact email address</td>
                    </tr>
                    <tr className="border-t bg-gray-50">
                      <td className="px-3 py-2 font-mono">phone</td>
                      <td className="px-3 py-2">String</td>
                      <td className="px-3 py-2">No</td>
                      <td className="px-3 py-2">Contact phone number</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-3 py-2 font-mono">department</td>
                      <td className="px-3 py-2">String</td>
                      <td className="px-3 py-2">No</td>
                      <td className="px-3 py-2">Employee department</td>
                    </tr>
                    <tr className="border-t bg-gray-50">
                      <td className="px-3 py-2 font-mono">role</td>
                      <td className="px-3 py-2">String</td>
                      <td className="px-3 py-2">No</td>
                      <td className="px-3 py-2">Job role/title</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-3 py-2 font-mono">status</td>
                      <td className="px-3 py-2">String</td>
                      <td className="px-3 py-2">No</td>
                      <td className="px-3 py-2">
                        Employee status (active/inactive)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Settings className="h-4 w-4 mr-2 text-purple-500" />
                Stations Collection
              </h5>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-left">Field</th>
                      <th className="px-3 py-2 text-left">Type</th>
                      <th className="px-3 py-2 text-left">Required</th>
                      <th className="px-3 py-2 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-3 py-2 font-mono">_id</td>
                      <td className="px-3 py-2">ObjectId</td>
                      <td className="px-3 py-2">Yes</td>
                      <td className="px-3 py-2">MongoDB primary key</td>
                    </tr>
                    <tr className="border-t bg-gray-50">
                      <td className="px-3 py-2 font-mono">station_id</td>
                      <td className="px-3 py-2">String</td>
                      <td className="px-3 py-2">No</td>
                      <td className="px-3 py-2">Station identifier</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-3 py-2 font-mono">station_name</td>
                      <td className="px-3 py-2">String</td>
                      <td className="px-3 py-2">No</td>
                      <td className="px-3 py-2">Station display name</td>
                    </tr>
                    <tr className="border-t bg-gray-50">
                      <td className="px-3 py-2 font-mono">department</td>
                      <td className="px-3 py-2">String</td>
                      <td className="px-3 py-2">No</td>
                      <td className="px-3 py-2">Associated department</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-3 py-2 font-mono">product_name</td>
                      <td className="px-3 py-2">String</td>
                      <td className="px-3 py-2">No</td>
                      <td className="px-3 py-2">
                        Product manufactured at station
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "api-endpoints",
      title: "API Endpoints",
      icon: <Code className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">
              RESTful API Documentation
            </h4>
            <p className="text-purple-700">
              Complete API endpoint reference for all system operations and data
              management.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white border rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Shield className="h-4 w-4 mr-2 text-blue-500" />
                Authentication Endpoints
              </h5>
              <div className="space-y-2">
                <div className="flex items-center space-x-4 p-2 bg-gray-50 rounded">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-mono">
                    POST
                  </span>
                  <span className="font-mono text-sm">/api/login</span>
                  <span className="text-sm text-gray-600">
                    User authentication (requires username/password)
                  </span>
                </div>
                <div className="flex items-center space-x-4 p-2 bg-gray-50 rounded">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-mono">
                    POST
                  </span>
                  <span className="font-mono text-sm">/api/logout</span>
                  <span className="text-sm text-gray-600">
                    User logout (invalidates JWT)
                  </span>
                </div>
                <div className="flex items-center space-x-4 p-2 bg-gray-50 rounded">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono">
                    GET
                  </span>
                  <span className="font-mono text-sm">/api/me</span>
                  <span className="text-sm text-gray-600">
                    Get current user profile (requires valid JWT)
                  </span>
                </div>
              </div>
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800">
                  <strong>Security:</strong> All authentication endpoints use
                  JWT tokens and bcrypt password hashing. Passwords are never
                  stored in plain text.
                </p>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Users className="h-4 w-4 mr-2 text-green-500" />
                Employee Management Endpoints
              </h5>
              <div className="space-y-2">
                <div className="flex items-center space-x-4 p-2 bg-gray-50 rounded">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono">
                    GET
                  </span>
                  <span className="font-mono text-sm">/api/employees</span>
                  <span className="text-sm text-gray-600">
                    Get all employees
                  </span>
                </div>
                <div className="flex items-center space-x-4 p-2 bg-gray-50 rounded">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-mono">
                    POST
                  </span>
                  <span className="font-mono text-sm">
                    /api/employees/register
                  </span>
                  <span className="text-sm text-gray-600">
                    Create new employee (Admin)
                  </span>
                </div>
                <div className="flex items-center space-x-4 p-2 bg-gray-50 rounded">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-mono">
                    PUT
                  </span>
                  <span className="font-mono text-sm">/api/employees/:id</span>
                  <span className="text-sm text-gray-600">
                    Update employee (Admin)
                  </span>
                </div>
                <div className="flex items-center space-x-4 p-2 bg-gray-50 rounded">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-mono">
                    DELETE
                  </span>
                  <span className="font-mono text-sm">/api/employees/:id</span>
                  <span className="text-sm text-gray-600">
                    Delete employee (Admin)
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Settings className="h-4 w-4 mr-2 text-purple-500" />
                Station Management Endpoints
              </h5>
              <div className="space-y-2">
                <div className="flex items-center space-x-4 p-2 bg-gray-50 rounded">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono">
                    GET
                  </span>
                  <span className="font-mono text-sm">/api/stations</span>
                  <span className="text-sm text-gray-600">
                    Get all stations
                  </span>
                </div>
                <div className="flex items-center space-x-4 p-2 bg-gray-50 rounded">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono">
                    GET
                  </span>
                  <span className="font-mono text-sm">/api/products</span>
                  <span className="text-sm text-gray-600">
                    Get all products
                  </span>
                </div>
                <div className="flex items-center space-x-4 p-2 bg-gray-50 rounded">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-mono">
                    POST
                  </span>
                  <span className="font-mono text-sm">/api/stations</span>
                  <span className="text-sm text-gray-600">
                    Create new station (Admin)
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                <BarChart3 className="h-4 w-4 mr-2 text-orange-500" />
                Reports & Analytics Endpoints
              </h5>
              <div className="space-y-2">
                <div className="flex items-center space-x-4 p-2 bg-gray-50 rounded">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono">
                    GET
                  </span>
                  <span className="font-mono text-sm">/api/report</span>
                  <span className="text-sm text-gray-600">
                    Generate production reports
                  </span>
                </div>
                <div className="flex items-center space-x-4 p-2 bg-gray-50 rounded">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono">
                    GET
                  </span>
                  <span className="font-mono text-sm">/api/dashboard</span>
                  <span className="text-sm text-gray-600">
                    Get dashboard data
                  </span>
                </div>
                <div className="flex items-center space-x-4 p-2 bg-gray-50 rounded">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono">
                    GET
                  </span>
                  <span className="font-mono text-sm">/api/qualifications</span>
                  <span className="text-sm text-gray-600">
                    Get employee qualifications
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "deployment",
      title: "Deployment Guide",
      icon: <Cloud className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-semibold text-orange-800 mb-2">
              Production Deployment
            </h4>
            <p className="text-orange-700">
              Complete guide for deploying the Migdalor system using AWS
              services and MQTT integration.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Zap className="h-4 w-4 mr-2 text-purple-500" />
                MQTT Protocol Integration
              </h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h6 className="font-semibold mb-2">
                  File: services/mqttService.js
                </h6>
                <p className="text-sm mb-3">
                  Our system uses the MQTT protocol to exchange real-time
                  messages between devices and services.
                </p>

                <div className="space-y-3">
                  <div>
                    <h6 className="font-semibold text-sm mb-1">Broker Setup</h6>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>
                        • Default test broker:{" "}
                        <code className="bg-gray-200 px-1 rounded">
                          mqtt://broker.hivemq.com
                        </code>
                      </li>
                      <li>
                        • Test with HiveMQ WebSocket Client:{" "}
                        <a
                          href="https://www.hivemq.com/demos/websocket-client/"
                          className="text-blue-600 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          https://www.hivemq.com/demos/websocket-client/
                        </a>
                      </li>
                      <li>
                        • Custom broker: Set{" "}
                        <code className="bg-gray-200 px-1 rounded">
                          MQTT_BROKER=mqtt://&lt;your-broker-address&gt;
                        </code>{" "}
                        in .env
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h6 className="font-semibold text-sm mb-1">
                      Subscribed Channels
                    </h6>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>
                        • Topic:{" "}
                        <code className="bg-gray-200 px-1 rounded">
                          Braude/Shluker/#
                        </code>
                      </li>
                      <li>
                        • Wildcard # means all messages under Braude/Shluker/*
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h6 className="font-semibold text-sm mb-1">
                      Message Handling
                    </h6>
                    <ol className="text-sm space-y-1 ml-4">
                      <li>1. Message logged in console for debugging</li>
                      <li>
                        2. Message stored in MongoDB collection:{" "}
                        <code className="bg-gray-200 px-1 rounded">
                          mqttMsg
                        </code>
                      </li>
                    </ol>
                  </div>

                  <div>
                    <h6 className="font-semibold text-sm mb-1">
                      Database Storage Format
                    </h6>
                    <div className="bg-black text-green-400 p-3 rounded text-xs font-mono">
                      <div>{"{"}</div>
                      <div> "station_id": "station_001",</div>
                      <div> "User ID": "user_123",</div>
                      <div> "result": 22.5</div>
                      <div>{"}"}</div>
                    </div>
                    <ul className="text-sm space-y-1 ml-4 mt-2">
                      <li>
                        •{" "}
                        <code className="bg-gray-200 px-1 rounded">
                          station_id
                        </code>{" "}
                        → identifies source station/device
                      </li>
                      <li>
                        •{" "}
                        <code className="bg-gray-200 px-1 rounded">
                          User ID
                        </code>{" "}
                        → optional user that triggered event
                      </li>
                      <li>
                        • Other fields depend on use case and stored as raw
                        message
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Monitor className="h-4 w-4 mr-2 text-blue-500" />
                Frontend Deployment - AWS Amplify
              </h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h6 className="font-semibold mb-2">Deployment Steps</h6>
                <ol className="space-y-2 text-sm">
                  <li>
                    1. <strong>Connect GitHub Repository</strong>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• In Amplify console, select "Connect App"</li>
                      <li>• Choose GitHub as source provider</li>
                      <li>• Authenticate and select repository: migdalor</li>
                    </ul>
                  </li>
                  <li>
                    2. <strong>Select Branch</strong>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• Choose branch: main</li>
                    </ul>
                  </li>
                  <li>
                    3. <strong>Monorepo Configuration</strong>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• Enable checkbox: "My app is a monorepo"</li>
                      <li>• Set root directory to: front-end</li>
                    </ul>
                  </li>
                  <li>
                    4. <strong>Finalize & Deploy</strong>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• Review configuration</li>
                      <li>• Click "Save and Deploy"</li>
                      <li>• Each push to main triggers automatic deployment</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </div>

            <div>
              <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Database className="h-4 w-4 mr-2 text-green-500" />
                MongoDB Atlas Database Setup
              </h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ol className="space-y-2 text-sm">
                  <li>
                    1. <strong>Create Project and Cluster</strong>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>
                        • Go to{" "}
                        <a
                          href="https://www.mongodb.com/"
                          className="text-blue-600 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          https://www.mongodb.com/
                        </a>
                      </li>
                      <li>• Create new project and cluster in MongoDB Atlas</li>
                    </ul>
                  </li>
                  <li>
                    2. <strong>Connection String</strong>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• Copy generated connection string to .env file:</li>
                      <li>
                        •{" "}
                        <code className="bg-gray-200 px-1 rounded">
                          MONGODB_URI="mongodb+srv://username:password@your-cluster.mongodb.net/database?retryWrites=true&w=majority&appName=your-app"
                        </code>
                      </li>
                      <li>
                        • Replace username, password, cluster name, and database
                        name with your Atlas credentials
                      </li>
                    </ul>
                  </li>
                  <li>
                    3. <strong>Setup Database (Local Script)</strong>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>
                        • Run:{" "}
                        <code className="bg-gray-200 px-1 rounded">
                          cd backend && node scripts/setup-database.js
                        </code>
                      </li>
                      <li>
                        • Creates required collections and inserts seed data
                      </li>
                    </ul>
                  </li>
                  <li>
                    4. <strong>Seed Data Configuration</strong>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• Sample data from: backend/database/seedData.js</li>
                      <li>
                        • To customize: modify objects in seedData.js (don't
                        delete objects)
                      </li>
                    </ul>
                  </li>
                  <li>
                    5. <strong>Database Network Access</strong>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• Currently accessible from all IPs (0.0.0.0/0)</li>
                      <li>
                        • For security: configure allowed IP addresses in Atlas
                      </li>
                    </ul>
                  </li>
                </ol>

                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h6 className="font-semibold text-red-800 mb-2 flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Security Best Practices
                  </h6>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Use strong, unique passwords for database users</li>
                    <li>• Enable IP whitelisting in MongoDB Atlas</li>
                    <li>• Use environment variables for sensitive data</li>
                    <li>• Never commit credentials to version control</li>
                    <li>• Enable MongoDB Atlas encryption at rest</li>
                    <li>• Regularly rotate database passwords</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Server className="h-4 w-4 mr-2 text-purple-500" />
                Backend Deployment - AWS App Runner
              </h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-3">
                  <div>
                    <h6 className="font-semibold text-sm mb-1">
                      Source Configuration
                    </h6>
                    <ol className="text-sm space-y-1 ml-4">
                      <li>
                        1. In AWS App Runner console, select "Source code
                        repository"
                      </li>
                      <li>2. Connect GitHub repository</li>
                      <li>3. Choose branch: main</li>
                      <li>4. Set source directory to: /back-end</li>
                    </ol>
                  </div>

                  <div>
                    <h6 className="font-semibold text-sm mb-1">
                      Deployment Trigger
                    </h6>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>
                        • Select "Automatic" → new deployments triggered on main
                        branch pushes
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h6 className="font-semibold text-sm mb-1">
                      Runtime and Build Settings
                    </h6>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• Runtime: Node.js 18</li>
                      <li>
                        • Build command:{" "}
                        <code className="bg-gray-200 px-1 rounded">
                          npm install
                        </code>
                      </li>
                      <li>
                        • Start command:{" "}
                        <code className="bg-gray-200 px-1 rounded">
                          node server.js
                        </code>
                      </li>
                      <li>• Port: 8080</li>
                    </ul>
                  </div>

                  <div>
                    <h6 className="font-semibold text-sm mb-1">
                      Environment Variables
                    </h6>

                    <ul className="text-sm space-y-1 ml-4 mt-2">
                      <li>
                        •{" "}
                        <code className="bg-gray-200 px-1 rounded">
                          ATLAS_URI
                        </code>{" "}
                        → MongoDB Atlas connection string
                      </li>
                      <li>
                        • <code className="bg-gray-200 px-1 rounded">PORT</code>{" "}
                        → Node.js server port
                      </li>
                      <li>
                        •{" "}
                        <code className="bg-gray-200 px-1 rounded">
                          MQTT_BROKER
                        </code>{" "}
                        → MQTT broker URL (default: HiveMQ)
                      </li>
                      <li>
                        •{" "}
                        <code className="bg-gray-200 px-1 rounded">
                          JWT_SECRET
                        </code>{" "}
                        → Secret key for JWT tokens
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "development-setup",
      title: "Development Setup",
      icon: <Terminal className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-semibold text-indigo-800 mb-2">
              Local Development Environment
            </h4>
            <p className="text-indigo-700">
              Complete setup guide for developers to run the system locally.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                <GitBranch className="h-4 w-4 mr-2 text-green-500" />
                Prerequisites
              </h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="space-y-2 text-sm">
                  <li>• Node.js 18+ and npm</li>
                  <li>• MongoDB Atlas account or local MongoDB</li>
                  <li>• Git for version control</li>
                  <li>• Code editor (VS Code recommended)</li>
                  <li>• Modern web browser</li>
                </ul>
              </div>
            </div>

            <div>
              <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Terminal className="h-4 w-4 mr-2 text-blue-500" />
                Backend Setup
              </h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h6 className="font-semibold mb-2">Installation Steps</h6>
                <div className="space-y-2 text-sm font-mono bg-black text-green-400 p-3 rounded">
                  <div>cd back-end</div>
                  <div>npm install</div>
                  <div>cp .env.example .env</div>
                  <div># Edit .env with your configuration</div>
                  <div>npm start</div>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Monitor className="h-4 w-4 mr-2 text-purple-500" />
                Frontend Setup
              </h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h6 className="font-semibold mb-2">Development Server</h6>
                <div className="space-y-2 text-sm font-mono bg-black text-green-400 p-3 rounded">
                  <div>cd front-end</div>
                  <div>npm install</div>
                  <div>npm run dev</div>
                  <div># Server runs on http://localhost:5173</div>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Settings className="h-4 w-4 mr-2 text-orange-500" />
                Configuration
              </h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h6 className="font-semibold mb-2">Environment Variables</h6>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600 font-mono">ATLAS_URI</span>
                    <span className="text-gray-600">
                      MongoDB connection string
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600 font-mono">PORT</span>
                    <span className="text-gray-600">
                      Backend server port (default: 3000)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600 font-mono">JWT_SECRET</span>
                    <span className="text-gray-600">
                      Secret key for JWT tokens
                    </span>
                  </div>
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
                <Code className="mr-2 sm:mr-3 text-green-500 h-6 w-6 sm:h-8 sm:w-8" />
                Developer Manual
              </h1>
              <p className="responsive-text theme-text-secondary">
                Complete technical documentation for the Migdalor Production
                Management System
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
          {/* Manual Sections */}
          {sections.map((section, index) => (
            <div key={section.id} className="responsive-card">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <span className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
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
        </div>
      </div>
    </div>
  );
};

export default DeveloperManualPage;
