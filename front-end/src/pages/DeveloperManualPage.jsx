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
  Package,
  Bell,
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
          "Migdalor Production Management System:\nA comprehensive full-stack application for managing production operations, employee assignments, and quality tracking.\n\nBackend Technologies:\n• Node.js 18+ with Express.js\n• MongoDB with Mongoose ODM\n• JWT authentication\n• bcrypt password hashing\n• MQTT for real-time communication\n• RESTful API design\n\nFrontend Technologies:\n• React 19 with Vite\n• Tailwind CSS for styling\n• Chart.js for visualizations\n• React Router for navigation\n• i18next for internationalization\n• Axios for API communication\n\nSystem Characteristics:\n• Scalability: Microservices-ready architecture\n• Security: JWT authentication, CORS protection\n• Performance: Optimized queries, caching support\n\nSecurity Implementation:\nAuthentication & Authorization:\n• JWT-based authentication with configurable expiration\n• bcrypt password hashing with salt rounds\n• Role-based access control (Admin/User roles)\n• Protected routes and API endpoints\n\nData Protection:\n• Environment variables for sensitive configuration\n• CORS protection for cross-origin requests\n• Input validation and sanitization\n• Secure database connections (MongoDB Atlas)\n\nProduction Security:\n• HTTPS enforcement in production\n• Database IP whitelisting\n• Regular security updates and monitoring\n• Secure secret management (AWS Secrets Manager recommended)"
        );

        addSection(
          "2. Database Schema",
          "MongoDB Collections:\nThe system uses MongoDB Atlas with the following collections for data management.\n\nUsers Collection:\n• _id: MongoDB primary key (ObjectId, Required)\n• username: Unique username for login (String, Required)\n• password: bcrypt hashed password (String, Required)\n• isAdmin: Admin privileges flag (Boolean, Optional)\n• createdAt: Record creation timestamp (Date, Auto)\n• updatedAt: Record update timestamp (Date, Auto)\n\nEmployees Collection:\n• _id: MongoDB primary key (ObjectId, Required)\n• person_id: Unique employee identifier (String, Required)\n• first_name: Employee first name (String, Required)\n• last_name: Employee last name (String, Required)\n• email: Contact email address (String, Optional)\n• phone: Contact phone number (String, Optional)\n• department: Employee department (String, Optional)\n• role: Job role/title (String, Optional)\n• status: Employee status active/inactive (String, Optional)\n\nStations Collection:\n• _id: MongoDB primary key (ObjectId, Required)\n• station_id: Station identifier (String, Optional)\n• station_name: Station display name (String, Optional)\n• department: Associated department (String, Optional)\n• product_name: Product manufactured at station (String, Optional)\n\nAdditional Collections:\n• Assignments: Employee station assignments with timestamps\n• Qualifications: Employee skill and certification tracking\n• WorkingStations: Active station assignments and status\n• Departments: Organizational structure and hierarchy\n• Products: Product catalog and specifications\n• mqttMsg: Real-time MQTT message storage\n\nDatabase Relationships:\n• Users can have multiple Employees (one-to-many)\n• Employees can have multiple Assignments (one-to-many)\n• Stations can have multiple Assignments (one-to-many)\n• Employees can have multiple Qualifications (one-to-many)\n• Departments contain multiple Employees (one-to-many)\n• Products are manufactured at specific Stations (one-to-many)\n\nIndexing Strategy:\n• Unique indexes on username, person_id, station_id\n• Compound indexes for common query patterns\n• Text indexes for search functionality\n• TTL indexes for temporary data cleanup"
        );

        addSection(
          "3. API Endpoints",
          "RESTful API Documentation:\nComplete API endpoint reference for all system operations and data management.\n\nAuthentication Endpoints:\n• POST /api/login - User authentication (requires username/password)\n• POST /api/logout - User logout (invalidates JWT)\n• GET /api/me - Get current user profile (requires valid JWT)\n\nSecurity: All authentication endpoints use JWT tokens and bcrypt password hashing. Passwords are never stored in plain text.\n\nEmployee Management Endpoints:\n• GET /api/employees - Get all employees\n• POST /api/employees/register - Create new employee (Admin)\n• PUT /api/employees/:id - Update employee (Admin)\n• DELETE /api/employees/:id - Delete employee (Admin)\n\nStation Management Endpoints:\n• GET /api/stations - Get all stations\n• GET /api/products - Get all products\n• POST /api/stations - Create new station (Admin)\n\nReports & Analytics Endpoints:\n• GET /api/report - Generate production reports\n• GET /api/dashboard - Get dashboard data\n• GET /api/qualifications - Get employee qualifications\n\nAssignment Management Endpoints:\n• GET /api/assignments - Get all assignments\n• POST /api/assignments - Create new assignment (Admin)\n• PUT /api/assignments/:id - Update assignment (Admin)\n• DELETE /api/assignments/:id - Delete assignment (Admin)\n\nProduction Tracking Endpoints:\n• GET /api/production - Get production data\n• POST /api/production - Record production data\n• GET /api/production/stats - Get production statistics\n\nMQTT Integration Endpoints:\n• GET /api/mqtt/messages - Get MQTT message history\n• POST /api/mqtt/publish - Publish MQTT message (Admin)\n• GET /api/mqtt/status - Get MQTT connection status\n\nAPI Response Format:\n• Success: { success: true, data: {...}, message: '...' }\n• Error: { success: false, error: '...', code: 400 }\n• Pagination: { data: [...], pagination: { page, limit, total, pages } }\n\nAuthentication Headers:\n• Authorization: Bearer <jwt_token>\n• Content-Type: application/json\n• Accept: application/json\n\nRate Limiting:\n• 100 requests per minute per IP\n• 1000 requests per hour per user\n• Admin endpoints: 200 requests per minute\n\nError Handling:\n• 400: Bad Request - Invalid input data\n• 401: Unauthorized - Invalid or missing JWT\n• 403: Forbidden - Insufficient permissions\n• 404: Not Found - Resource not found\n• 500: Internal Server Error - Server-side error"
        );

        addSection(
          "4. Authentication & Security",
          "JWT-based Authentication System:\nComprehensive security implementation with role-based access control and data protection.\n\nAuthentication Flow:\n1. User submits username/password to /api/login\n2. Server validates credentials against database\n3. bcrypt compares password with stored hash\n4. JWT token generated with user data and expiration\n5. Token returned to client for subsequent requests\n6. Client includes token in Authorization header\n7. Server validates token on protected routes\n\nJWT Token Structure:\n• Header: Algorithm and token type\n• Payload: User ID, role, expiration timestamp\n• Signature: HMAC SHA256 with secret key\n• Expiration: 24 hours (configurable)\n• Refresh: Automatic token refresh on valid requests\n\nPassword Security:\n• bcrypt hashing with 12 salt rounds\n• Minimum 8 characters required\n• Password complexity validation\n• Password history prevention (last 5 passwords)\n• Account lockout after 5 failed attempts\n• Password reset via secure email link\n\nRole-Based Access Control:\nAdmin Role:\n• Full CRUD operations on all entities\n• User management and role assignment\n• System configuration and settings\n• Database administration access\n• MQTT message publishing\n• Report generation and export\n\nUser Role:\n• Read-only access to assigned data\n• Limited profile modification\n• View own assignments and qualifications\n• Basic report generation\n• No administrative functions\n\nSession Management:\n• JWT tokens stored in httpOnly cookies\n• Automatic token refresh before expiration\n• Logout invalidates all user sessions\n• Concurrent session limit: 3 per user\n• Session timeout: 8 hours of inactivity\n\nData Protection:\n• Environment variables for sensitive configuration\n• CORS protection for cross-origin requests\n• Input validation and sanitization\n• SQL injection prevention (NoSQL injection)\n• XSS protection with content security policy\n• CSRF protection with token validation\n\nProduction Security:\n• HTTPS enforcement in production\n• Database IP whitelisting\n• Regular security updates and monitoring\n• Secure secret management (AWS Secrets Manager)\n• Database encryption at rest\n• Network security groups and firewalls\n• Security headers and HSTS\n• Regular penetration testing\n\nSecurity Monitoring:\n• Failed login attempt tracking\n• Suspicious activity detection\n• Audit logs for all admin actions\n• Real-time security alerts\n• Automated threat detection\n• Regular security assessments"
        );

        addSection(
          "5. Frontend Architecture",
          "React 19 Frontend Architecture:\nModern, scalable frontend built with latest React features and comprehensive tooling.\n\nCore Technologies:\n• React 19 with Vite build tool\n• TypeScript for type safety\n• Tailwind CSS for utility-first styling\n• Chart.js for data visualizations\n• React Router for client-side navigation\n• i18next for internationalization\n• Axios for HTTP client\n• Lucide React for icons\n\nProject Structure:\n• /src/components - Reusable UI components\n• /src/pages - Route-based page components\n• /src/hooks - Custom React hooks\n• /src/services - API and external service integrations\n• /src/utils - Utility functions and helpers\n• /src/i18n - Internationalization configuration\n• /src/contexts - React context providers\n• /public - Static assets and files\n\nComponent Architecture:\n• Functional components with hooks\n• Custom hooks for state management\n• Context API for global state\n• Prop drilling minimization\n• Component composition patterns\n• Higher-order components (HOCs)\n• Render props for complex logic\n\nState Management:\n• React useState for local component state\n• React useContext for global state\n• Custom hooks for shared logic\n• Local storage for persistence\n• URL state for navigation state\n• No external state management library\n\nStyling System:\n• Tailwind CSS utility classes\n• Custom CSS variables for theming\n• Responsive design with mobile-first approach\n• Dark/light theme support\n• Component-specific styles\n• CSS-in-JS for dynamic styling\n\nRouting & Navigation:\n• React Router v6 for routing\n• Protected routes with authentication\n• Nested routing for complex layouts\n• Programmatic navigation\n• Route parameters and query strings\n• Browser history management\n\nData Visualization:\n• Chart.js for interactive charts\n• Responsive chart components\n• Real-time data updates\n• Multiple chart types (Line, Bar, Pie, Doughnut, Radar, Polar)\n• Custom chart configurations\n• Export functionality for charts\n\nInternationalization:\n• i18next for translation management\n• English and Hebrew language support\n• RTL (Right-to-Left) layout support\n• Dynamic language switching\n• Namespace-based translations\n• Pluralization support\n\nPerformance Optimization:\n• Code splitting with React.lazy\n• Memoization with React.memo\n• useMemo and useCallback for expensive operations\n• Image optimization and lazy loading\n• Bundle size optimization\n• Tree shaking for unused code\n\nDevelopment Tools:\n• Vite for fast development server\n• ESLint for code linting\n• Prettier for code formatting\n• TypeScript for type checking\n• Hot module replacement (HMR)\n• Source maps for debugging\n\nBuild & Deployment:\n• Vite build for production\n• Environment variable configuration\n• Static asset optimization\n• AWS Amplify deployment\n• CDN integration\n• Performance monitoring"
        );

        addSection(
          "6. MQTT Integration",
          'MQTT Protocol Integration:\nReal-time communication system using MQTT protocol for device-to-cloud messaging.\n\nMQTT Service Implementation:\nFile: services/mqttService.js\nOur system uses the MQTT protocol to exchange real-time messages between devices and services.\n\nBroker Setup:\n• Default test broker: mqtt://broker.hivemq.com\n• Test with HiveMQ WebSocket Client: https://www.hivemq.com/demos/websocket-client/\n• Custom broker: Set MQTT_BROKER=mqtt://<your-broker-address> in .env\n• Production broker: AWS IoT Core or custom MQTT broker\n• Authentication: Username/password or certificate-based\n• SSL/TLS: Encrypted connections for production\n\nSubscribed Channels:\n• Topic: Braude/Shluker/#\n• Wildcard # means all messages under Braude/Shluker/*\n• Station-specific topics: Braude/Shluker/station_001\n• User-specific topics: Braude/Shluker/user_123\n• System-wide topics: Braude/Shluker/system\n\nMessage Handling:\n1. Message logged in console for debugging\n2. Message stored in MongoDB collection: mqttMsg\n3. Real-time dashboard updates triggered\n4. WebSocket connections notified\n5. Database queries updated\n6. Charts and visualizations refreshed\n\nDatabase Storage Format:\n{\n  "station_id": "station_001",\n  "User ID": "user_123",\n  "result": 22.5,\n  "timestamp": "2024-01-15T10:30:00Z",\n  "topic": "Braude/Shluker/station_001",\n  "qos": 1\n}\n\nField Descriptions:\n• station_id → identifies source station/device\n• User ID → optional user that triggered event\n• result → production data or measurement value\n• timestamp → message reception time\n• topic → MQTT topic message was received on\n• qos → Quality of Service level (0, 1, or 2)\n• Other fields depend on use case and stored as raw message\n\nMessage Types:\n• Production Data: Real-time production metrics\n• Quality Metrics: Quality measurements and results\n• Station Status: Station availability and status updates\n• User Actions: User interactions and assignments\n• System Alerts: Error messages and notifications\n• Heartbeat: Keep-alive messages from devices\n\nQuality of Service (QoS):\n• QoS 0: At most once delivery (fire and forget)\n• QoS 1: At least once delivery (acknowledged)\n• QoS 2: Exactly once delivery (assured)\n• Default: QoS 1 for reliable message delivery\n\nConnection Management:\n• Automatic reconnection on connection loss\n• Connection status monitoring\n• Retry logic with exponential backoff\n• Connection pooling for multiple clients\n• Graceful shutdown on application exit\n\nError Handling:\n• Connection error logging\n• Message parsing error handling\n• Database write error recovery\n• Network timeout handling\n• Broker unavailable fallback\n\nPerformance Considerations:\n• Message batching for high-frequency data\n• Database indexing for message queries\n• Memory management for large message volumes\n• Connection pooling optimization\n• Message filtering and routing\n\nSecurity:\n• TLS/SSL encryption for message transport\n• Authentication with username/password\n• Topic-based access control\n• Message payload validation\n• Rate limiting for message publishing\n• Audit logging for security monitoring'
        );

        addSection(
          "7. Deployment Guide",
          "Production Deployment:\nComplete guide for deploying the Migdalor system using AWS services and MQTT integration.\n\nFrontend Deployment - AWS Amplify:\nDeployment Steps:\n1. Connect GitHub Repository\n   • In Amplify console, select 'Connect App'\n   • Choose GitHub as source provider\n   • Authenticate and select repository: migdalor\n\n2. Select Branch\n   • Choose branch: main\n\n3. Monorepo Configuration\n   • Enable checkbox: 'My app is a monorepo'\n   • Set root directory to: front-end\n\n4. Finalize & Deploy\n   • Review configuration\n   • Click 'Save and Deploy'\n   • Each push to main triggers automatic deployment\n\nBuild Configuration:\n• Build command: npm run build\n• Output directory: dist\n• Node.js version: 18\n• Environment variables: VITE_API_URL, VITE_MQTT_BROKER\n\nBackend Deployment - AWS App Runner:\nSource Configuration:\n1. In AWS App Runner console, select 'Source code repository'\n2. Connect GitHub repository\n3. Choose branch: main\n4. Set source directory to: /back-end\n\nDeployment Trigger:\n• Select 'Automatic' → new deployments triggered on main branch pushes\n\nRuntime and Build Settings:\n• Runtime: Node.js 18\n• Build command: npm install\n• Start command: node server.js\n• Port: 8080\n\nEnvironment Variables:\n• ATLAS_URI → MongoDB Atlas connection string\n• PORT → Node.js server port\n• MQTT_BROKER → MQTT broker URL (default: HiveMQ)\n• JWT_SECRET → Secret key for JWT tokens\n• NODE_ENV → Environment (production/development)\n\nMongoDB Atlas Database Setup:\n1. Create Project and Cluster\n   • Go to https://www.mongodb.com/\n   • Create new project and cluster in MongoDB Atlas\n\n2. Connection String\n   • Copy generated connection string to .env file:\n   • MONGODB_URI='mongodb+srv://username:password@your-cluster.mongodb.net/database?retryWrites=true&w=majority&appName=your-app'\n   • Replace username, password, cluster name, and database name with your Atlas credentials\n\n3. Setup Database (Local Script)\n   • Run: cd backend && node scripts/setup-database.js\n   • Creates required collections and inserts seed data\n\n4. Seed Data Configuration\n   • Sample data from: backend/database/seedData.js\n   • To customize: modify objects in seedData.js (don't delete objects)\n\n5. Database Network Access\n   • Currently accessible from all IPs (0.0.0.0/0)\n   • For security: configure allowed IP addresses in Atlas\n\nSecurity Best Practices:\n• Use strong, unique passwords for database users\n• Enable IP whitelisting in MongoDB Atlas\n• Use environment variables for sensitive data\n• Never commit credentials to version control\n• Enable MongoDB Atlas encryption at rest\n• Regularly rotate database passwords\n• Use VPC peering for private network access\n• Enable audit logging for database access\n• Implement database user roles and permissions\n• Regular security updates and monitoring\n\nMonitoring & Logging:\n• CloudWatch logs for application monitoring\n• MongoDB Atlas monitoring dashboard\n• MQTT broker connection monitoring\n• Performance metrics and alerts\n• Error tracking and notification\n• Uptime monitoring and health checks\n\nScaling Considerations:\n• Horizontal scaling with multiple App Runner instances\n• Database read replicas for read-heavy workloads\n• CDN for static asset delivery\n• Load balancing for high availability\n• Auto-scaling based on CPU and memory usage\n• Database connection pooling optimization\n\nBackup & Recovery:\n• MongoDB Atlas automated backups\n• Point-in-time recovery capability\n• Cross-region backup replication\n• Disaster recovery procedures\n• Data export and import scripts\n• Regular backup testing and validation"
        );

        addSection(
          "8. Development Setup",
          "Local Development Environment:\nComplete setup guide for developers to run the system locally.\n\nPrerequisites:\n• Node.js 18+ and npm\n• MongoDB Atlas account or local MongoDB\n• Git for version control\n• Code editor (VS Code recommended)\n• Modern web browser\n• MQTT broker access (HiveMQ for testing)\n\nBackend Setup:\nInstallation Steps:\ncd back-end\nnpm install\ncp .env.example .env\n# Edit .env with your configuration\nnpm start\n\nEnvironment Variables (.env):\n• ATLAS_URI - MongoDB connection string\n• PORT - Backend server port (default: 3000)\n• JWT_SECRET - Secret key for JWT tokens\n• MQTT_BROKER - MQTT broker URL (default: mqtt://broker.hivemq.com)\n• NODE_ENV - Environment (development/production)\n\nDatabase Setup:\n1. Create MongoDB Atlas cluster or use local MongoDB\n2. Update ATLAS_URI in .env file\n3. Run database setup script: node scripts/setup-database.js\n4. Verify collections and seed data\n\nFrontend Setup:\nDevelopment Server:\ncd front-end\nnpm install\nnpm run dev\n# Server runs on http://localhost:5173\n\nEnvironment Variables (.env.local):\n• VITE_API_URL - Backend API URL (default: http://localhost:3000)\n• VITE_MQTT_BROKER - MQTT broker WebSocket URL\n• VITE_APP_NAME - Application name\n\nConfiguration:\n• API Base URL: Configured in axios defaults\n• MQTT Connection: Automatic connection on app start\n• Theme: Light/dark theme with system preference detection\n• Language: English/Hebrew with browser detection\n\nDevelopment Tools:\n• ESLint: Code linting and style enforcement\n• Prettier: Code formatting\n• TypeScript: Type checking and IntelliSense\n• Vite: Fast development server with HMR\n• React DevTools: Component debugging\n• Redux DevTools: State management debugging\n\nTesting Setup:\n• Jest: Unit testing framework\n• React Testing Library: Component testing\n• Supertest: API endpoint testing\n• Cypress: End-to-end testing\n• Test database: Separate test MongoDB cluster\n\nCode Quality:\n• Pre-commit hooks with Husky\n• Lint-staged for staged file linting\n• Commit message conventions\n• Code review process\n• Automated testing on pull requests\n\nDebugging:\n• VS Code debug configuration\n• Node.js debugging with --inspect\n• React DevTools browser extension\n• Network tab for API debugging\n• Console logging for MQTT messages\n\nHot Reloading:\n• Frontend: Vite HMR for instant updates\n• Backend: Nodemon for automatic restarts\n• Database: Mongoose connection management\n• MQTT: Automatic reconnection on changes\n\nDevelopment Workflow:\n1. Create feature branch from main\n2. Make changes with proper testing\n3. Run linting and tests locally\n4. Commit with descriptive messages\n5. Push to remote repository\n6. Create pull request for review\n7. Merge after approval and CI passes\n\nTroubleshooting:\n• Port conflicts: Change PORT in .env\n• Database connection: Verify ATLAS_URI\n• MQTT connection: Check broker URL and network\n• Build errors: Clear node_modules and reinstall\n• CORS issues: Verify API URL configuration\n• Memory issues: Increase Node.js memory limit"
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
              The system uses MongoDB Atlas with the following 8 collections for
              data management.
            </p>
          </div>

          <div className="space-y-4">
            {/* Core Collections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white border rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-500" />
                  Users Collection
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-mono">_id</span>
                    <span>ObjectId (PK)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">username</span>
                    <span>String (Unique)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">password</span>
                    <span>String (bcrypt)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">isAdmin</span>
                    <span>Boolean</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">createdAt</span>
                    <span>Date</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">updatedAt</span>
                    <span>Date</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Users className="h-4 w-4 mr-2 text-green-500" />
                  Employees Collection
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-mono">_id</span>
                    <span>ObjectId (PK)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">person_id</span>
                    <span>String (Unique)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">first_name</span>
                    <span>String</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">last_name</span>
                    <span>String</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">email</span>
                    <span>String</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">phone</span>
                    <span>String</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">department</span>
                    <span>String</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">role</span>
                    <span>String</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">status</span>
                    <span>String</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">createdAt</span>
                    <span>Date</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">updatedAt</span>
                    <span>Date</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Department & Product Collections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white border rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Settings className="h-4 w-4 mr-2 text-purple-500" />
                  Departments Collection
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-mono">_id</span>
                    <span>ObjectId (PK)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">name</span>
                    <span>String (Unique)</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Package className="h-4 w-4 mr-2 text-orange-500" />
                  Products Collection
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-mono">_id</span>
                    <span>ObjectId (PK)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">product_name</span>
                    <span>String</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">company</span>
                    <span>String</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Station Collections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white border rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Settings className="h-4 w-4 mr-2 text-indigo-500" />
                  Stations Collection
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-mono">_id</span>
                    <span>ObjectId (PK)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">station_id</span>
                    <span>String</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">station_name</span>
                    <span>String</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">department</span>
                    <span>String</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">product_name</span>
                    <span>String</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-teal-500" />
                  Working Stations Collection
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-mono">_id</span>
                    <span>ObjectId (PK)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">station_name</span>
                    <span>String</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">workingStation_name</span>
                    <span>String</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">status</span>
                    <span>Boolean</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Assignment & Qualification Collections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white border rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-red-500" />
                  Assignments Collection
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-mono">_id</span>
                    <span>ObjectId (PK)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">assignment_id</span>
                    <span>String</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">date</span>
                    <span>Date</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">number_of_hours</span>
                    <span>Number</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">workingStation_name</span>
                    <span>String</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">person_id</span>
                    <span>String</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Award className="h-4 w-4 mr-2 text-yellow-500" />
                  Qualifications Collection
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-mono">_id</span>
                    <span>ObjectId (PK)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">person_id</span>
                    <span>String</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">station_name</span>
                    <span>String</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">avg</span>
                    <span>Number</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Database Relationships */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-semibold text-blue-800 mb-3 flex items-center">
                <GitBranch className="h-4 w-4 mr-2" />
                Database Relationships
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h6 className="font-semibold text-blue-700 mb-2">
                    Core Relationships
                  </h6>
                  <ul className="space-y-1 text-blue-600">
                    <li>
                      • Department (1) → (0..*) Employee (via department field)
                    </li>
                    <li>
                      • Department (1) → (0..*) Station (via department field)
                    </li>
                    <li>
                      • Product (1) → (0..*) Station (via product_name field)
                    </li>
                    <li>
                      • Station (1) → (0..*) WorkingStation (via station_name
                      field)
                    </li>
                  </ul>
                </div>
                <div>
                  <h6 className="font-semibold text-blue-700 mb-2">
                    Assignment Relationships
                  </h6>
                  <ul className="space-y-1 text-blue-600">
                    <li>
                      • Employee (1) → (0..*) Assignment (via person_id field)
                    </li>
                    <li>
                      • Station (1) → (0..*) Assignment (via workingStation_name
                      field)
                    </li>
                    <li>
                      • Employee (1) → (0..*) Qualification (via person_id
                      field)
                    </li>
                    <li>
                      • Station (1) → (0..*) Qualification (via station_name
                      field)
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Indexing Strategy */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h5 className="font-semibold text-green-800 mb-3 flex items-center">
                <Zap className="h-4 w-4 mr-2" />
                Indexing Strategy
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h6 className="font-semibold text-green-700 mb-2">
                    Unique Indexes
                  </h6>
                  <ul className="space-y-1 text-green-600">
                    <li>• username (Users)</li>
                    <li>• person_id (Employees)</li>
                    <li>• name (Departments)</li>
                    <li>• station_id (Stations)</li>
                  </ul>
                </div>
                <div>
                  <h6 className="font-semibold text-green-700 mb-2">
                    Query Indexes
                  </h6>
                  <ul className="space-y-1 text-green-600">
                    <li>• person_id (Assignments)</li>
                    <li>• workingStation_name (Assignments)</li>
                    <li>• date (Assignments)</li>
                    <li>• person_id (Qualifications)</li>
                    <li>• station_name (Qualifications)</li>
                  </ul>
                </div>
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
