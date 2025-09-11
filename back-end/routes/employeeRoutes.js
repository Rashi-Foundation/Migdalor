const express = require("express");
const router = express.Router();
const { requireAuth, requireAdmin } = require("../middleware/auth");
const Employee = require("../models/Employee");
const Qualification = require("../models/qualification");
const logger = require("../utils/logger");

const {
  getTopEmployeesForStation,
  getAllSortedEmployeesForStation,
  geneticAlgorithm,
} = require("../geneticAlgorithm.js");
const Station = require("../models/station");

// Register new employee (Employee schema) - admin only
// POST /api/employees/register
router.post(
  "/employees/register",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    try {
      const {
        person_id,
        first_name,
        last_name,
        email,
        phone,
        department,
        role,
        status = "פעיל",
      } = req.body || {};

      // Basic validation
      if (!person_id || !first_name || !last_name) {
        logger.error("Employee registration", "Missing required fields");
        return res.status(400).json({
          success: false,
          message: "person_id, first_name and last_name are required",
        });
      }

      // Optional email format check
      if (
        email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase())
      ) {
        logger.error("Employee registration", "Invalid email format");
        return res.status(400).json({
          success: false,
          message: "Email is not valid",
        });
      }

      // Uniqueness: person_id must be unique
      logger.db("Check existing employee", "Employee");
      const exists = await Employee.findOne({ person_id }).select("_id");
      if (exists) {
        logger.error(
          "Employee registration",
          `Person ID ${person_id} already exists`
        );
        return res.status(409).json({
          success: false,
          message: "Employee with this person_id already exists",
        });
      }

      logger.db("Create employee", "Employee");
      const employee = await Employee.create({
        person_id: String(person_id).trim(),
        first_name: String(first_name).trim(),
        last_name: String(last_name).trim(),
        email: (email || "").trim().toLowerCase(),
        phone: (phone || "").trim(),
        department: (department || "").trim(),
        role: (role || "").trim(),
        status: (status || "").trim(),
      });

      logger.success(
        "Employee registered",
        `${first_name} ${last_name} (${person_id})`
      );
      return res.status(201).json({
        success: true,
        message: "Employee created successfully",
        employee: {
          id: employee._id,
          person_id: employee.person_id,
          first_name: employee.first_name,
          last_name: employee.last_name,
          email: employee.email,
          phone: employee.phone,
          department: employee.department,
          role: employee.role,
          status: employee.status,
        },
      });
    } catch (error) {
      logger.error("Register employee error", error);
      return res.status(500).json({
        success: false,
        message: "Server error during employee registration",
      });
    }
  }
);

// Get all employees
router.get("/employees", async (req, res) => {
  try {
    logger.db("Fetch all employees", "Employee");
    const employees = await Employee.find({});
    logger.success("Employees fetched", `${employees.length} employees`);
    res.json(employees);
  } catch (error) {
    logger.error("Error fetching employees", error);
    res.status(500).json({
      message: "Error fetching employees",
      error: error.message,
    });
  }
});

// Update employee data
router.put(
  "/employees/:employeeId",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    try {
      const { first_name, last_name, email, phone, department, role, status } =
        req.body;

      const updateObj = {};
      if (first_name !== undefined) updateObj.first_name = first_name;
      if (last_name !== undefined) updateObj.last_name = last_name;
      if (email !== undefined) updateObj.email = email;
      if (phone !== undefined) updateObj.phone = phone;
      if (department !== undefined) updateObj.department = department;
      if (role !== undefined) updateObj.role = role;
      if (status !== undefined) updateObj.status = status;

      logger.db("Update employee", "Employee");
      const updated = await Employee.findOneAndUpdate(
        { person_id: req.params.employeeId },
        { $set: updateObj },
        { new: true }
      );

      if (!updated) {
        logger.error(
          "Employee update",
          `Employee ${req.params.employeeId} not found`
        );
        return res.status(404).json({ message: "Employee not found" });
      }

      logger.success(
        "Employee updated",
        `${updated.first_name} ${updated.last_name}`
      );
      res.json(updated);
    } catch (error) {
      logger.error("Error updating employee", error);
      res
        .status(500)
        .json({ message: "Error updating employee", error: error.message });
    }
  }
);

