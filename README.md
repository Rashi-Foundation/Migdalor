# Migdalor - Production Management System

A comprehensive production management system built with React frontend and Node.js backend, designed for efficient employee assignment, station management, and production tracking.

## 🚀 Features

- **Employee Management** - Complete employee lifecycle management with qualifications tracking
- **Station Management** - Work station configuration and status monitoring
- **Assignment System** - Daily and weekly employee assignments with multi-employee support
- **Production Tracking** - Real-time production data and performance metrics
- **User Authentication** - Secure login system with role-based access control
- **Multi-language Support** - Hebrew and English localization
- **Responsive Design** - Mobile-first design with dark/light theme support
- **Real-time Updates** - MQTT-based real-time data synchronization

## 🏗️ Architecture

```
Migdalor/
├── front-end/          # React + Vite frontend
├── back-end/           # Node.js + Express backend
└── README.md          # This file
```

### Technology Stack

**Frontend:**

- React 19.1.1 with Vite
- Tailwind CSS for styling
- React Router for navigation
- Chart.js for data visualization
- i18next for internationalization

**Backend:**

- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- MQTT for real-time communication
- bcrypt for password hashing

## 📋 Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Migdalor
```

### 2. Backend Setup

```bash
cd back-end
npm install
```

Create `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=8080
JWT_SECRET=your_jwt_secret
MQTT_BROKER=mqtt://broker.hivemq.com
```

Initialize database:

```bash
node scripts/setup-database.js
node scripts/seedData.js
```

Start backend:

```bash
npm start
```

### 3. Frontend Setup

```bash
cd front-end
npm install
```

Create `.env` file:

```env
VITE_REACT_APP_SERVER_URL=http://localhost:8080
```

Start frontend:

```bash
npm run dev
```

Visit `http://localhost:5173` to view the application.

## 🌐 Deployment

### Backend Deployment (AWS App Runner)

1. **Connect Repository**

   - Connect your GitHub repository to AWS App Runner
   - Select branch: `main`
   - Source directory: `/back-end`

2. **Configure Runtime**

   - Runtime: Node.js 18
   - Build command: `npm install`
   - Start command: `node server.js`
   - Port: `8080`

3. **Environment Variables**
   ```env
   ATLAS_URI=your_mongodb_connection_string
   PORT=8080
   MQTT_BROKER=mqtt://broker.hivemq.com
   JWT_SECRET=your_jwt_secret
   ```

### Frontend Deployment (AWS Amplify)

1. **Connect Repository**

   - Connect your GitHub repository to AWS Amplify
   - Select branch: `main`
   - Enable: "My app is a monorepo"
   - Root directory: `/front-end`

2. **Environment Variables**

   ```env
   VITE_REACT_APP_SERVER_URL=https://your-backend-url
   ```

3. **Build Settings**
   - Build command: `npm run build`
   - Output directory: `dist`

### Alternative Deployment Options

**Backend:**

- Heroku
- Railway
- DigitalOcean App Platform
- Google Cloud Run

**Frontend:**

- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

## 📊 Database Setup

### MongoDB Atlas Configuration

1. Create a MongoDB Atlas cluster
2. Configure network access (0.0.0.0/0 for development)
3. Create database user with read/write permissions
4. Get connection string and add to `.env`

### Database Collections

- **users** - Authentication and user management
- **employees** - Employee information and profiles
- **departments** - Department definitions
- **products** - Product catalog
- **stations** - Work station configurations
- **workingstations** - Active station status
- **assignments** - Employee assignments
- **qualifications** - Employee skills and certifications

## 🔧 Configuration

### Environment Variables

**Backend (.env):**

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/migdalor
PORT=8080
JWT_SECRET=your_super_secret_jwt_key
MQTT_BROKER=mqtt://broker.hivemq.com
```

**Frontend (.env):**

```env
VITE_REACT_APP_SERVER_URL=http://localhost:8080
```

### MQTT Configuration

The system uses MQTT for real-time updates. Default configuration uses HiveMQ public broker, but you can configure your own:

```env
MQTT_BROKER=mqtt://your-mqtt-broker.com:1883
```

## 🧪 Testing

### Backend Testing

```bash
cd back-end
npm test
```

### Frontend Testing

```bash
cd front-end
npm test
```

## 📚 API Documentation

The backend provides RESTful APIs for:

- **Authentication** - `/api/auth/*`
- **Employees** - `/api/employees/*`
- **Stations** - `/api/stations/*`
- **Assignments** - `/api/assignments/*`
- **Reports** - `/api/reports/*`

See [Backend README](./back-end/README.md) for detailed API documentation.

## 🛠️ Development

### Project Structure

```
Migdalor/
├── front-end/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── api/           # API utilities
│   │   └── i18n/          # Internationalization
│   ├── public/            # Static assets
│   └── package.json
├── back-end/
│   ├── models/            # Mongoose models
│   ├── routes/            # Express routes
│   ├── middleware/        # Custom middleware
│   ├── services/          # Business logic
│   └── scripts/           # Database scripts
└── README.md
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Development Team** - Braude College

---

**Migdalor** - Streamlining production management for the modern workplace.
