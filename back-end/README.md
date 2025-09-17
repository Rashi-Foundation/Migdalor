# Migdalor Backend

A robust Node.js backend service for the Migdalor production management system, built with Express.js and MongoDB, featuring real-time communication via MQTT.

## 🚀 Features

### Core Functionality

- **RESTful API** - Complete CRUD operations for all entities
- **Authentication & Authorization** - JWT-based security with role-based access
- **Real-time Communication** - MQTT integration for live updates
- **Database Management** - MongoDB with Mongoose ODM
- **Data Validation** - Input validation and error handling
- **Logging System** - Comprehensive logging for debugging and monitoring

### API Endpoints

- **Authentication** - User login, registration, and session management
- **Employee Management** - Complete employee lifecycle management
- **Station Management** - Work station configuration and monitoring
- **Assignment System** - Employee assignment scheduling and tracking
- **Reports Generation** - Data aggregation and report generation
- **Dashboard Analytics** - Real-time production metrics

## 🛠️ Technology Stack

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **MQTT** - Message Queuing Telemetry Transport for real-time communication
- **bcrypt** - Password hashing and security
- **CORS** - Cross-Origin Resource Sharing support

## 📦 Installation

### Prerequisites

- Node.js 18 or higher
- MongoDB Atlas account or local MongoDB instance
- MQTT broker (optional, uses public broker by default)

### Setup

1. **Navigate to backend directory:**

   ```bash
   cd back-end
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create environment file:**

   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables:**

   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/migdalor
   PORT=8080
   JWT_SECRET=your_super_secret_jwt_key
   MQTT_BROKER=mqtt://broker.hivemq.com
   ```

5. **Initialize database:**

   ```bash
   node scripts/setup-database.js
   node scripts/seedData.js
   ```

6. **Start the server:**
   ```bash
   npm start
   ```

The server will start on `http://localhost:8080`

## 🏗️ Project Structure

```
back-end/
├── database/
│   └── atlas-connection.js    # MongoDB connection configuration
├── middleware/
│   ├── auth.js               # Authentication middleware
│   ├── errorHandler.js       # Global error handling
│   └── requestLogger.js      # Request logging middleware
├── models/
│   ├── assignment.js         # Assignment data model
│   ├── department.js         # Department data model
│   ├── Employee.js           # Employee data model
│   ├── product.js            # Product data model
│   ├── qualification.js      # Qualification data model
│   ├── station.js            # Station data model
│   ├── User.js               # User authentication model
│   └── workingStation.js     # Working station data model
├── routes/
│   ├── assignmentRoutes.js   # Assignment API endpoints
│   ├── authRoutes.js         # Authentication endpoints
│   ├── dashboardRoutes.js    # Dashboard analytics endpoints
│   ├── employeeRoutes.js     # Employee management endpoints
│   ├── qualificationRoutes.js # Qualification endpoints
│   ├── reportRoutes.js       # Report generation endpoints
│   ├── stationRoutes.js      # Station management endpoints
│   └── userRoutes.js         # User management endpoints
├── scripts/
│   ├── seedData.js           # Database seeding script
│   ├── setup-database.js     # Database initialization
│   └── simulator.js          # Data simulation for testing
├── services/
│   └── mqttService.js        # MQTT real-time communication
├── utils/
│   └── logger.js             # Logging utility
├── geneticAlgorithm.js       # Genetic algorithm for optimization
├── server.js                 # Main server file
└── package.json
```

## 📊 Database Schema

### Collections

#### **Users Collection**

