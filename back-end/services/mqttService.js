const mqtt = require("mqtt");
const mongoose = require("mongoose");

let mqttClient = null;

function setupMQTT() {
  // MQTT Client setup
  const mqttBroker = process.env.MQTT_BROKER;
  if (!mqttBroker) {
    console.error("❌ MQTT_BROKER environment variable is not set");
    return;
  }
  mqttClient = mqtt.connect(mqttBroker);

  mqttClient.on("connect", () => {
    console.log("🟢 Connected to MQTT broker");

    // Subscribe to topics
    mqttClient.subscribe("Braude/Shluker/#", (err) => {
      if (!err) {
        console.log("📡 Subscribed to Braude/Shluker/#");
      } else {
        console.error("❌ Failed to subscribe to MQTT topic:", err);
      }
    });
  });

  mqttClient.on("message", async (topic, message) => {
    console.log(`📨 Received message on topic ${topic}: ${message.toString()}`);

    // Save the message to the mqttMsg collection
    try {
      const raw = message.toString();
      let parsed = null;
      try {
        parsed = JSON.parse(raw);
      } catch (_) {}

      const newMessage = {
        topic: topic,
        message: raw,
        timestamp: new Date(),
        // Convenience fields (if present in payload)
        station_id: parsed && parsed.station_id ? parsed.station_id : undefined,
        user_id: parsed && parsed["User ID"] ? parsed["User ID"] : undefined,
      };

      await mongoose.connection.db.collection("mqttMsg").insertOne(newMessage);
      console.log("💾 Message saved to mqttMsg collection");
    } catch (error) {
      console.error("❌ Error saving MQTT message to database:", error);
    }
  });

  mqttClient.on("error", (error) => {
    console.error("🔴 MQTT connection error:", error);
  });

  mqttClient.on("close", () => {
    console.log("🟡 MQTT connection closed");
  });

  mqttClient.on("reconnect", () => {
    console.log("🔄 MQTT reconnecting...");
  });

  return mqttClient;
}

function getMQTTClient() {
  return mqttClient;
}

function closeMQTT() {
  if (mqttClient) {
    mqttClient.end();
    console.log("👋 MQTT client disconnected");
    mqttClient = null; // Reset client to null
  }
}

// Function to reset client state (for testing)
function resetMQTTClient() {
  mqttClient = null;
}

module.exports = {
  setupMQTT,
  getMQTTClient,
  closeMQTT,
  resetMQTTClient,
};