// Get top employees for a station
router.get("/top-employees/:stationName/:count", async (req, res) => {
  try {
    const { stationName, count } = req.params;
    const station = await Station.findOne({ station_name: stationName });
    const employees = await Employee.find({});
    const qualifications = await Qualification.find({
      station_name: stationName,
    });

    const topEmployees = getTopEmployeesForStation(
      employees,
      station,
      qualifications,
      parseInt(count)
    );

    res.json(topEmployees);
  } catch (error) {
    console.error("Error fetching top employees:", error);
    res.status(500).json({
      message: "Error fetching top employees",
      error: error.message,
    });
  }
});

// Get sorted employees for a station
router.get("/sorted-employees/:stationName", async (req, res) => {
  try {
    const { stationName } = req.params;
    const station = await Station.findOne({ station_name: stationName });
    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    const employees = await Employee.find({});
    const qualifications = await Qualification.find({
      station_name: stationName,
    });

    const sortedEmployees = getAllSortedEmployeesForStation(
      employees,
      station,
      qualifications
    );

    res.json(sortedEmployees);
  } catch (error) {
    console.error("Error fetching sorted employees:", error);
    res.status(500).json({
      message: "Error fetching sorted employees",
      error: error.message,
    });
  }
});

// Get employees with qualifications for a station
router.get("/employees-with-qualifications/:stationName", async (req, res) => {
  try {
    const stationName = req.params.stationName;

    // Find all qualifications for the given station
    const qualifications = await Qualification.find({
      station_name: stationName,
    });

    // Extract person_ids from the qualifications
    const personIds = qualifications.map((qual) => qual.person_id);

    // Fetch the corresponding persons
    const employees = await Employee.find({ person_id: { $in: personIds } });

    // Combine employee data with their qualification
    const employeesWithQualifications = employees.map((employee) => {
      const qualification = qualifications.find(
        (q) => q.person_id === employee.person_id
      );
      return {
        _id: employee._id,
        person_id: employee.person_id,
        first_name: employee.first_name,
        last_name: employee.last_name,
        department: employee.department,
        role: employee.role,
        qualification_avg: qualification ? qualification.avg : null,
      };
    });

    res.json(employeesWithQualifications);
  } catch (error) {
    console.error("Error fetching employees with qualifications:", error);
    res.status(500).json({
      message: "Error fetching employees with qualifications",
      error: error.message,
    });
  }
});

// Assign employees to stations
router.post("/assign-employees", async (req, res) => {
  try {
    const { selectedStations, selectedEmployees } = req.body;

    // Fetch full employee data
    const employees = await Employee.find({ _id: { $in: selectedEmployees } });

    // Fetch full station data
    const stations = await Station.find({ _id: { $in: selectedStations } });

    // Fetch qualifications for selected employees
    const qualifications = await Qualification.find({
      person_id: { $in: selectedEmployees },
    });

    // Create a detailed assignment object
    const detailedAssignment = {};
    const optimalAssignment = geneticAlgorithm(
      employees,
      stations,
      qualifications
    );

    Object.entries(optimalAssignment).forEach(([stationId, employeeId]) => {
      const station = stations.find((s) => s.station_id === stationId);
      const employee = employees.find((e) => e._id.toString() === employeeId);
      const qualification = qualifications.find(
        (q) =>
          q.person_id === employeeId && q.station_name === station.station_name
      );
      detailedAssignment[employeeId] = {
        stationId,
        stationName: station.station_name,
        qualificationScore: qualification ? qualification.avg : 0,
      };
    });

    res.json(detailedAssignment);
  } catch (error) {
    console.error("Error assigning employees:", error);
    res.status(500).json({
      message: "Error assigning employees",
      error: error.message,
    });
  }
});
module.exports = router;