```javascript
{
  _id: ObjectId,
  username: String (unique),
  password: String (bcrypt hashed),
  isAdmin: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### **Employees Collection**

```javascript
{
  _id: ObjectId,
  person_id: String (unique),
  first_name: String,
  last_name: String,
  email: String,
  phone: String,
  department: String,
  role: String,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### **Departments Collection**

```javascript
{
  _id: ObjectId,
  name: String (unique)
}
```

#### **Products Collection**

```javascript
{
  _id: ObjectId,
  product_name: String,
  company: String
}
```

#### **Stations Collection**

```javascript
{
  _id: ObjectId,
  station_id: String,
  station_name: String,
  department: String,
  product_name: String
}
```

#### **Working Stations Collection**

```javascript
{
  _id: ObjectId,
  station_name: String,
  workingStation_name: String,
  status: Boolean
}
```

#### **Assignments Collection**

```javascript
{
  _id: ObjectId,
  assignment_id: String,
  date: Date,
  number_of_hours: Number,
  workingStation_name: String,
  person_id: String
}
```

#### **Qualifications Collection**

```javascript
{
  _id: ObjectId,
  person_id: String,
  station_name: String,
  avg: Number
}
```

## 🔌 API Documentation

### Authentication Endpoints

#### **POST /api/login**

User authentication endpoint.

**Request Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "username": "string",
    "isAdmin": boolean
  }
}
```

#### **POST /api/register**

User registration endpoint (Admin only).

**Request Body:**

```json
{
  "username": "string",
  "password": "string",
  "isAdmin": boolean
}
```

### Employee Endpoints

#### **GET /api/employees**

Get all employees with optional filtering.

**Query Parameters:**

- `department` - Filter by department
- `status` - Filter by status
- `search` - Search by name or email

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "ObjectId",
      "person_id": "string",
      "first_name": "string",
      "last_name": "string",
      "email": "string",
      "phone": "string",
      "department": "string",
      "role": "string",
      "status": "string"
    }
  ]
}
```

#### **POST /api/employees**

Create a new employee.

**Request Body:**

```json
{
  "person_id": "string",
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "phone": "string",
  "department": "string",
  "role": "string",
  "status": "string"
}
```

#### **PUT /api/employees/:id**

Update an employee.

#### **DELETE /api/employees/:id**

Delete an employee.

### Station Endpoints

#### **GET /api/stations**

Get all stations.

#### **POST /api/stations**

Create a new station.

#### **PUT /api/stations/:id**

Update a station.

#### **DELETE /api/stations/:id**

Delete a station.

### Assignment Endpoints

#### **GET /api/assignments**

Get assignments with optional filtering.

**Query Parameters:**

- `date` - Filter by specific date
- `person_id` - Filter by employee
- `workingStation_name` - Filter by station

#### **POST /api/assignments**

Create a new assignment.

**Request Body:**

```json
{
  "assignment_id": "string",
  "date": "2024-01-01",
  "number_of_hours": 8,
  "workingStation_name": "string",
  "person_id": "string"
}
```

#### **PUT /api/assignments/:id**

Update an assignment.

#### **DELETE /api/assignments/:id**

Delete an assignment.

### Report Endpoints

#### **GET /api/reports/production**

Get production reports.

#### **GET /api/reports/assignments**

Get assignment reports.

#### **GET /api/reports/performance**

Get performance reports.

### Dashboard Endpoints

#### **GET /api/dashboard/overview**

Get dashboard overview data.

#### **GET /api/dashboard/metrics**

Get real-time metrics.

## 🔐 Authentication & Authorization

### JWT Token Structure

```json
{
  "userId": "ObjectId",
  "username": "string",
  "isAdmin": boolean,
  "iat": number,
  "exp": number
}
```

### Middleware Usage

#### **requireAuth**

Protects routes requiring authentication:

```javascript
router.get("/protected", requireAuth, (req, res) => {
  // Protected route logic
});
```

#### **requireAdmin**

Protects routes requiring admin privileges:

```javascript
router.post("/admin-only", requireAdmin, (req, res) => {
  // Admin-only route logic
});
```

## 🔄 Real-time Communication

### MQTT Integration

The backend uses MQTT for real-time updates:

```javascript
// Publish update
mqttClient.publish("migdalor/assignments", JSON.stringify(assignmentData));

// Subscribe to updates
mqttClient.subscribe("migdalor/assignments");
```

### MQTT Topics

- `migdalor/assignments` - Assignment updates
- `migdalor/employees` - Employee updates
- `migdalor/stations` - Station updates
- `migdalor/production` - Production metrics

## 📝 Logging System

### Log Levels

