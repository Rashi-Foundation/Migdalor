const express = require("express");
const router = express.Router();
const Station = require("../models/station");
const Product = require("../models/product");
const WorkingStation = require("../models/workingStation");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const logger = require("../utils/logger");

// Get all stations
router.get("/stations", async (req, res) => {
  try {
    logger.db("Fetch all stations", "Station");
    const stations = await Station.find({});
    logger.success("Stations fetched", `${stations.length} stations`);
    res.json(stations);
  } catch (error) {
    logger.error("Error fetching stations", error);
    res.status(500).json({
      message: "Error fetching stations",
      error: error.message,
    });
  }
});

// Get all products
router.get("/products", async (req, res) => {
  try {
    logger.db("Fetch all products", "Product");
    const products = await Product.find({}).select("product_name");
    logger.success("Products fetched", `${products.length} products`);
    res.json(products);
  } catch (error) {
    logger.error("Error fetching products", error);
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
});

// Get working stations for a station
router.get("/workstations/:stationName", async (req, res) => {
  try {
    const { stationName } = req.params;

    logger.db("Find station", "Station");
    const station = await Station.findOne({ station_name: stationName });
    if (!station) {
      logger.error("Workstation fetch", `Station ${stationName} not found`);
      return res.status(404).json({ message: "Station not found" });
    }

    logger.db("Fetch workstations", "WorkingStation");
    const workstations = await WorkingStation.find({
      station_name: stationName,
    });

    logger.success(
      "Workstations fetched",
      `${workstations.length} workstations for ${stationName}`
    );
    res.json(workstations);
  } catch (error) {
    logger.error("Error fetching workstations", error);
    res.status(500).json({
      message: "Error fetching workstations",
      error: error.message,
    });
  }
});

// POST - Create new station (Admin only)
router.post("/stations", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { station_name, department, product_name } = req.body;

    if (!station_name || !department || !product_name) {
      logger.error("Station creation", "Missing required fields");
      return res.status(400).json({
        message:
          "All fields are required: station_name, department, product_name",
      });
    }

    // Check if station already exists
    const existingStation = await Station.findOne({ station_name });
    if (existingStation) {
      logger.error(
        "Station creation",
        `Station ${station_name} already exists`
      );
      return res.status(400).json({
        message: "Station with this name already exists",
      });
    }

    // Generate new station ID
    const stationCount = await Station.countDocuments();
    const station_id = `ST${String(stationCount + 1).padStart(3, "0")}`;

    logger.db("Create station", "Station");
    const newStation = new Station({
      station_id,
      station_name,
      department,
      product_name,
    });

    const savedStation = await newStation.save();
    logger.success(
      "Station created",
      `${station_name} created with ID ${station_id}`
    );
    res.status(201).json(savedStation);
  } catch (error) {
    logger.error("Error creating station", error);
    res.status(500).json({
      message: "Error creating station",
      error: error.message,
    });
  }
});

// PUT - Update station (Admin only)
router.put("/stations/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { station_name, department, product_name } = req.body;

    if (!station_name || !department || !product_name) {
      logger.error("Station update", "Missing required fields");
      return res.status(400).json({
        message:
          "All fields are required: station_name, department, product_name",
      });
    }

    logger.db("Update station", "Station");
    const updatedStation = await Station.findByIdAndUpdate(
      id,
      { station_name, department, product_name },
      { new: true, runValidators: true }
    );

    if (!updatedStation) {
      logger.error("Station update", `Station with ID ${id} not found`);
      return res.status(404).json({ message: "Station not found" });
    }

    logger.success("Station updated", `${updatedStation.station_name} updated`);
    res.json(updatedStation);
  } catch (error) {
    logger.error("Error updating station", error);
    res.status(500).json({
      message: "Error updating station",
      error: error.message,
    });
  }
});

// DELETE - Delete station (Admin only)
router.delete("/stations/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    logger.db("Find station for deletion", "Station");
    const station = await Station.findById(id);
    if (!station) {
      logger.error("Station deletion", `Station with ID ${id} not found`);
      return res.status(404).json({ message: "Station not found" });
    }

    // Check if station has assignments
    const Assignment = require("../models/assignment");
    const assignments = await Assignment.find({
      workingStation_name: { $regex: station.station_name, $options: "i" },
    });

    if (assignments.length > 0) {
      logger.error(
        "Station deletion",
        `Station ${station.station_name} has active assignments`
      );
      return res.status(400).json({
        message: "Cannot delete station with active assignments",
      });
    }

    // Delete associated working stations
    await WorkingStation.deleteMany({ station_name: station.station_name });

    // Delete the station
    logger.db("Delete station", "Station");
    await Station.findByIdAndDelete(id);

    logger.success("Station deleted", `${station.station_name} deleted`);
    res.json({ message: "Station deleted successfully" });
  } catch (error) {
    logger.error("Error deleting station", error);
    res.status(500).json({
      message: "Error deleting station",
      error: error.message,
    });
  }
});

module.exports = router;
