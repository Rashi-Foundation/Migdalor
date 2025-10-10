const {
  errorHandler,
  notFound,
  asyncHandler,
} = require("../../middleware/errorHandler");
const {
  createMockRequest,
  createMockResponse,
  createMockNext,
} = require("../helpers/testUtils");

describe("Error Handler Middleware", () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = createMockRequest();
    mockRes = createMockResponse();
    mockNext = createMockNext();

    // Mock console.error to avoid noise in tests
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("errorHandler", () => {
    it("should handle generic errors with default status 500", () => {
      const error = new Error("Generic error message");

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: "Generic error message",
      });
    });

    it("should handle errors with custom status", () => {
      const error = new Error("Custom error");
      error.status = 400;

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: "Custom error",
      });
    });

    it("should handle errors without message", () => {
      const error = new Error();
      error.message = undefined;

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: "An unexpected error occurred",
      });
    });

    it("should include stack trace in development environment", () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";

      const error = new Error("Development error");

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: "Development error",
        stack: error.stack,
      });

      process.env.NODE_ENV = originalEnv;
    });

    it("should not include stack trace in production environment", () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";

      const error = new Error("Production error");

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: "Production error",
      });
      expect(mockRes.json).not.toHaveBeenCalledWith(
        expect.objectContaining({ stack: expect.anything() })
      );

      process.env.NODE_ENV = originalEnv;
    });

    it("should handle ValidationError", () => {
      const error = new Error("Validation failed");
      error.name = "ValidationError";
      error.errors = {
        field1: { message: "Field1 is required" },
        field2: { message: "Field2 must be a string" },
      };

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: "Validation Error",
        details: ["Field1 is required", "Field2 must be a string"],
      });
    });

    it("should handle CastError", () => {
      const error = new Error("Cast to ObjectId failed");
      error.name = "CastError";

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: "Invalid ID format",
      });
    });

    it("should handle duplicate key error (code 11000)", () => {
      const error = new Error("Duplicate key error");
      error.code = 11000;

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: "Duplicate field value",
      });
    });

    it("should handle JsonWebTokenError", () => {
      const error = new Error("Invalid token");
      error.name = "JsonWebTokenError";

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: "Invalid token",
      });
    });

    it("should handle TokenExpiredError", () => {
      const error = new Error("Token expired");
      error.name = "TokenExpiredError";

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: "Token expired",
      });
    });

    it("should log error stack to console", () => {
      const error = new Error("Test error");

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(console.error).toHaveBeenCalledWith(
        "🔴 Global Error Handler:",
        error.stack
      );
    });
  });

  describe("notFound", () => {
    it("should create 404 error and call next", () => {
      mockReq.originalUrl = "/api/nonexistent";

      notFound(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Route /api/nonexistent not found",
          status: 404,
        })
      );
    });

    it("should handle empty originalUrl", () => {
      mockReq.originalUrl = "";

      notFound(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Route  not found",
          status: 404,
        })
      );
    });

    it("should handle undefined originalUrl", () => {
      mockReq.originalUrl = undefined;

      notFound(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Route undefined not found",
          status: 404,
        })
      );
    });
  });

  describe("asyncHandler", () => {
    it("should call the wrapped function and pass through result", async () => {
      const mockFn = jest.fn().mockResolvedValue("success");
      const wrappedFn = asyncHandler(mockFn);

      await wrappedFn(mockReq, mockRes, mockNext);

      expect(mockFn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
    });

    it("should catch errors and pass them to next", async () => {
      const error = new Error("Async error");
      const mockFn = jest.fn().mockRejectedValue(error);
      const wrappedFn = asyncHandler(mockFn);

      await wrappedFn(mockReq, mockRes, mockNext);

      expect(mockFn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it("should handle functions that return promises", async () => {
      const mockFn = jest.fn().mockResolvedValue("promise result");
      const wrappedFn = asyncHandler(mockFn);

      await wrappedFn(mockReq, mockRes, mockNext);

      expect(mockFn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
    });

    it("should handle functions that return non-promises", async () => {
      const mockFn = jest.fn().mockReturnValue("direct result");
      const wrappedFn = asyncHandler(mockFn);

      await wrappedFn(mockReq, mockRes, mockNext);

      expect(mockFn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
    });
  });

  describe("Edge Cases", () => {
    it("should handle null error", () => {
      errorHandler(null, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: "An unexpected error occurred",
      });
    });

    it("should handle undefined error", () => {
      errorHandler(undefined, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: "An unexpected error occurred",
      });
    });

    it("should handle error with empty errors object", () => {
      const error = new Error("Validation failed");
      error.name = "ValidationError";
      error.errors = {};

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: "Validation Error",
        details: [],
      });
    });

    it("should handle error with null errors", () => {
      const error = new Error("Validation failed");
      error.name = "ValidationError";
      error.errors = null;

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: "Validation Error",
        details: [],
      });
    });
  });
});