- **ERROR** - Error messages
- **WARN** - Warning messages
- **INFO** - General information
- **DEBUG** - Debug information

### Log Categories

- **AUTH** - Authentication events
- **DB** - Database operations
- **API** - API requests
- **MQTT** - MQTT events

### Usage

```javascript
const logger = require("../utils/logger");

logger.info("Operation completed", "API");
logger.error("Database connection failed", "DB");
logger.auth("User login", "user123");
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- --grep "Employee"
```

### Test Structure

```
tests/
├── unit/
│   ├── models/
│   ├── routes/
│   └── middleware/
├── integration/
│   ├── api/
│   └── database/
└── fixtures/
    ├── users.json
    └── employees.json
```

## 🔧 Configuration

### Environment Variables

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/migdalor

# Server
PORT=8080
NODE_ENV=development

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=24h

# MQTT
MQTT_BROKER=mqtt://broker.hivemq.com
MQTT_CLIENT_ID=migdalor_backend

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

### Database Configuration

The application uses MongoDB Atlas for cloud database hosting:

```javascript
// database/atlas-connection.js
const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};
```

## 🚀 Deployment

### Production Environment

1. **Set environment variables:**

   ```env
   NODE_ENV=production
   MONGODB_URI=your_production_mongodb_uri
   JWT_SECRET=your_production_jwt_secret
   ```

2. **Install production dependencies:**

   ```bash
   npm install --production
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --production

COPY . .
EXPOSE 8080

CMD ["npm", "start"]
```

### AWS App Runner

1. Connect GitHub repository
2. Configure build settings:
   - Build command: `npm install`
   - Start command: `node server.js`
   - Port: `8080`
3. Set environment variables
4. Deploy

## 📊 Monitoring & Health Checks

### Health Check Endpoint

```http
GET /health
```

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "database": "connected",
  "mqtt": "connected"
}
```

### Metrics Endpoint

```http
GET /metrics
```

Returns system metrics including:

- Memory usage
- CPU usage
- Database connection status
- MQTT connection status
- Request counts

## 🔍 Error Handling

### Global Error Handler

```javascript
app.use((err, req, res, next) => {
  logger.error(err.message, "API");

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});
```

### Error Types

- **ValidationError** - Input validation errors
- **AuthenticationError** - Authentication failures
- **AuthorizationError** - Authorization failures
- **DatabaseError** - Database operation errors
- **MQTTError** - MQTT communication errors

## 🔒 Security

### Security Measures

- **Password Hashing** - bcrypt with salt rounds
- **JWT Tokens** - Secure token-based authentication
- **CORS** - Cross-origin resource sharing protection
- **Input Validation** - Request data validation
- **Rate Limiting** - API rate limiting (optional)
- **HTTPS** - Secure communication in production

### Security Headers

```javascript
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
```

## 📈 Performance Optimization

### Database Optimization

- **Indexing** - Proper database indexing
- **Connection Pooling** - MongoDB connection pooling
- **Query Optimization** - Efficient database queries

### Caching

- **Memory Caching** - In-memory caching for frequently accessed data
- **Redis** - Optional Redis integration for distributed caching

### Load Balancing

- **PM2** - Process management for Node.js
- **Nginx** - Reverse proxy and load balancer

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**

   ```bash
   # Check MongoDB URI
   echo $MONGODB_URI

   # Test connection
   node scripts/test-connection.js
   ```

2. **JWT Token Issues**

   ```bash
   # Check JWT secret
   echo $JWT_SECRET

   # Verify token
   node scripts/verify-token.js
   ```

3. **MQTT Connection Issues**

   ```bash
   # Check MQTT broker
   echo $MQTT_BROKER

   # Test MQTT connection
   node scripts/test-mqtt.js
   ```

### Debug Mode

Enable debug mode:

```env
NODE_ENV=development
LOG_LEVEL=debug
```

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Documentation](https://jwt.io/)
- [MQTT.js Documentation](https://github.com/mqttjs/MQTT.js)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

---

**Migdalor Backend** - Robust, scalable, and secure API for production management.
