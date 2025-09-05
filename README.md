# Migdalor Project

---

## Deployment Guide

Follow the steps below in order to deploy the project successfully.

---

### 1. MongoDB Database Setup

- Create a project and cluster on [MongoDB Atlas](https://www.mongodb.com/).
- Copy the connection string and add it to your `.env` file:

```env
MONGODB_URI=
```

- Initialize the database:

```bash
cd backend
node scripts/setup-database.js
```

- Modify `backend/database/seedData.js` if you want to start with custom or empty data.

---

### 2. MQTT Setup

- By default, the project uses the HiveMQ public broker:

```
mqtt://broker.hivemq.com
```

- To use your own broker, set the value in `.env`:

```env
MQTT_BROKER=mqtt://<your-broker-address>
```

---

### 3. Backend Deployment (Node.js – AWS App Runner)

1. In AWS App Runner, connect the GitHub repository.
2. Choose branch: `main`
3. Source directory: `/back-end`
4. Configure runtime and build:
   - Runtime: **Node.js 18**
   - Build command: `npm install`
   - Start command: `node server.js`
   - Port: `8080`
5. Add environment variables:

```env
ATLAS_URI=<your-mongodb-uri>
PORT=8080
MQTT_BROKER=mqtt://broker.hivemq.com
JWT_SECRET=jwtsecret
```

---

### 4. Frontend Deployment (React – AWS Amplify)

1. In AWS Amplify, connect the GitHub repository.
2. Choose branch: `main`
3. Enable: `My app is a monorepo`
4. Root directory: `/front-end`
5. Add environment variable for backend URL:

```env
VITE_REACT_APP_SERVER_URL=https://backendUrl....
```

6. Save and deploy → new builds trigger automatically on push to `main`.

---
