const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Assignment = require("../models/assignment");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const logger = require("../utils/logger");

// GET assignments for a specific date
router.get("/assignments", async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      logger.error("Assignment fetch", "Missing date parameter");
      return res.status(400).json({ message: "Date parameter is required" });
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    logger.db("Fetch assignments", "Assignment");
    const assignments = await Assignment.find({
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    }).sort("date");

    logger.success(
      "Assignments fetched",
      `${assignments.length} assignments for ${date}`
    );
    res.json(assignments);
  } catch (error) {
    logger.error("Error fetching assignments", error);
    res.status(500).json({
      message: "Error fetching assignments",
      error: error.message,
    });
  }
});

// POST new assignment
router.post("/assignments", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { date, workingStation_name, person_id, number_of_hours } = req.body;

    if (!date || !workingStation_name || !person_id || !number_of_hours) {
      logger.error("Assignment creation", "Missing required fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    logger.db("Create assignment", "Assignment");
    const newAssignment = new Assignment({
      assignment_id: new mongoose.Types.ObjectId().toString(),
      date: new Date(date),
      number_of_hours,
      workingStation_name,
      person_id,
    });

    const savedAssignment = await newAssignment.save();
    logger.success(
      "Assignment created",
      `${person_id} assigned to ${workingStation_name} for ${number_of_hours}h`
    );
    res.status(201).json(savedAssignment);
  } catch (error) {
    logger.error("Error saving assignment", error);
    res.status(500).json({
      message: "Error saving assignment",
      error: error.message,
    });
  }
});

// DELETE assignment
router.delete("/assignments", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { date, person_id, assignmentNumber } = req.body;

    if (!date || !person_id || !assignmentNumber) {
      logger.error("Assignment deletion", "Missing required fields");
      return res.status(400).json({
        message: "Missing required fields",
        required: ["date", "person_id", "assignmentNumber"],
      });
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    // Find all assignments for the person on the given date
    logger.db("Find assignments for deletion", "Assignment");
    const assignments = await Assignment.find({
      date: {
        $gte: startDate,
        $lt: endDate,
      },
      person_id: person_id,
    }).sort("date");

    if (assignments.length === 0) {
      logger.error(
        "Assignment deletion",
        `No assignments found for ${person_id} on ${date}`
      );
      return res.status(404).json({
        message: "No assignments found for this person on the given date",
      });
    }

    // Delete the specified assignment (first or second)
    const assignmentToDelete = assignments[assignmentNumber - 1];
    if (!assignmentToDelete) {
      logger.error(
        "Assignment deletion",
        `Assignment #${assignmentNumber} not found`
      );
      return res.status(404).json({
        message: "Specified assignment not found",
      });
    }

    logger.db("Delete assignment", "Assignment");
    await Assignment.findByIdAndDelete(assignmentToDelete._id);

    logger.success(
      "Assignment deleted",
      `${person_id} assignment #${assignmentNumber} on ${date}`
    );
    res.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    logger.error("Error deleting assignment", error);
    res.status(500).json({
      message: "Error deleting assignment",
      error: error.message,
      stack: error.stack,
    });
  }
});

module.exports = router;
