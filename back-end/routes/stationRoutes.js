const express = require("express");
const router = express.Router();
const Station = require("../models/station");
const Product = require("../models/product");
const WorkingStation = require("../models/workingStation");
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

module.exports = router;
