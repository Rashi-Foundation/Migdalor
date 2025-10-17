const jwt = require("jsonwebtoken");
const { requireAuth, requireAdmin } = require("../../middleware/auth");
const {
  generateTestToken,
  generateAdminToken,
  createMockRequest,
  createMockResponse,
  createMockNext,
} = require("../helpers/testUtils");

describe("Auth Middleware", () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    // Ensure JWT_SECRET is set for tests
    process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret";
    mockReq = createMockRequest();
    mockRes = createMockResponse();
    mockNext = createMockNext();
  });

  describe("requireAuth", () => {
    it("should call next() when valid token is provided via Authorization header", () => {
      const token = generateTestToken();
      mockReq.headers.authorization = `Bearer ${token}`;

      requireAuth(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeDefined();
      expect(mockReq.user.userId).toBe("test-user-id");
    });

    it("should call next() when valid token is provided via httpOnly cookie", () => {
      const token = generateTestToken();
      mockReq.cookies = { token };

      requireAuth(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeDefined();
      expect(mockReq.user.userId).toBe("test-user-id");
    });

    it("should prefer cookie token over Authorization header", () => {
      const cookieToken = generateTestToken({ userId: "cookie-user-id" });
      const headerToken = generateTestToken({ userId: "header-user-id" });
      mockReq.cookies = { token: cookieToken };
      mockReq.headers.authorization = `Bearer ${headerToken}`;

      requireAuth(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeDefined();
      expect(mockReq.user.userId).toBe("cookie-user-id");
    });

    it("should return 401 when no token is provided (no header or cookie)", () => {
      requireAuth(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Unauthenticated" });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 401 when authorization header is empty", () => {
      mockReq.headers.authorization = "";

      requireAuth(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Unauthenticated" });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 401 when authorization header does not start with Bearer", () => {
      mockReq.headers.authorization = "Invalid token";

      requireAuth(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Unauthenticated" });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 401 when token is invalid", () => {
      mockReq.headers.authorization = "Bearer invalid-token";

      requireAuth(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Unauthenticated" });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 401 when token is expired", () => {
      const expiredToken = jwt.sign(
        { userId: "test-user-id", exp: Math.floor(Date.now() / 1000) - 3600 },
        process.env.JWT_SECRET
      );
      mockReq.headers.authorization = `Bearer ${expiredToken}`;

      requireAuth(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Unauthenticated" });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should set req.user with token payload when valid", () => {
      const tokenPayload = {
        userId: "custom-user-id",
        isAdmin: true,
        department: "custom-department",
      };
      const token = generateTestToken(tokenPayload);
      mockReq.headers.authorization = `Bearer ${token}`;

      requireAuth(mockReq, mockRes, mockNext);

      expect(mockReq.user).toEqual(expect.objectContaining(tokenPayload));
      expect(mockNext).toHaveBeenCalled();
    });

    it("should handle malformed authorization header", () => {
      mockReq.headers.authorization = "Bearer";

      requireAuth(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Unauthenticated" });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("requireAdmin", () => {
    beforeEach(() => {
      // Mock requireAuth to set req.user
      mockReq.user = { isAdmin: false };
    });

    it("should call next() when user is admin", () => {
      mockReq.user.isAdmin = true;

      requireAdmin(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should return 403 when user is not admin", () => {
      mockReq.user.isAdmin = false;

      requireAdmin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Forbidden" });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 403 when user.isAdmin is undefined", () => {
      mockReq.user.isAdmin = undefined;

      requireAdmin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Forbidden" });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 403 when user is null", () => {
      mockReq.user = null;

      requireAdmin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Forbidden" });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 403 when user is undefined", () => {
      mockReq.user = undefined;

      requireAdmin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Forbidden" });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should handle truthy non-boolean isAdmin values", () => {
      mockReq.user.isAdmin = "true";

      requireAdmin(mockReq, mockRes, mockNext);

      // The middleware should call next() for truthy values, not return 403
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("Integration Tests", () => {
    it("should work together: requireAuth then requireAdmin for admin user", () => {
      const adminToken = generateAdminToken();
      mockReq.headers.authorization = `Bearer ${adminToken}`;

      // First requireAuth
      requireAuth(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockReq.user.isAdmin).toBe(true);

      // Reset mockNext for second middleware
      mockNext.mockClear();

      // Then requireAdmin
      requireAdmin(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it("should work together: requireAuth then requireAdmin for non-admin user", () => {
      const userToken = generateTestToken({ isAdmin: false });
      mockReq.headers.authorization = `Bearer ${userToken}`;

      // First requireAuth
      requireAuth(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockReq.user.isAdmin).toBe(false);

      // Reset mockNext for second middleware
      mockNext.mockClear();

      // Then requireAdmin
      requireAdmin(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Forbidden" });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
