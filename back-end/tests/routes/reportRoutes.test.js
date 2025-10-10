// tests/routes/reportRoutes.test.js
const request = require("supertest");
const express = require("express");

// Mock station model BEFORE requiring the router
jest.mock("../../models/station");
const Station = require("../../models/station");

// Mock logger
jest.mock("../../utils/logger", () => ({
  report: jest.fn(),
  db: jest.fn(),
  error: jest.fn(),
}));

const router = require("../../routes/reportRoutes");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use("/api", router);

describe("Report routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
    mongoose.connection.db = undefined;
  });

  // Helper: create a mocked collection whose find(query).toArray() returns only messages matching the query
  function mockMqttMessages(allMessages) {
    // make copies so we don't mutate original test arrays
    const messages = allMessages.map((m) => ({ ...m }));

    const toArray = jest.fn().mockImplementation(async () => {
      // Use the lastQuery captured below to filter messages
      const q = lastQuery || {};
      const ts = q.timestamp || {};
      const gte = ts.$gte;
      const lt = ts.$lt;

      return messages.filter((msg) => {
        // timestamp checks (if provided)
        if (gte && !(new Date(msg.timestamp) >= new Date(gte))) return false;
        if (lt && !(new Date(msg.timestamp) < new Date(lt))) return false;
        // station_id check (if provided)
        if (q.station_id && msg.station_id !== q.station_id) return false;
        return true;
      });
    });

    let lastQuery = null;
    const find = jest.fn().mockImplementation((query = {}) => {
      lastQuery = query;
      return { toArray };
    });
    const collection = jest.fn().mockReturnValue({ find });

    mongoose.connection.db = { collection };
    return { collection, find, toArray };
  }

  describe("GET /api/report (monthly production)", () => {
    it("returns aggregated daily counts for last month (monthly production)", async () => {
      const d1 = new Date();
      d1.setDate(d1.getDate() - 3);
      d1.setHours(12, 0, 0, 0);
      const d2 = new Date();
      d2.setDate(d2.getDate() - 2);
      d2.setHours(15, 30, 0, 0);

      const messages = [
        {
          message: JSON.stringify({ "Shluker Result": "Good Valve" }),
          timestamp: d1,
        },
        {
          message: JSON.stringify({ "Shluker Result": "Invalid Valve" }),
          timestamp: d1,
        },
        {
          message: JSON.stringify({ "Shluker Result": "Invalid Valve" }),
          timestamp: d2,
        },
      ];

      mockMqttMessages(messages);

      const res = await request(app).get("/api/report");
      expect(res.status).toBe(200);

      const date1 = d1.toISOString().split("T")[0];
      const date2 = d2.toISOString().split("T")[0];
      const expected = [
        { _id: date1, goodValves: 1, invalidValves: 1 },
        { _id: date2, goodValves: 0, invalidValves: 1 },
      ].sort((a, b) => a._id.localeCompare(b._id));

      expect(res.body).toEqual(expected);
    });

    it("respects stationId filter when provided (monthly production)", async () => {
      const today = new Date();
      const messages = [
        {
          message: JSON.stringify({ "Shluker Result": "Good Valve" }),
          timestamp: today,
          station_id: "S1",
        },
        {
          message: JSON.stringify({ "Shluker Result": "Invalid Valve" }),
          timestamp: today,
          station_id: "S2",
        },
      ];

      const { find } = mockMqttMessages(messages);

      const res = await request(app)
        .get("/api/report")
        .query({ stationId: "S1" });
      expect(res.status).toBe(200);

      const date = today.toISOString().split("T")[0];
      // Only the S1 message should be counted
      expect(res.body).toEqual([
        { _id: date, goodValves: 1, invalidValves: 0 },
      ]);

      expect(find).toHaveBeenCalledWith(
        expect.objectContaining({ station_id: "S1" })
      );
    });
  });

  describe("GET /api/report (monthly employee)", () => {
    it("returns counts filtered by User ID when employee query param provided", async () => {
      const today = new Date();
      const messages = [
        {
          message: JSON.stringify({
            "Shluker Result": "Good Valve",
            "User ID": "emp1",
          }),
          timestamp: today,
        },
        {
          message: JSON.stringify({
            "Shluker Result": "Invalid Valve",
            "User ID": "emp1",
          }),
          timestamp: today,
        },
        {
          message: JSON.stringify({
            "Shluker Result": "Good Valve",
            "User ID": "other",
          }),
          timestamp: today,
        },
      ];

      mockMqttMessages(messages);

      const res = await request(app)
        .get("/api/report")
        .query({ employee: "emp1" });
      expect(res.status).toBe(200);

      // monthly employee returns array of date entries like monthly production
      const date = today.toISOString().split("T")[0];
      expect(res.body).toEqual([
        { _id: date, goodValves: 1, invalidValves: 1 },
      ]);
    });

    it("returns 0 counts if no messages for employee", async () => {
      const messages = [
        {
          message: JSON.stringify({
            "Shluker Result": "Good Valve",
            "User ID": "someone",
          }),
          timestamp: new Date(),
        },
      ];
      mockMqttMessages(messages);

      const res = await request(app)
        .get("/api/report")
        .query({ employee: "nonexistent" });
      expect(res.status).toBe(200);
      // If no messages for employee, function returns an empty array
      expect(res.body).toEqual([]);
    });
  });

  describe("GET /api/report (date range)", () => {
    it("returns aggregated counts for a single date (date param)", async () => {
      const date = new Date();
      date.setHours(10, 0, 0, 0);
      const prevDay = new Date(date.getTime() - 24 * 60 * 60 * 1000);

      const messages = [
        {
          message: JSON.stringify({ "Shluker Result": "Good Valve" }),
          timestamp: date,
        },
        {
          message: JSON.stringify({ "Shluker Result": "Invalid Valve" }),
          timestamp: date,
        },
        {
          message: JSON.stringify({ "Shluker Result": "Good Valve" }),
          timestamp: prevDay,
        },
      ];

      mockMqttMessages(messages);

      const dateStr = date.toISOString().split("T")[0];
      const res = await request(app)
        .get("/api/report")
        .query({ date: dateStr });
      expect(res.status).toBe(200);
      // generateRangeReport returns an object { goodValves, invalidValves }
      expect(res.body).toEqual({ goodValves: 1, invalidValves: 1 });
    });

    it("returns aggregated counts for a startDate & endDate range", async () => {
      const start = new Date();
      start.setDate(start.getDate() - 2);
      start.setHours(3, 0, 0, 0);
      const middle = new Date(start.getTime() + 24 * 60 * 60 * 1000);
      const end = new Date(start.getTime() + 2 * 24 * 60 * 60 * 1000);

      const messages = [
        {
          message: JSON.stringify({ "Shluker Result": "Good Valve" }),
          timestamp: start,
        },
        {
          message: JSON.stringify({ "Shluker Result": "Invalid Valve" }),
          timestamp: middle,
        },
        {
          message: JSON.stringify({ "Shluker Result": "Good Valve" }),
          timestamp: end,
        },
      ];

      mockMqttMessages(messages);

      const res = await request(app)
        .get("/api/report")
        .query({
          startDate: start.toISOString().split("T")[0],
          endDate: end.toISOString().split("T")[0],
        });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ goodValves: 2, invalidValves: 1 });
    });
  });

  describe("station name -> stationId translation", () => {
    it("resolves station name to stationId before generating report", async () => {
      Station.findOne.mockResolvedValue({
        station_id: "resolved-1",
        station_name: "Sname",
      });

      const today = new Date();
      const messages = [
        {
          message: JSON.stringify({ "Shluker Result": "Good Valve" }),
          timestamp: today,
          station_id: "resolved-1",
        },
        {
          message: JSON.stringify({ "Shluker Result": "Invalid Valve" }),
          timestamp: today,
          station_id: "other",
        },
      ];
      const { find } = mockMqttMessages(messages);

      const res = await request(app)
        .get("/api/report")
        .query({ station: "Sname" });
      expect(res.status).toBe(200);
      const date = today.toISOString().split("T")[0];
      expect(res.body).toEqual([
        { _id: date, goodValves: 1, invalidValves: 0 },
      ]);

      expect(find).toHaveBeenCalledWith(
        expect.objectContaining({ station_id: "resolved-1" })
      );
      expect(Station.findOne).toHaveBeenCalledWith({ station_name: "Sname" });
    });

    it("proceeds without stationId when station name not found", async () => {
      Station.findOne.mockResolvedValue(null);

      const today = new Date();
      const messages = [
        {
          message: JSON.stringify({ "Shluker Result": "Good Valve" }),
          timestamp: today,
        },
      ];
      mockMqttMessages(messages);

      const res = await request(app)
        .get("/api/report")
        .query({ station: "Unknown" });
      expect(res.status).toBe(200);
      const date = today.toISOString().split("T")[0];
      expect(res.body).toEqual([
        { _id: date, goodValves: 1, invalidValves: 0 },
      ]);

      expect(Station.findOne).toHaveBeenCalledWith({ station_name: "Unknown" });
    });
  });

  describe("error handling", () => {
    it("returns 500 when DB throws during report generation", async () => {
      const find = jest.fn().mockImplementation(() => {
        throw new Error("db boom");
      });
      const collection = jest.fn().mockReturnValue({ find });
      mongoose.connection.db = { collection };

      const res = await request(app).get("/api/report");
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Error generating report" });
    });
  });
});
