const request = require("supertest");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = require("../../routes/authRoutes");
const User = require("../../models/User");

// Mock auth middlewares for routes that require them
jest.mock("../../middleware/auth", () => ({
  requireAuth: (req, res, next) => {
    // simulate admin user when needed by tests by setting req.user
    req.user = { userId: "adminId", isAdmin: true };
    next();
  },
  requireAdmin: (req, res, next) => next(),
}));

// Mock logger so tests remain quiet
jest.mock("../../utils/logger", () => ({
  db: jest.fn(),
  error: jest.fn(),
  success: jest.fn(),
  auth: jest.fn(),
}));

// Mock User model
jest.mock("../../models/User");

// Mock bcrypt and jwt
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const app = express();
app.use(express.json());
app.use("/api", router);

describe("Auth routes", () => {
  const OLD_ENV = process.env;

  beforeAll(() => {
    // ensure JWT_SECRET exists for any code paths that might use it
    process.env = { ...OLD_ENV, JWT_SECRET: "test-secret" };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ---------------- POST /login ----------------
  describe("POST /api/login", () => {
    it("should login successfully and return token + user", async () => {
      // mock user returned from DB
      const mockUser = {
        _id: "u1",
        username: "alice",
        password: "hashedpassword",
        isAdmin: false,
      };
      User.findOne.mockResolvedValue(mockUser);

      // bcrypt.compare returns true
      bcrypt.compare.mockResolvedValue(true);

      // jwt.sign returns a fake token
      jwt.sign.mockReturnValue("fake-jwt-token");

      const res = await request(app)
        .post("/api/login")
        .send({ username: "alice", password: "secret123" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBe("fake-jwt-token");
      expect(res.body.user).toEqual({
        id: mockUser._id,
        username: mockUser.username,
        isAdmin: false,
      });

      // ensure DB findOne was called with the username
      expect(User.findOne).toHaveBeenCalledWith({ username: "alice" });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "secret123",
        "hashedpassword"
      );
      expect(jwt.sign).toHaveBeenCalled();
    });

    it("should return 401 if user not found", async () => {
      User.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post("/api/login")
        .send({ username: "missing", password: "whatever" });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Invalid username or password");
    });

    it("should return 401 for incorrect password", async () => {
      const mockUser = { _id: "u2", username: "bob", password: "hashed" };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      const res = await request(app)
        .post("/api/login")
        .send({ username: "bob", password: "badpass" });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Invalid username or password");
    });

    it("should return 400 for validation errors (missing fields)", async () => {
      // missing password
      const res = await request(app).post("/api/login").send({ username: "" });

      expect(res.status).toBe(400);
      // handler returns { errors: [...] }
      expect(res.body).toHaveProperty("errors");
      expect(Array.isArray(res.body.errors)).toBe(true);
    });
  });

  // ---------------- POST /register ----------------
  describe("POST /api/register", () => {
    it("should create user successfully (admin route)", async () => {
      // For register route we use requireAuth + requireAdmin mocked above

      // Mock User.findOne(...).select(...) returning null (no existing user)
      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      // Mock bcrypt.hash to return hashed password
      bcrypt.hash.mockResolvedValue("hashed-new-pass");

      // Mock User.create to return created user
      User.create.mockResolvedValue({
        _id: "newUserId",
        username: "newuser",
        isAdmin: false,
      });

      const res = await request(app)
        .post("/api/register")
        .send({ username: "newuser", password: "password123", isAdmin: false });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toEqual({
        id: "newUserId",
        username: "newuser",
        isAdmin: false,
      });

      expect(User.findOne).toHaveBeenCalledWith({ username: "newuser" });
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(User.create).toHaveBeenCalled();
    });

    it("should return 409 when username already exists", async () => {
      // Simulate existing user; chain select
      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue({ _id: "existingId" }),
      });

      const res = await request(app)
        .post("/api/register")
        .send({ username: "existing", password: "password123" });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Username already exists");
    });

    it("should return 400 for validation errors on register", async () => {
      const res = await request(app).post("/api/register").send({
        username: "ab", // too short (min 3)
        password: "123", // too short (min 6)
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("errors");
      expect(Array.isArray(res.body.errors)).toBe(true);
    });
  });

  // ---------------- PUT /users/:username/password ----------------
  describe("PUT /api/users/:username/password", () => {
    it("should update user's password (admin route) successfully", async () => {
      // Simulate finding a user (no chaining needed here)
      const mockUser = {
        _id: "u7",
        username: "targetUser",
        save: jest.fn().mockResolvedValue(true),
      };
      User.findOne.mockResolvedValue(mockUser);

      // Mock bcrypt.hash used to hash new password
      bcrypt.hash.mockResolvedValue("new-hash");

      const res = await request(app)
        .put("/api/users/targetUser/password")
        .send({ newPassword: "newpassword123" });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Password updated");

      // ensure password was set and save called
      expect(bcrypt.hash).toHaveBeenCalledWith("newpassword123", 10);
      expect(mockUser.save).toHaveBeenCalled();
      expect(User.findOne).toHaveBeenCalledWith({ username: "targetUser" });
    });

    it("should return 404 if user to update not found", async () => {
      User.findOne.mockResolvedValue(null);

      const res = await request(app)
        .put("/api/users/notthere/password")
        .send({ newPassword: "newpassword123" });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("User not found");
    });

    it("should return 400 for validation error (bad param or short password)", async () => {
      // invalid username param (too short) and short password
      const res = await request(app)
        .put("/api/users/ab/password")
        .send({ newPassword: "123" });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("errors");
      expect(Array.isArray(res.body.errors)).toBe(true);
    });
  });
});
