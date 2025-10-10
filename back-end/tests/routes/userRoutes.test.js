const request = require("supertest");
const express = require("express");
const bcrypt = require("bcrypt");
const router = require("../../routes/userRoutes");
const User = require("../../models/User");
const { requireAuth, requireAdmin } = require("../../middleware/auth");

//Mock middlewares
jest.mock("../../middleware/auth", () => ({
  requireAuth: (req, res, next) => {
    req.user = { userId: "123" }; // mock logged-in user
    next();
  },
  requireAdmin: (req, res, next) => next(),
}));

// Mock logger to avoid clutter
jest.mock("../../utils/logger", () => ({
  db: jest.fn(),
  error: jest.fn(),
  success: jest.fn(),
  auth: jest.fn(),
}));

// Mock User model
jest.mock("../../models/User");

const app = express();
app.use(express.json());
app.use("/api", router);

describe("User Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/me", () => {
    it("should return user profile if user exists", async () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          _id: "123",
          person_id: "p1",
          username: "testuser",
          first_name: "Test",
          last_name: "User",
          email: "test@example.com",
          phone_number: "123456",
          department: "IT",
          role: "Dev",
          status: "active",
          isAdmin: false,
        }),
      });

      const res = await request(app).get("/api/me");
      expect(res.status).toBe(200);
      expect(res.body.username).toBe("testuser");
    });

    it("should return 404 if user not found", async () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });
      const res = await request(app).get("/api/me");
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("User not found");
    });
  });

  describe("PUT /api/me/password", () => {
    it("should update password successfully", async () => {
      const hashedPassword = await bcrypt.hash("newpassword", 10);
      User.findById.mockReturnValue({
        _id: "123",
        username: "testuser",
        save: jest.fn().mockResolvedValue(true),
      });

      const res = await request(app)
        .put("/api/me/password")
        .send({ newPassword: "newpassword" });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Password updated successfully");
    });

    it("should return 400 if password too short", async () => {
      const res = await request(app)
        .put("/api/me/password")
        .send({ newPassword: "123" });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Validation failed");
      expect(res.body.details[0].message).toBe(
        "Password must be at least 6 characters long"
      );
    });
    it("should return 404 for user not found", async () => {
      User.findById.mockReturnValue(null);
      const res = await request(app)
        .put("/api/me/password")
        .send({ newPassword: "newpassword" });
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("User not found");
    });
  });

  describe("GET /api/users", () => {
    it("should return a list of users", async () => {
      User.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue([
            { _id: "1", username: "user1", isAdmin: true },
            { _id: "2", username: "user2", isAdmin: false },
          ]),
        }),
      });
      const res = await request(app).get("/api/users");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0].username).toBe("user1");
      expect(res.body[1].username).toBe("user2");
      expect(res.body[0]).toHaveProperty("id");
      expect(res.body[0]).toHaveProperty("username");
      expect(res.body[0]).toHaveProperty("isAdmin");
    });
    it("should return server error on exception", async () => {
      User.find.mockImplementation(() => {
        throw new Error("DB error");
      });
      const res = await request(app).get("/api/users");
      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Server error");
    });
  });

  describe("DELETE /api/users/:username", () => {
    it("should delete user successfully", async () => {
      User.findOne.mockResolvedValue({ _id: "2", username: "user2" });
      User.deleteOne.mockResolvedValue({ deletedCount: 1 });

      const res = await request(app).delete("/api/users/user2");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
    it("should prevent deleting admin user", async () => {
      User.findOne.mockResolvedValue({ username: "admin" });

      const res = await request(app).delete("/api/users/admin");
      expect(res.status).toBe(403);
      expect(res.body.message).toBe("Cannot delete the 'admin' user");
    });

    it("should return 404 if user not found", async () => {
      User.findOne.mockResolvedValue(null);
      const res = await request(app).delete("/api/users/nonexistent");
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("User not found");
    });
  });
});
