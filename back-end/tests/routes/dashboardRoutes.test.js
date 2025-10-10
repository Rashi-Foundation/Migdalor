const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");

const router = require("../../routes/dashboardRoutes");

const Employee = require("../../models/Employee");
const Station = require("../../models/station");
const Assignment = require("../../models/assignment");

// Mock logger to silence logs
jest.mock("../../utils/logger", () => ({
  info: jest.fn(),
  db: jest.fn(),
  success: jest.fn(),
  error: jest.fn(),
}));

// Mock the Mongoose models
jest.mock("../../models/Employee");
jest.mock("../../models/station");
jest.mock("../../models/assignment");

const app = express();
app.use(express.json());
app.use("/api", router);

describe("Dashboard routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/dashboard-data", () => {
    it("returns dashboard data with counts and daily defects", async () => {
      // Mock counts
      Employee.countDocuments.mockResolvedValueOnce(10); // activeWorkers
      Employee.countDocuments.mockResolvedValueOnce(2); // inactiveWorkers
      Station.countDocuments.mockResolvedValueOnce(20); // totalStations

      // Mock assignments distinct for active stations
      Assignment.distinct.mockResolvedValueOnce(["S1", "S2", "S3"]); // 3 active

      // Mock mqtt messages in DB collection
      const mockMsgs = [
        {
          message: JSON.stringify({ "Shluker Result": "Invalid Valve" }),
          timestamp: new Date(),
        },
        {
          message: JSON.stringify({ "Shluker Result": "Good Valve" }),
          timestamp: new Date(),
        },
        {
          message: JSON.stringify({ "Shluker Result": "Invalid Valve" }),
          timestamp: new Date(),
        },
      ];

      // Mock mongoose.connection.db.collection(...).find(...).toArray()
      const toArray = jest.fn().mockResolvedValue(mockMsgs);
      const find = jest.fn().mockReturnValue({ toArray });
      const collection = jest.fn().mockReturnValue({ find });
      // ensure connection.db exists and is mockable
      mongoose.connection.db = { collection };

      const res = await request(app).get("/api/dashboard-data");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        inactiveWorkers: 2,
        activeWorkers: 10,
        dailyDefects: 2, // two Invalid Valve messages
        inactiveStations: 20 - 3, // totalStations - activeStationsCount
      });

      // verify mocks called as expected
      expect(Employee.countDocuments).toHaveBeenCalledTimes(2);
      expect(Station.countDocuments).toHaveBeenCalledTimes(1);
      expect(Assignment.distinct).toHaveBeenCalledWith(
        "workingStation_name",
        expect.any(Object)
      );
      expect(collection).toHaveBeenCalledWith("mqttMsg");
      expect(find).toHaveBeenCalledWith(
        expect.objectContaining({
          timestamp: expect.any(Object),
        })
      );
      expect(toArray).toHaveBeenCalled();
    });

    it("handles empty mqtt collection gracefully", async () => {
      Employee.countDocuments.mockResolvedValueOnce(1);
      Employee.countDocuments.mockResolvedValueOnce(0);
      Station.countDocuments.mockResolvedValueOnce(5);
      Assignment.distinct.mockResolvedValueOnce([]);

      const toArray = jest.fn().mockResolvedValue([]);
      const find = jest.fn().mockReturnValue({ toArray });
      const collection = jest.fn().mockReturnValue({ find });
      mongoose.connection.db = { collection };

      const res = await request(app).get("/api/dashboard-data");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        inactiveWorkers: 0,
        activeWorkers: 1,
        dailyDefects: 0,
        inactiveStations: 5 - 0,
      });
    });

    it("returns 500 if DB collection.find throws", async () => {
      Employee.countDocuments.mockResolvedValueOnce(1);
      Employee.countDocuments.mockResolvedValueOnce(0);
      Station.countDocuments.mockResolvedValueOnce(5);
      Assignment.distinct.mockResolvedValueOnce([]);

      // Simulate DB find throwing
      const find = jest.fn().mockImplementation(() => {
        throw new Error("DB error");
      });
      const collection = jest.fn().mockReturnValue({ find });
      mongoose.connection.db = { collection };

      const res = await request(app).get("/api/dashboard-data");
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty(
        "message",
        "Error calculating dashboard data"
      );
      expect(res.body).toHaveProperty("error", "DB error");
    });
  });

  describe("GET /api/shluker-results", () => {
    it("returns proper and improper counts", async () => {
      const msgs = [
        {
          message: JSON.stringify({ "Shluker Result": "Good Valve" }),
          timestamp: new Date(),
        },
        {
          message: JSON.stringify({ "Shluker Result": "Invalid Valve" }),
          timestamp: new Date(),
        },
        {
          message: JSON.stringify({ "Shluker Result": "Good Valve" }),
          timestamp: new Date(),
        },
        {
          message: JSON.stringify({ "Shluker Result": "Invalid Valve" }),
          timestamp: new Date(),
        },
        { message: "not a json", timestamp: new Date() }, // will be caught and ignored
      ];

      const toArray = jest.fn().mockResolvedValue(msgs);
      const find = jest.fn().mockReturnValue({ toArray });
      const collection = jest.fn().mockReturnValue({ find });
      mongoose.connection.db = { collection };

      const res = await request(app).get("/api/shluker-results");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ proper: 2, improper: 2 });

      expect(collection).toHaveBeenCalledWith("mqttMsg");
      expect(find).toHaveBeenCalled();
      expect(toArray).toHaveBeenCalled();
    });

    it("returns 500 if fetching messages fails", async () => {
      const find = jest.fn().mockImplementation(() => {
        throw new Error("fetch fail");
      });
      const collection = jest.fn().mockReturnValue({ find });
      mongoose.connection.db = { collection };

      const res = await request(app).get("/api/shluker-results");
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty(
        "message",
        "Error fetching Shluker results"
      );
      expect(res.body).toHaveProperty("error", "fetch fail");
    });
  });
});
