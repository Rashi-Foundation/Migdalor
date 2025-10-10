const mongoose = require("mongoose");

/**
 * Database mock utilities for testing
 */
class DatabaseMock {
  constructor() {
    this.collections = {};
  }

  /**
   * Mock mongoose model methods
   * @param {string} modelName - Name of the model
   * @param {Object} mockData - Mock data to return
   * @returns {Object} Mocked model
   */
  mockModel(modelName, mockData = {}) {
    const mockModel = {
      find: jest.fn(),
      findById: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      updateOne: jest.fn(),
      updateMany: jest.fn(),
      deleteOne: jest.fn(),
      deleteMany: jest.fn(),
      countDocuments: jest.fn(),
      aggregate: jest.fn(),
      ...mockData,
    };

    // Mock static methods
    Object.keys(mockModel).forEach((method) => {
      if (typeof mockModel[method] === "function") {
        mockModel[method].mockReturnValue(mockModel);
      }
    });

    return mockModel;
  }

  /**
   * Create a mock document
   * @param {Object} data - Document data
   * @returns {Object} Mock document
   */
  createMockDocument(data = {}) {
    return {
      _id: new mongoose.Types.ObjectId(),
      ...data,
      save: jest.fn().mockResolvedValue(this),
      toObject: jest.fn().mockReturnValue(data),
      toJSON: jest.fn().mockReturnValue(data),
    };
  }

  /**
   * Mock successful database operations
   * @param {Object} model - Model to mock
   * @param {string} operation - Operation type
   * @param {*} result - Result to return
   */
  mockSuccessfulOperation(model, operation, result) {
    switch (operation) {
      case "find":
        model.find.mockResolvedValue(result);
        break;
      case "findById":
        model.findById.mockResolvedValue(result);
        break;
      case "findOne":
        model.findOne.mockResolvedValue(result);
        break;
      case "create":
        model.create.mockResolvedValue(result);
        break;
      case "save":
        model.save.mockResolvedValue(result);
        break;
      case "updateOne":
        model.updateOne.mockResolvedValue({
          acknowledged: true,
          modifiedCount: 1,
        });
        break;
      case "deleteOne":
        model.deleteOne.mockResolvedValue({
          acknowledged: true,
          deletedCount: 1,
        });
        break;
      case "countDocuments":
        model.countDocuments.mockResolvedValue(result);
        break;
    }
  }

  /**
   * Mock database errors
   * @param {Object} model - Model to mock
   * @param {string} operation - Operation type
   * @param {Error} error - Error to throw
   */
  mockDatabaseError(model, operation, error) {
    switch (operation) {
      case "find":
        model.find.mockRejectedValue(error);
        break;
      case "findById":
        model.findById.mockRejectedValue(error);
        break;
      case "findOne":
        model.findOne.mockRejectedValue(error);
        break;
      case "create":
        model.create.mockRejectedValue(error);
        break;
      case "save":
        model.save.mockRejectedValue(error);
        break;
      case "updateOne":
        model.updateOne.mockRejectedValue(error);
        break;
      case "deleteOne":
        model.deleteOne.mockRejectedValue(error);
        break;
    }
  }

  /**
   * Reset all mocks
   */
  resetMocks() {
    jest.clearAllMocks();
  }
}

/**
 * Mock MQTT service
 */
const mockMqttService = {
  setupMQTT: jest.fn(),
  publish: jest.fn(),
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
  end: jest.fn(),
};

/**
 * Mock external services
 */
const mockServices = {
  mqtt: mockMqttService,
  database: new DatabaseMock(),
};

module.exports = {
  DatabaseMock,
  mockMqttService,
  mockServices,
};
