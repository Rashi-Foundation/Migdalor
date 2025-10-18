const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const rateLimit = require("express-rate-limit");

const { connectToDatabase } = require("./database/atlas-connection.js");
const { setupMQTT } = require("./services/mqttService.js");
const { errorHandler, notFound } = require("./middleware/errorHandler.js");
const requestLogger = require("./middleware/requestLogger.js");

// Import routes
const authRoutes = require("./routes/authRoutes.js");
const employeeRoutes = require("./routes/employeeRoutes.js");
const stationRoutes = require("./routes/stationRoutes.js");
const qualificationRoutes = require("./routes/qualificationRoutes.js");
const assignmentRoutes = require("./routes/assignmentRoutes.js");
const dashboardRoutes = require("./routes/dashboardRoutes.js");
const reportRoutes = require("./routes/reportRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const helmet = require("helmet");

const app = express();
const port = process.env.PORT;

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: "Too many requests, please try again later.",
});
app.use(helmet());

// Middleware
const allowedOrigins = ["http://localhost:5173", "https://app.migdalor.org.il"];

// Add additional frontend URL from environment if provided
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

// Database connection
async function startServer() {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    console.log("✅ Database connected successfully");

    // Setup MQTT
    setupMQTT();
    console.log("✅ MQTT service initialized");

    // Routes
    app.use("/api", authLimiter, authRoutes);
    app.use("/api", employeeRoutes);
    app.use("/api", stationRoutes);
    app.use("/api", qualificationRoutes);
    app.use("/api", assignmentRoutes);
    app.use("/api", dashboardRoutes);
    app.use("/api", reportRoutes);
    app.use("/api", userRoutes);

    // Health check endpoint
    app.get("/health", (req, res) => {
      res.json({ status: "OK", timestamp: new Date().toISOString() });
    });

    // 404 handler for undefined routes
    app.use(notFound);

    // Error handling middleware (must be last)
    app.use(errorHandler);

    // Start the server
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n👋 Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n👋 Shutting down gracefully...");
  process.exit(0);
});

startServer();
