const express = require("express");
const router = express.Router();
const Qualification = require("../models/qualification");
const Employee = require("../models/Employee");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const logger = require("../utils/logger");

// Get all qualifications
router.get("/qualifications", async (req, res) => {
  try {
    logger.db("Fetch all qualifications", "Qualification");
    const qualifications = await Qualification.find({});
    logger.success(
      "Qualifications fetched",
      `${qualifications.length} qualifications`
    );
    res.json(qualifications);
  } catch (error) {
    logger.error("Error fetching qualifications", error);
    res.status(500).json({
      message: "Error fetching qualifications",
      error: error.message,
    });
  }
});

// Create new qualification
router.post("/qualifications", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { person_id, station_name, avg } = req.body;

    logger.db("Create qualification", "Qualification");
    const newQualification = new Qualification({
      person_id,
      station_name,
      avg,
    });
    const savedQualification = await newQualification.save();

    logger.success(
      "Qualification created",
      `${person_id} for ${station_name} (avg: ${avg})`
    );
    res.status(201).json(savedQualification);
  } catch (error) {
    logger.error("Error saving qualification", error);
    res.status(500).json({
      message: "Error saving qualification",
      error: error.message,
    });
  }
});

// Update or create employee qualifications
router.put("/qualifications", async (req, res) => {
  try {
    const { person_id, station_name, avg } = req.body;

    // First, find the person by their person_id
    logger.db("Find employee for qualification", "Employee");
    const person = await Employee.findOne({ person_id });
    if (!person) {
      logger.error("Qualification update", `Person ${person_id} not found`);
      return res.status(404).json({ message: "Person not found" });
    }

    // Find and update the qualification, or create a new one if it doesn't exist
    logger.db("Update/create qualification", "Qualification");
    const qualification = await Qualification.findOneAndUpdate(
      { person_id: person.person_id, station_name },
      { avg },
      { new: true, upsert: true }
    );

    logger.success(
      "Qualification updated",
      `${person_id} for ${station_name} (avg: ${avg})`
    );
    res.json(qualification);
  } catch (error) {
    logger.error("Error updating qualification", error);
    res.status(500).json({
      message: "Error updating qualification",
      error: error.message,
    });
  }
});

// Get employee qualifications
router.get("/qualifications/:employeeId", async (req, res) => {
  try {
    logger.db("Fetch employee qualifications", "Qualification");
    const qualifications = await Qualification.find({
      person_id: req.params.employeeId,
    });

    logger.success(
      "Employee qualifications fetched",
      `${qualifications.length} qualifications for ${req.params.employeeId}`
    );
    res.json(qualifications);
  } catch (error) {
    logger.error("Error fetching qualifications", error);
    res.status(500).json({
      message: "Error fetching qualifications",
      error: error.message,
    });
  }
});

module.exports = router;
