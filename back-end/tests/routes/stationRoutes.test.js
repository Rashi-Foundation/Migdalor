// tests/routes/stationRoutes.test.js
const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");

// Mock models
jest.mock("../../models/station");
jest.mock("../../models/product");
jest.mock("../../models/workingStation");
jest.mock("../../models/assignment");

const Station = require("../../models/station");
const Product = require("../../models/product");
const WorkingStation = require("../../models/workingStation");
const Assignment = require("../../models/assignment");

// Mock logger
jest.mock("../../utils/logger", () => ({
  db: jest.fn(),
  success: jest.fn(),
  error: jest.fn(),
}));

// Mock auth middleware to bypass auth in tests
jest.mock("../../middleware/auth", () => ({
  requireAuth: (req, res, next) => next(),
  requireAdmin: (req, res, next) => next(),
}));

const router = require("../../routes/stationRoutes");
const app = express();
app.use(express.json());
app.use("/api", router);

describe("Station Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/stations", () => {
    it("returns all stations", async () => {
      Station.find.mockResolvedValue([
        { station_name: "S1" },
        { station_name: "S2" },
      ]);
      const res = await request(app).get("/api/stations");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        { station_name: "S1" },
        { station_name: "S2" },
      ]);
    });

    it("returns 500 on DB error", async () => {
      Station.find.mockRejectedValue(new Error("DB fail"));
      const res = await request(app).get("/api/stations");
      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Error fetching stations");
    });
  });

  describe("GET /api/products", () => {
    it("returns all products with product_name", async () => {
      Product.find.mockReturnValue({
        select: jest.fn().mockResolvedValue([{ product_name: "P1" }]),
      });
      const res = await request(app).get("/api/products");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ product_name: "P1" }]);
    });
  });

  describe("GET /api/workstations/:stationName", () => {
    it("returns 404 if station not found", async () => {
      Station.findOne.mockResolvedValue(null);
      const res = await request(app).get("/api/workstations/S1");
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Station not found");
    });

    it("returns workstations for station", async () => {
      Station.findOne.mockResolvedValue({ station_name: "S1" });
      WorkingStation.find.mockResolvedValue([{ ws_name: "WS1" }]);
      const res = await request(app).get("/api/workstations/S1");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ ws_name: "WS1" }]);
    });
  });

  describe("POST /api/stations", () => {
    it("creates a new station", async () => {
      Station.findOne.mockResolvedValue(null);
      Station.countDocuments.mockResolvedValue(2);
      const saveMock = jest
        .fn()
        .mockResolvedValue({ station_name: "New", station_id: "ST003" });
      Station.mockImplementation(() => ({ save: saveMock }));

      const res = await request(app).post("/api/stations").send({
        station_name: "New",
        department: "Dept",
        product_name: "Prod",
      });
      expect(res.status).toBe(201);
      expect(res.body).toEqual({ station_name: "New", station_id: "ST003" });
    });

    it("returns 400 if station exists", async () => {
      Station.findOne.mockResolvedValue({ station_name: "Existing" });
      const res = await request(app).post("/api/stations").send({
        station_name: "Existing",
        department: "Dept",
        product_name: "Prod",
      });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Station with this name already exists");
    });
  });

  describe("PUT /api/stations/:id", () => {
    it("updates station successfully", async () => {
      const updated = {
        station_name: "Updated",
        department: "Dept",
        product_name: "Prod",
      };
      Station.findByIdAndUpdate.mockResolvedValue(updated);
      const res = await request(app)
        .put("/api/stations/507f191e810c19729de860ea")
        .send(updated);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(updated);
    });

    it("returns 404 if station not found", async () => {
      Station.findByIdAndUpdate.mockResolvedValue(null);
      const res = await request(app)
        .put("/api/stations/507f191e810c19729de860ea")
        .send({
          station_name: "Updated",
          department: "Dept",
          product_name: "Prod",
        });
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Station not found");
    });
  });

  describe("DELETE /api/stations/:id", () => {
    it("deletes station successfully", async () => {
      Station.findById.mockResolvedValue({ station_name: "S1" });
      Assignment.find.mockResolvedValue([]);
      WorkingStation.deleteMany.mockResolvedValue({});
      Station.findByIdAndDelete.mockResolvedValue({});
      const res = await request(app).delete(
        "/api/stations/507f191e810c19729de860ea"
      );
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Station deleted successfully");
    });

    it("returns 404 if station not found", async () => {
      Station.findById.mockResolvedValue(null);
      const res = await request(app).delete(
        "/api/stations/507f191e810c19729de860ea"
      );
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Station not found");
    });

    it("returns 400 if station has active assignments", async () => {
      Station.findById.mockResolvedValue({ station_name: "S1" });
      Assignment.find.mockResolvedValue([{}]);
      const res = await request(app).delete(
        "/api/stations/507f191e810c19729de860ea"
      );
      expect(res.status).toBe(400);
      expect(res.body.message).toBe(
        "Cannot delete station with active assignments"
      );
    });
  });
});
