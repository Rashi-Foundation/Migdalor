# Migdalor - Production Management System

"""
For Test only : current username + password is :
usernmame : admin
password : adminadmin

"""

A comprehensive production management system built with React frontend and Node.js backend, featuring real-time communication, employee management, station assignments, and production analytics.

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **MongoDB Atlas** account (or local MongoDB)
- **Git** for version control

### 1. Clone Repository

```bash
git clone <repository-url>
cd Migdalor
```

### 2. Environment Setup

#### Backend Environment

```bash
cd back-end
cp .env.example .env
```

**Edit `.env` file with your configuration:**

```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/migdalor?retryWrites=true&w=majority

# Server Configuration
PORT=8080
# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

```

#### Frontend Environment

```bash
cd ../front-end
cp .env.example .env
```

**Edit `.env` file:**

```env
# API Configuration
VITE_REACT_APP_SERVER_URL=http://localhost:8080

```

### 3. Install Dependencies

```bash
# Backend
cd back-end
npm install

# Frontend
cd ../front-end
npm install
```

### 4. Database Setup

#### MongoDB Atlas Configuration

1. **Create Project and Cluster**

   - Go to [MongoDB Atlas](https://www.mongodb.com/)
   - Create a new project and cluster in MongoDB Atlas

2. **Configure Database Access**

   - Go to "Database Access" in Atlas
   - Create a new database user
   - Set username and password
   - Grant "Read and write to any database" permissions

3. **Configure Network Access**

   - Go to "Network Access" in Atlas
   - Add IP address `0.0.0.0/0` (for development)
   - For production, add specific IP addresses

4. **Get Connection String**

   - Go to "Clusters" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `migdalor`

5. **Update Environment Variables**
   ```env
   MONGODB_URI=mongodb+srv://username:password@migdalor-cluster.kqyqqvh.mongodb.net/migdalor?retryWrites=true&w=majority&appName=migdalor-cluster
   ```

#### Initialize Database

The database setup script will clear all existing data and populate the database with sample data for testing and development.

**⚠️ Warning**: This will delete all existing data in your database!

```bash
cd back-end
node scripts/setup-database.js
```

**What the setup script does:**

- Clears all existing collections (Users, Employees, Stations, etc.)
- Creates sample users with hashed passwords
- Inserts sample employees, stations, products, and departments
- Creates sample assignments and qualifications
- Adds historical MQTT messages for testing reports
- Displays a summary of inserted records

**Default Login Credentials:**

- **Admin User**: `admin` / `adminadmin`
- **Regular User**: `EMP001` / `secret123`

#### Customizing Seed Data

To modify the sample data, edit the following file:

```bash
# Edit seed data
nano scripts/seedData.js
```

**Key sections to customize:**

1. **Users** (`sampleUsers`): Add/modify login accounts
2. **Employees** (`sampleEmployees`): Employee profiles and departments
3. **Stations** (`sampleStations`): Production stations
4. **Working Stations** (`sampleWorkingStations`): Individual workstations
5. **Products** (`sampleProducts`): Products manufactured
6. **Departments** (`DEPARTMENTS`): Department names
7. **Assignments** (`sampleAssignments`): Work assignments
8. **Qualifications** (`sampleQualifications`): Employee skills per station

**After editing seed data:**

```bash
# Re-run setup to apply changes
node scripts/setup-database.js
```

### 5. Start Development Servers

#### Option 1: Start Both Servers Separately

```bash
# Terminal 1 - Backend
cd back-end
npm start

# Terminal 2 - Frontend
cd front-end
npm run dev
```

#### Option 2: Start Both Servers Together

```bash
cd front-end
npm run dev:full
```

### 6. Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **Default Login**: Check seeded data for credentials

## 🔐 Security Configuration

### JWT Secret Generation

**Important**: Generate a strong JWT secret for production:

```bash
# Generate a random secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Security Best Practices:**

1. **JWT Secret**: Use a long, random string (64+ characters)
2. **Environment Variables**: Never commit `.env` files to version control
3. **HTTPS**: Always use HTTPS in production
4. **CORS**: Configure CORS properly for your domain
5. **Rate Limiting**: Implement rate limiting for API endpoints

### Environment Variables Security

```env
# Production JWT Secret (generate new one)
JWT_SECRET=your_production_jwt_secret_here_64_chars_minimum

# Production Database
MONGODB_URI=mongodb+srv://prod-user:strong-password@cluster.mongodb.net/migdalor

# Production Frontend URL

# Production MQTT (if using private broker)
MQTT_BROKER=mqtts://your-mqtt-broker.com:8883

```

## 🚀 Deployment

### Frontend (React) – AWS Amplify Hosting

The React frontend is deployed using AWS Amplify Hosting.

#### Deployment Steps

1. **Connect GitHub Repository**

   - In the Amplify console, select "Connect App"
   - Choose GitHub as the source provider
   - Authenticate and select the repository: `migdalor`

2. **Select Branch**

   - From the repository branches, select: `main`

3. **Monorepo Configuration**

   - Enable the checkbox: "My app is a monorepo"
   - Set the monorepo root directory to: `front-end`

4. **Finalize & Deploy**

   - Review the configuration
   - Click Save and Deploy
   - Amplify will automatically build and host the frontend from the `front-end` directory

**Notes:**

- Each push to the main branch automatically triggers a new deployment
- The frontend will be accessible via the Amplify-generated URL

### Backend (Node.js Server) – AWS App Runner

The backend service is deployed on AWS App Runner.

#### Deployment Steps

1. **Source Configuration**

   - In the AWS App Runner console, select "Source code repository"
   - Connect the GitHub repository
   - Choose the branch: `main`
   - Set the source directory to: `/back-end`

2. **Deployment Trigger**

   - Select "Automatic" → new deployments will be triggered automatically whenever changes are pushed to the main branch

3. **Runtime and Build Settings**

   ```
   Runtime: Node.js 18
   Build command: npm install
   Start command: node server.js
   Port: 8080
   ```

4. **Service Settings – Environment Variables**

   Set the following environment variables for the backend service:

   ```env
   MONGODB_URI=
   PORT=8080
   MQTT_BROKER=mqtt://broker.hivemq.com
   JWT_SECRET=jwtsecret
   ```

   **Variable Details:**

   - `MONGODB_URI` → MongoDB Atlas connection string (used for database connection)
   - `PORT` → The port on which the Node.js server will run
   - `MQTT_BROKER` → Broker URL for the MQTT service (default: HiveMQ public broker)
   - `JWT_SECRET` → Secret key used for signing JSON Web Tokens (authentication & authorization)

### MQTT Protocol Integration

Our system uses the MQTT protocol to exchange real-time messages between devices and services.

#### Broker Setup

By default, the project is configured to connect to the test broker: `mqtt://broker.hivemq.com`

You can simulate messages using the HiveMQ WebSocket Client:
https://www.hivemq.com/demos/websocket-client/

To use your own broker, set the MQTT_BROKER variable inside the .env file:

```env
MQTT_BROKER=mqtt://<your-broker-address>
```

#### Subscribed Channels

The MQTT client subscribes to the following topic:

```
Braude/Shluker/#
```

The `#` wildcard means the client will receive all messages under `Braude/Shluker/*`.

#### Message Handling

When a message is received on any subscribed channel:

- The message is logged in the console for debugging
- The message is stored in the MongoDB database, in the collection: `mqttMsg`

#### Database Storage Format

Messages received from the MQTT broker are usually in JSON format. A typical incoming message looks like this:

```json
{
  "station_id": "station_001",
  "User ID": "user_123",
  "result": 22.5
}
```

- `station_id` → identifies the source station or device
- `User ID` → optional field indicating the user that triggered the event
- Other fields (`result`..) depend on the use case and are stored as part of the raw message

#### Error & Connection Handling

The MQTT client automatically handles the following events:

- **Connection success**: Logs "Connected to MQTT broker"
- **Subscription success/failure**: Logs subscription status
- **Incoming messages**: Logs and saves to database
- **Errors**: Logs any MQTT connection issues
- **Reconnects**: Attempts to reconnect if the broker connection is lost
- **Graceful shutdown**: On service stop, the client disconnects cleanly

## 🧪 Testing

### Run All Tests

```bash
# Backend tests
cd back-end
npm test

# Frontend tests
cd ../front-end
npm test

# E2E tests
npm run e2e
```

### Test Coverage

```bash
# Backend coverage
cd back-end
npm run test:coverage

# Frontend coverage
cd ../front-end
npm test -- --coverage
```

## 📁 Project Structure

```
Migdalor/
├── back-end/                 # Node.js API server
│   ├── database/            # MongoDB connection
│   ├── middleware/          # Express middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── tests/               # Backend tests
│   ├── scripts/             # Database scripts
│   │   ├── setup-database.js # Initialize database with sample data
│   │   ├── seedData.js      # Sample data definitions
│   │   └── simulator.js     # MQTT message simulator
│   ├── .env.example         # Environment template
│   └── server.js            # Main server file
├── front-end/               # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   ├── i18n/            # Internationalization
│   │   └── tests/           # Frontend tests
│   ├── tests/e2e/          # E2E tests
│   ├── .env.example         # Environment template
│   └── vite.config.js       # Vite configuration
└── README.md               # This file
```

## 🔧 Development

### Available Scripts

#### Backend

```bash
npm start              # Start production server
npm test               # Run tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage

# Database scripts
node scripts/setup-database.js  # Initialize database with sample data
node scripts/simulator.js      # Run MQTT message simulator
```

#### Frontend

```bash
npm run dev            # Start development server
npm run build          # Build for production
npm run preview        # Preview production build
npm test               # Run unit tests
npm run e2e            # Run E2E tests
npm run dev:full       # Start both frontend and backend
```

### Code Quality

```bash
# Frontend linting
cd front-end
npm run lint

# Backend (if configured)
cd back-end
npm run lint
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Failed

```bash
# Check MongoDB URI format
echo $MONGODB_URI

# Test connection
cd back-end
node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('Connected')).catch(console.error)"
```

#### 1.1. Database Setup Issues

```bash
# If setup-database.js fails, check:
# 1. MongoDB connection string is correct
# 2. Database user has read/write permissions
# 3. Network access allows your IP

# Re-run database setup
cd back-end
node scripts/setup-database.js

# Check if collections were created
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('Collections:', collections.map(c => c.name));
  process.exit(0);
}).catch(console.error);
"
```

#### 2. JWT Token Issues

```bash
# Check JWT secret is set
echo $JWT_SECRET

# Verify token format
node -e "console.log(require('jsonwebtoken').sign({test: 'data'}, process.env.JWT_SECRET))"
```

#### 3. CORS Issues

- Check `FRONTEND_URL` in backend `.env`
- Ensure frontend URL matches exactly
- Check browser console for CORS errors

#### 4. Build Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
cd front-end
rm -rf node_modules/.vite
npm run build
```

### Debug Mode

Enable debug logging:

```env
# Backend
LOG_LEVEL=debug
NODE_ENV=development

# Frontend
VITE_DEBUG=true
```

## 📚 Additional Resources

- [Backend Documentation](./back-end/README.md)
- [Frontend Documentation](./front-end/README.md)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [AWS App Runner Documentation](https://docs.aws.amazon.com/apprunner/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the UNLICENSED license.

---

**Migdalor** - Modern production management system for efficient workforce and resource management.
