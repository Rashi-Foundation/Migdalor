// tests/routes/qualificationRoutes.test.js
const request = require("supertest");
const express = require("express");

// --- mocks must be declared BEFORE requiring the router so the router uses them ---
// Mock auth middlewares (used by POST qualifications route)
jest.mock("../../middleware/auth", () => ({
  requireAuth: (req, res, next) => {
    // Pretend user is authenticated (admin)
    req.user = { userId: "admin", isAdmin: true };
    next();
  },
  requireAdmin: (req, res, next) => next(),
}));

// Mock logger to silence logs
jest.mock("../../utils/logger", () => ({
  db: jest.fn(),
  error: jest.fn(),
  success: jest.fn(),
}));

// Mock the Mongoose models
jest.mock("../../models/qualification");
jest.mock("../../models/Employee");

// Now require the router and models (they'll be the mocked versions)
const router = require("../../routes/qualificationRoutes");
const Qualification = require("../../models/qualification");
const Employee = require("../../models/Employee");

const app = express();
app.use(express.json());
app.use("/api", router);

describe("Qualification routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // ---------------- GET /qualifications ----------------
  describe("GET /api/qualifications", () => {
    it("returns all qualifications", async () => {
      const data = [
        { _id: "q1", person_id: "P1", station_name: "S1", avg: 90 },
        { _id: "q2", person_id: "P2", station_name: "S2", avg: 80 },
      ];
      Qualification.find.mockResolvedValue(data);

      const res = await request(app).get("/api/qualifications");
      expect(res.status).toBe(200);
      expect(res.body).toEqual(data);
      expect(Qualification.find).toHaveBeenCalledWith({});
    });

    it("returns 500 if DB throws", async () => {
      Qualification.find.mockImplementation(() => {
        throw new Error("db failure");
      });

      const res = await request(app).get("/api/qualifications");
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty(
        "message",
        "Error fetching qualifications"
      );
      expect(res.body).toHaveProperty("error", "db failure");
    });
  });

  // ---------------- POST /qualifications ----------------
  describe("POST /api/qualifications", () => {
    it("creates a new qualification successfully", async () => {
      const saved = { _id: "q3", person_id: "P3", station_name: "S3", avg: 75 };
      // Mock new Qualification().save()
      const mockSave = jest.fn().mockResolvedValue(saved);
      Qualification.mockImplementation(() => ({ save: mockSave }));

      const res = await request(app)
        .post("/api/qualifications")
        .send({ person_id: "P3", station_name: "S3", avg: 75 });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(saved);
      expect(mockSave).toHaveBeenCalled();
    });

    it("returns 400 for validation errors (missing fields / invalid avg)", async () => {
      // send missing station_name and invalid avg
      const res = await request(app)
        .post("/api/qualifications")
        .send({ person_id: "", station_name: "", avg: 200 });

      expect(res.status).toBe(400);
      // validation middleware may return different shapes (errors | details | message)
      // assert that at least one indicator of validation exists
      expect(
        res.body.errors ||
          res.body.details ||
          (res.body.message && /validation|Validation/i.test(res.body.message))
      ).toBeDefined();
    });
  });

  // ---------------- PUT /qualifications ----------------
  describe("PUT /api/qualifications", () => {
    it("updates (or creates) a qualification successfully when employee exists", async () => {
      const person = { _id: "emp1", person_id: "P10" };
      Employee.findOne.mockResolvedValue(person);

      const updatedQualification = {
        _id: "uq1",
        person_id: "P10",
        station_name: "S10",
        avg: 88,
      };
      // findOneAndUpdate should resolve to updated qualification
      Qualification.findOneAndUpdate = jest
        .fn()
        .mockResolvedValue(updatedQualification);

      const res = await request(app)
        .put("/api/qualifications")
        .send({ person_id: "P10", station_name: "S10", avg: 88 });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(updatedQualification);
      expect(Employee.findOne).toHaveBeenCalledWith({ person_id: "P10" });
      expect(Qualification.findOneAndUpdate).toHaveBeenCalledWith(
        { person_id: "P10", station_name: "S10" },
        { avg: 88 },
        { new: true, upsert: true }
      );
    });

    it("returns 404 if employee (person_id) not found", async () => {
      Employee.findOne.mockResolvedValue(null);

      const res = await request(app)
        .put("/api/qualifications")
        .send({ person_id: "NOTFOUND", station_name: "S1", avg: 50 });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Person not found");
      expect(Employee.findOne).toHaveBeenCalledWith({ person_id: "NOTFOUND" });
    });

    it("returns 400 for validation errors on PUT", async () => {
      const res = await request(app)
        .put("/api/qualifications")
        .send({ person_id: "", station_name: "", avg: -5 });

      expect(res.status).toBe(400);
      expect(
        res.body.errors ||
          res.body.details ||
          (res.body.message && /validation|Validation/i.test(res.body.message))
      ).toBeDefined();
    });
  });

  // ---------------- GET /qualifications/:employeeId ----------------
  describe("GET /api/qualifications/:employeeId", () => {
    it("returns qualifications for an employee", async () => {
      const data = [
        { _id: "q1", person_id: "P100", station_name: "Sx", avg: 90 },
      ];
      Qualification.find.mockResolvedValue(data);

      const res = await request(app).get("/api/qualifications/P100");
      expect(res.status).toBe(200);
      expect(res.body).toEqual(data);
      expect(Qualification.find).toHaveBeenCalledWith({ person_id: "P100" });
    });

    it("returns 500 if DB throws for employee qualifications", async () => {
      Qualification.find.mockImplementation(() => {
        throw new Error("find fail");
      });

      const res = await request(app).get("/api/qualifications/PERR");
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty(
        "message",
        "Error fetching qualifications"
      );
      expect(res.body).toHaveProperty("error", "find fail");
    });

    it("returns 400 for invalid/missing employeeId param", async () => {
      // Express won't match a route without the :employeeId param, so simulate an invalid param.
      // Use a short or blank param; the validate middleware trims and checks notEmpty.
      const res = await request(app).get("/api/qualifications/%20"); // encoded space -> trimmed to empty
      expect(res.status).toBe(400);
      expect(
        res.body.errors ||
          res.body.details ||
          (res.body.message && /validation|Validation/i.test(res.body.message))
      ).toBeDefined();
    });
  });
});
