const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const router = require("../../routes/assignmentRoutes");
const Assignment = require("../../models/assignment");

// Mock middlewares
jest.mock("../../middleware/auth", () => ({
  requireAuth: (req, res, next) => {
    req.user = { userId: "123" };
    next();
  },
  requireAdmin: (req, res, next) => next(),
}));

// Mock logger to avoid clutter
jest.mock("../../utils/logger", () => ({
  db: jest.fn(),
  error: jest.fn(),
  success: jest.fn(),
}));

// Mock Assignment model
jest.mock("../../models/assignment");

const app = express();
app.use(express.json());
app.use("/api", router);

describe("Assignment Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // ---------------- GET /assignments ----------------
  describe("GET /api/assignments", () => {
    it("should return assignments for a valid date", async () => {
      // use ISO string for date so it matches JSON response
      const mockDate = new Date("2025-10-09T18:21:47.845Z");
      const mockAssignments = [
        {
          _id: "1",
          person_id: "p1",
          date: mockDate.toISOString(), // <-- ISO string
          workingStation_name: "WS1",
          number_of_hours: 8,
        },
      ];

      Assignment.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockAssignments),
      });

      const res = await request(app)
        .get("/api/assignments")
        .query({ date: "2025-10-10" });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockAssignments);
    });

    it("should return 400 if date is missing", async () => {
      const res = await request(app).get("/api/assignments");
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Validation failed");
    });
  });

  // ---------------- GET /assignments/weekly ----------------
  describe("GET /api/assignments/weekly", () => {
    it("should return weekly assignments for valid weekStart", async () => {
      const mockDate = new Date("2025-10-09T18:21:47.862Z");
      const mockAssignments = [
        {
          _id: "1",
          person_id: "p1",
          date: mockDate.toISOString(), // <-- ISO string
          workingStation_name: "WS1",
          number_of_hours: 8,
        },
      ];

      Assignment.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockAssignments),
      });

      const res = await request(app)
        .get("/api/assignments/weekly")
        .query({ weekStart: "2025-10-06" });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockAssignments);
    });

    it("should return 400 if weekStart is missing", async () => {
      const res = await request(app).get("/api/assignments/weekly");
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Validation failed");
    });
  });

  // ---------------- POST /assignments ----------------
  describe("POST /api/assignments", () => {
    it("should create a new assignment successfully", async () => {
      const saved = {
        _id: "1",
        date: new Date("2025-10-10").toISOString(),
        workingStation_name: "WS1",
        person_id: "p1",
        number_of_hours: 8,
      };
      const mockSave = jest.fn().mockResolvedValue(saved);
      Assignment.mockImplementation(() => ({ save: mockSave }));

      const res = await request(app).post("/api/assignments").send({
        date: "2025-10-10",
        workingStation_name: "WS1",
        person_id: "p1",
        number_of_hours: 8,
      });

      expect(res.status).toBe(201);
      expect(res.body.workingStation_name).toBe("WS1");
    });

    it("should return 400 for missing fields", async () => {
      const res = await request(app).post("/api/assignments").send({
        date: "2025-10-10",
        workingStation_name: "WS1",
      });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Validation failed");
    });
  });

  // ---------------- DELETE /assignments ----------------
  describe("DELETE /api/assignments", () => {
    it("should delete an assignment successfully", async () => {
      const mockAssignments = [{ _id: "1" }, { _id: "2" }];
      Assignment.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockAssignments),
      });
      Assignment.findByIdAndDelete.mockResolvedValue(true);

      const res = await request(app).delete("/api/assignments").send({
        date: "2025-10-10",
        person_id: "p1",
        assignmentNumber: 2,
      });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Assignment deleted successfully");
    });

    it("should return 404 if assignment not found", async () => {
      Assignment.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue([]),
      });

      const res = await request(app).delete("/api/assignments").send({
        date: "2025-10-10",
        person_id: "p1",
        assignmentNumber: 1,
      });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe(
        "No assignments found for this person on the given date"
      );
    });

    it("should return 400 for validation errors", async () => {
      const res = await request(app).delete("/api/assignments").send({
        date: "invalid-date",
        person_id: "",
        assignmentNumber: 3,
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Validation failed");
    });
  });
});
