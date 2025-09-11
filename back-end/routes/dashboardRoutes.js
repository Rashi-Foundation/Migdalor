const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Employee = require("../models/Employee");
const Station = require("../models/station");
const Assignment = require("../models/assignment");
const logger = require("../utils/logger");

// Route for dashboard data
router.get("/dashboard-data", async (req, res) => {
  try {
    logger.info("Calculating dashboard data");

    // Calculate active workers (status === 'פעיל')
    logger.db("Count active workers", "Employee");
    const activeWorkers = await Employee.countDocuments({ status: "פעיל" });
    // Calculate total workers and inactive workers
    logger.db("Count inactive workers", "Employee");
    const inactiveWorkers = await Employee.countDocuments({
      status: "לא פעיל",
    });
    // Calculate stations
    logger.db("Count total stations", "Station");
    const totalStations = await Station.countDocuments();

    // For active and inactive stations, we'll keep the previous logic
    // Assuming a station is active if it has an assignment today
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];
    const startOfDay = new Date(currentDate);
    const endOfDay = new Date(currentDate);
    endOfDay.setDate(endOfDay.getDate() + 1);

    logger.db("Find active stations", "Assignment");
    const activeStations = await Assignment.distinct("workingStation_name", {
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });
    const activeStationsCount = activeStations.length;
    const inactiveStations = totalStations - activeStationsCount;

    // Count today's invalid valves from MQTT messages
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    logger.db("Fetch MQTT messages", "mqttMsg");
    const mqttMessages = await mongoose.connection.db
      .collection("mqttMsg")
      .find({ timestamp: { $gte: today } })
      .toArray();

    let dailyDefects = 0;
    mqttMessages.forEach((msg) => {
      try {
        const parsed = JSON.parse(msg.message);
        if (parsed["Shluker Result"] === "Invalid Valve") dailyDefects++;
      } catch (_) {}
    });

    const responseData = {
      inactiveWorkers,
      activeWorkers,
      dailyDefects,
      inactiveStations,
    };

    logger.success(
      "Dashboard data calculated",
      `Active: ${activeWorkers}, Inactive: ${inactiveWorkers}, Defects: ${dailyDefects}`
    );
    res.json(responseData);
  } catch (error) {
    logger.error("Error calculating dashboard data", error);
    res.status(500).json({
      message: "Error calculating dashboard data",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Route to get Shluker results
router.get("/shluker-results", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    logger.db("Fetch Shluker results", "mqttMsg");
    const messages = await mongoose.connection.db
      .collection("mqttMsg")
      .find({
        timestamp: { $gte: today },
      })
      .toArray();

    const counterData = {
      proper: 0,
      improper: 0,
    };

    messages.forEach((msg) => {
      try {
        const parsedMessage = JSON.parse(msg.message);
        if (parsedMessage["Shluker Result"] === "Good Valve") {
          counterData.proper++;
        } else if (parsedMessage["Shluker Result"] === "Invalid Valve") {
          counterData.improper++;
        }
      } catch (parseError) {
        logger.error("Error parsing MQTT message", parseError);
      }
    });

    logger.success(
      "Shluker results fetched",
      `Good: ${counterData.proper}, Invalid: ${counterData.improper}`
    );
    res.json(counterData);
  } catch (error) {
    logger.error("Error fetching Shluker results", error);
    res.status(500).json({
      message: "Error fetching Shluker results",
      error: error.message,
    });
  }
});

module.exports = router;
