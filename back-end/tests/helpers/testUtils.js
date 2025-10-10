const jwt = require("jsonwebtoken");

/**
 * Generate a test JWT token
 * @param {Object} payload - Token payload
 * @returns {string} JWT token
 */
const generateTestToken = (payload = {}) => {
  const defaultPayload = {
    userId: "test-user-id",
    isAdmin: false,
    department: "test-department",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
  };

  return jwt.sign({ ...defaultPayload, ...payload }, process.env.JWT_SECRET);
};

/**
 * Generate a test admin JWT token
 * @returns {string} Admin JWT token
 */
const generateAdminToken = () => {
  return generateTestToken({ isAdmin: true });
};

/**
 * Mock request object for testing
 * @param {Object} options - Request options
 * @returns {Object} Mock request object
 */
const createMockRequest = (options = {}) => {
  return {
    headers: {},
    body: {},
    params: {},
    query: {},
    user: null,
    ...options,
  };
};

/**
 * Mock response object for testing
 * @returns {Object} Mock response object
 */
const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res;
};

/**
 * Mock next function for testing middleware
 * @returns {Function} Mock next function
 */
const createMockNext = () => {
  return jest.fn();
};

/**
 * Create test data for models
 */
const testData = {
  user: {
    username: "testuser",
    password: "$2b$10$test.hash.here",
    isAdmin: false,
  },
  employee: {
    person_id: "EMP001",
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@test.com",
    phone: "123-456-7890",
    department: "Production",
    role: "Worker",
    status: "Active",
  },
  station: {
    station_id: "STN001",
    name: "Test Station",
    department: "Production",
    status: "Active",
  },
  assignment: {
    employee_id: "EMP001",
    station_id: "STN001",
    start_time: new Date(),
    end_time: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours later
    status: "Active",
  },
};

module.exports = {
  generateTestToken,
  generateAdminToken,
  createMockRequest,
  createMockResponse,
  createMockNext,
  testData,
};
