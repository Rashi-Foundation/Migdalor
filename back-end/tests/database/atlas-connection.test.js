// Mock mongoose with a real EventEmitter-like implementation
const mockConnectionOn = jest.fn();
const mockConnectionClose = jest.fn();

jest.mock("mongoose", () => ({
  connect: jest.fn(),
  connection: {
    name: "test-database",
    on: mockConnectionOn,
    close: mockConnectionClose,
  },
}));

jest.mock("dotenv", () => ({
  config: jest.fn(),
}));

const mongoose = require("mongoose");
const { connectToDatabase } = require("../../database/atlas-connection"); // Adjust path as needed

describe("Database Connection", () => {
  let originalEnv;
  let consoleLogSpy;
  let consoleErrorSpy;
  let processExitSpy;
  let sigintHandler;

  beforeAll(() => {
    // Capture SIGINT handler after module loads
    const sigintListeners = process.listeners("SIGINT");
    sigintHandler = sigintListeners[sigintListeners.length - 1];
  });

  beforeEach(() => {
    // Save original environment
    originalEnv = process.env;
    process.env = { ...originalEnv };

    // Setup spies
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    processExitSpy = jest.spyOn(process, "exit").mockImplementation();

    // Reset mongoose.connect mock
    mongoose.connect.mockClear();
    mongoose.connect.mockResolvedValue(undefined);
    mockConnectionClose.mockClear();
    mockConnectionClose.mockResolvedValue(undefined);
  });

  afterEach(() => {
    // Restore environment
    process.env = originalEnv;
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
  });

  describe("connectToDatabase", () => {
    test("should successfully connect to MongoDB with valid URI", async () => {
      process.env.ATLAS_URI = "mongodb://localhost:27017/testdb";

      await connectToDatabase();

      expect(mongoose.connect).toHaveBeenCalledWith(
        "mongodb://localhost:27017/testdb"
      );
      expect(consoleLogSpy).toHaveBeenCalledWith("🔄 Connecting to MongoDB...");
      expect(consoleLogSpy).toHaveBeenCalledWith(
        "✅ Pinged your deployment. You successfully connected to MongoDB!"
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        "📊 Connected to database:",
        "test-database"
      );
    });

    test("should throw error when ATLAS_URI is undefined", async () => {
      delete process.env.ATLAS_URI;

      await connectToDatabase();

      expect(mongoose.connect).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "❌ Error connecting to MongoDB:",
        "ATLAS_URI environment variable is not defined"
      );
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    test("should throw error when ATLAS_URI is empty string", async () => {
      process.env.ATLAS_URI = "";

      await connectToDatabase();

      expect(mongoose.connect).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "❌ Error connecting to MongoDB:",
        "ATLAS_URI environment variable is not defined"
      );
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    test("should throw error when ATLAS_URI is whitespace only", async () => {
      process.env.ATLAS_URI = "   ";

      await connectToDatabase();

      expect(mongoose.connect).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "❌ Error connecting to MongoDB:",
        "ATLAS_URI environment variable is not defined"
      );
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    test("should throw error when ATLAS_URI is string 'undefined'", async () => {
      process.env.ATLAS_URI = "undefined";

      await connectToDatabase();

      expect(mongoose.connect).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "❌ Error connecting to MongoDB:",
        "ATLAS_URI environment variable is not defined"
      );
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    test("should throw error when ATLAS_URI is string 'null'", async () => {
      process.env.ATLAS_URI = "null";

      await connectToDatabase();

      expect(mongoose.connect).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "❌ Error connecting to MongoDB:",
        "ATLAS_URI environment variable is not defined"
      );
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    test("should handle mongoose connection error", async () => {
      process.env.ATLAS_URI = "mongodb://localhost:27017/testdb";
      const connectionError = new Error("Connection failed");
      mongoose.connect.mockRejectedValue(connectionError);

      await connectToDatabase();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "❌ Error connecting to MongoDB:",
        "Connection failed"
      );
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });
  });

  describe("Connection Event Handlers", () => {
    let connectedHandler;
    let errorHandler;
    let disconnectedHandler;

    beforeAll(() => {
      // Extract handlers from the mock calls
      const calls = mockConnectionOn.mock.calls;

      connectedHandler = calls.find((call) => call[0] === "connected")?.[1];
      errorHandler = calls.find((call) => call[0] === "error")?.[1];
      disconnectedHandler = calls.find(
        (call) => call[0] === "disconnected"
      )?.[1];
    });

    test("should register connected event handler", () => {
      expect(mockConnectionOn).toHaveBeenCalledWith(
        "connected",
        expect.any(Function)
      );
      expect(connectedHandler).toBeDefined();
    });

    test("should register error event handler", () => {
      expect(mockConnectionOn).toHaveBeenCalledWith(
        "error",
        expect.any(Function)
      );
      expect(errorHandler).toBeDefined();
    });

    test("should register disconnected event handler", () => {
      expect(mockConnectionOn).toHaveBeenCalledWith(
        "disconnected",
        expect.any(Function)
      );
      expect(disconnectedHandler).toBeDefined();
    });

    test("should log message on connected event", () => {
      expect(connectedHandler).toBeDefined();

      connectedHandler();

      expect(consoleLogSpy).toHaveBeenCalledWith(
        "🟢 Mongoose connected to MongoDB"
      );
    });

    test("should log error on error event", () => {
      expect(errorHandler).toBeDefined();

      const testError = new Error("Test error");
      errorHandler(testError);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "🔴 Mongoose connection error:",
        testError
      );
    });

    test("should log message on disconnected event", () => {
      expect(disconnectedHandler).toBeDefined();

      disconnectedHandler();

      expect(consoleLogSpy).toHaveBeenCalledWith(
        "🟡 Mongoose disconnected from MongoDB"
      );
    });
  });

  describe("Graceful Shutdown", () => {
    test("should handle SIGINT signal", async () => {
      expect(sigintHandler).toBeDefined();

      await sigintHandler();

      expect(mockConnectionClose).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(
        "👋 MongoDB connection closed through app termination"
      );
      expect(processExitSpy).toHaveBeenCalledWith(0);
    });
  });

  describe("Module Exports", () => {
    test("should export connectToDatabase function", () => {
      expect(connectToDatabase).toBeDefined();
      expect(typeof connectToDatabase).toBe("function");
    });
  });
});
