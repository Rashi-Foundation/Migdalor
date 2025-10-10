const mqtt = require("mqtt");
const mongoose = require("mongoose");
const {
  setupMQTT,
  getMQTTClient,
  closeMQTT,
  resetMQTTClient,
} = require("../../services/mqttService");

// Mock mqtt module
jest.mock("mqtt");

// Mock mongoose
jest.mock("mongoose", () => ({
  connection: {
    db: {
      collection: jest.fn().mockReturnValue({
        insertOne: jest.fn(),
      }),
    },
  },
}));

describe("MQTT Service", () => {
  let mockMqttClient;
  let consoleLogSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    // Mock console methods
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    // Create mock MQTT client
    mockMqttClient = {
      connect: jest.fn(),
      subscribe: jest.fn(),
      on: jest.fn(),
      end: jest.fn(),
    };

    // Mock mqtt.connect to return our mock client
    mqtt.connect.mockReturnValue(mockMqttClient);

    // Reset environment
    delete process.env.MQTT_BROKER;

    // Reset the service state
    resetMQTTClient();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    jest.clearAllMocks();
  });

  describe("setupMQTT", () => {
    it("should return undefined when MQTT_BROKER is not set", () => {
      const result = setupMQTT();

      expect(result).toBeUndefined();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "❌ MQTT_BROKER environment variable is not set"
      );
      expect(mqtt.connect).not.toHaveBeenCalled();
    });

    it("should connect to MQTT broker when MQTT_BROKER is set", () => {
      process.env.MQTT_BROKER = "mqtt://localhost:1883";

      const result = setupMQTT();

      expect(result).toBe(mockMqttClient);
      expect(mqtt.connect).toHaveBeenCalledWith("mqtt://localhost:1883");
    });

    it("should set up event handlers on MQTT client", () => {
      process.env.MQTT_BROKER = "mqtt://localhost:1883";

      setupMQTT();

      expect(mockMqttClient.on).toHaveBeenCalledWith(
        "connect",
        expect.any(Function)
      );
      expect(mockMqttClient.on).toHaveBeenCalledWith(
        "message",
        expect.any(Function)
      );
      expect(mockMqttClient.on).toHaveBeenCalledWith(
        "error",
        expect.any(Function)
      );
      expect(mockMqttClient.on).toHaveBeenCalledWith(
        "close",
        expect.any(Function)
      );
      expect(mockMqttClient.on).toHaveBeenCalledWith(
        "reconnect",
        expect.any(Function)
      );
    });

    it("should subscribe to Braude/Shluker/# topic on connect", () => {
      process.env.MQTT_BROKER = "mqtt://localhost:1883";

      setupMQTT();

      // Get the connect event handler
      const connectHandler = mockMqttClient.on.mock.calls.find(
        (call) => call[0] === "connect"
      )[1];

      // Simulate connect event
      connectHandler();

      expect(mockMqttClient.subscribe).toHaveBeenCalledWith(
        "Braude/Shluker/#",
        expect.any(Function)
      );
      expect(consoleLogSpy).toHaveBeenCalledWith("🟢 Connected to MQTT broker");
    });

    it("should log successful subscription", () => {
      process.env.MQTT_BROKER = "mqtt://localhost:1883";

      setupMQTT();

      const connectHandler = mockMqttClient.on.mock.calls.find(
        (call) => call[0] === "connect"
      )[1];
      connectHandler();

      // Get the subscribe callback
      const subscribeCallback = mockMqttClient.subscribe.mock.calls[0][1];
      subscribeCallback(null); // No error

      expect(consoleLogSpy).toHaveBeenCalledWith(
        "📡 Subscribed to Braude/Shluker/#"
      );
    });

    it("should log subscription error", () => {
      process.env.MQTT_BROKER = "mqtt://localhost:1883";

      setupMQTT();

      const connectHandler = mockMqttClient.on.mock.calls.find(
        (call) => call[0] === "connect"
      )[1];
      connectHandler();

      const subscribeCallback = mockMqttClient.subscribe.mock.calls[0][1];
      const error = new Error("Subscription failed");
      subscribeCallback(error);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "❌ Failed to subscribe to MQTT topic:",
        error
      );
    });

    it("should handle incoming messages", async () => {
      process.env.MQTT_BROKER = "mqtt://localhost:1883";
      const mockCollection = {
        insertOne: jest.fn().mockResolvedValue({ insertedId: "test-id" }),
      };
      mongoose.connection.db.collection.mockReturnValue(mockCollection);

      setupMQTT();

      const messageHandler = mockMqttClient.on.mock.calls.find(
        (call) => call[0] === "message"
      )[1];

      const topic = "Braude/Shluker/station1";
      const message = Buffer.from(
        '{"station_id": "STN001", "User ID": "USER123"}'
      );

      await messageHandler(topic, message);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        `📨 Received message on topic ${topic}: ${message.toString()}`
      );
      expect(mongoose.connection.db.collection).toHaveBeenCalledWith("mqttMsg");
      expect(mockCollection.insertOne).toHaveBeenCalledWith({
        topic: topic,
        message: message.toString(),
        timestamp: expect.any(Date),
        station_id: "STN001",
        user_id: "USER123",
      });
      expect(consoleLogSpy).toHaveBeenCalledWith(
        "💾 Message saved to mqttMsg collection"
      );
    });

    it("should handle non-JSON messages", async () => {
      process.env.MQTT_BROKER = "mqtt://localhost:1883";
      const mockCollection = {
        insertOne: jest.fn().mockResolvedValue({ insertedId: "test-id" }),
      };
      mongoose.connection.db.collection.mockReturnValue(mockCollection);

      setupMQTT();

      const messageHandler = mockMqttClient.on.mock.calls.find(
        (call) => call[0] === "message"
      )[1];

      const topic = "Braude/Shluker/station1";
      const message = Buffer.from("plain text message");

      await messageHandler(topic, message);

      expect(mockCollection.insertOne).toHaveBeenCalledWith({
        topic: topic,
        message: message.toString(),
        timestamp: expect.any(Date),
        station_id: undefined,
        user_id: undefined,
      });
    });

    it("should handle database errors when saving messages", async () => {
      process.env.MQTT_BROKER = "mqtt://localhost:1883";
      const mockCollection = {
        insertOne: jest.fn().mockRejectedValue(new Error("Database error")),
      };
      mongoose.connection.db.collection.mockReturnValue(mockCollection);

      setupMQTT();

      const messageHandler = mockMqttClient.on.mock.calls.find(
        (call) => call[0] === "message"
      )[1];

      const topic = "Braude/Shluker/station1";
      const message = Buffer.from("test message");

      await messageHandler(topic, message);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "❌ Error saving MQTT message to database:",
        expect.any(Error)
      );
    });

    it("should handle error events", () => {
      process.env.MQTT_BROKER = "mqtt://localhost:1883";

      setupMQTT();

      const errorHandler = mockMqttClient.on.mock.calls.find(
        (call) => call[0] === "error"
      )[1];
      const error = new Error("Connection failed");

      errorHandler(error);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "🔴 MQTT connection error:",
        error
      );
    });

    it("should handle close events", () => {
      process.env.MQTT_BROKER = "mqtt://localhost:1883";

      setupMQTT();

      const closeHandler = mockMqttClient.on.mock.calls.find(
        (call) => call[0] === "close"
      )[1];

      closeHandler();

      expect(consoleLogSpy).toHaveBeenCalledWith("🟡 MQTT connection closed");
    });

    it("should handle reconnect events", () => {
      process.env.MQTT_BROKER = "mqtt://localhost:1883";

      setupMQTT();

      const reconnectHandler = mockMqttClient.on.mock.calls.find(
        (call) => call[0] === "reconnect"
      )[1];

      reconnectHandler();

      expect(consoleLogSpy).toHaveBeenCalledWith("🔄 MQTT reconnecting...");
    });
  });

  describe("getMQTTClient", () => {
    it("should return null when no client is set", () => {
      const client = getMQTTClient();
      expect(client).toBeNull();
    });

    it("should return the MQTT client when set", () => {
      process.env.MQTT_BROKER = "mqtt://localhost:1883";
      setupMQTT();

      const client = getMQTTClient();
      expect(client).toBe(mockMqttClient);
    });
  });

  describe("closeMQTT", () => {
    it("should do nothing when no client is set", () => {
      closeMQTT();
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it("should close the MQTT client when set", () => {
      process.env.MQTT_BROKER = "mqtt://localhost:1883";
      setupMQTT();

      closeMQTT();

      expect(mockMqttClient.end).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith("👋 MQTT client disconnected");
    });
  });

  describe("Edge Cases", () => {
    it("should handle malformed JSON in messages", async () => {
      process.env.MQTT_BROKER = "mqtt://localhost:1883";
      const mockCollection = {
        insertOne: jest.fn().mockResolvedValue({ insertedId: "test-id" }),
      };
      mongoose.connection.db.collection.mockReturnValue(mockCollection);

      setupMQTT();

      const messageHandler = mockMqttClient.on.mock.calls.find(
        (call) => call[0] === "message"
      )[1];

      const topic = "Braude/Shluker/station1";
      const message = Buffer.from('{"invalid": json}'); // Malformed JSON

      await messageHandler(topic, message);

      expect(mockCollection.insertOne).toHaveBeenCalledWith({
        topic: topic,
        message: message.toString(),
        timestamp: expect.any(Date),
        station_id: undefined,
        user_id: undefined,
      });
    });

    it("should handle empty messages", async () => {
      process.env.MQTT_BROKER = "mqtt://localhost:1883";
      const mockCollection = {
        insertOne: jest.fn().mockResolvedValue({ insertedId: "test-id" }),
      };
      mongoose.connection.db.collection.mockReturnValue(mockCollection);

      setupMQTT();

      const messageHandler = mockMqttClient.on.mock.calls.find(
        (call) => call[0] === "message"
      )[1];

      const topic = "Braude/Shluker/station1";
      const message = Buffer.from("");

      await messageHandler(topic, message);

      expect(mockCollection.insertOne).toHaveBeenCalledWith({
        topic: topic,
        message: "",
        timestamp: expect.any(Date),
        station_id: undefined,
        user_id: undefined,
      });
    });

    it("should handle messages with different field names", async () => {
      process.env.MQTT_BROKER = "mqtt://localhost:1883";
      const mockCollection = {
        insertOne: jest.fn().mockResolvedValue({ insertedId: "test-id" }),
      };
      mongoose.connection.db.collection.mockReturnValue(mockCollection);

      setupMQTT();

      const messageHandler = mockMqttClient.on.mock.calls.find(
        (call) => call[0] === "message"
      )[1];

      const topic = "Braude/Shluker/station1";
      const message = Buffer.from(
        '{"station_id": "STN001", "user_id": "USER123"}'
      ); // Different field name

      await messageHandler(topic, message);

      expect(mockCollection.insertOne).toHaveBeenCalledWith({
        topic: topic,
        message: message.toString(),
        timestamp: expect.any(Date),
        station_id: "STN001",
        user_id: undefined, // Should be undefined because field name is "user_id" not "User ID"
      });
    });
  });
});
