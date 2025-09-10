const mongoose = require("mongoose");
const { connectToDatabase } = require("../database/atlas-connection");
const bcrypt = require("bcrypt");

const Station = require("../models/station");
const WorkingStation = require("../models/workingStation");
const Qualification = require("../models/qualification");
const Product = require("../models/product");
const Assignment = require("../models/assignment");
const User = require("../models/User");
const Employee = require("../models/Employee");
const Department = require("../models/department");

const {
  sampleUsers,
  sampleEmployees,
  sampleStations,
  sampleWorkingStations,
  sampleProducts,
  sampleQualifications,
  sampleAssignments,
  DEPARTMENTS, // import here
  buildMqttSeedMessages,
} = require("./seedData");

async function setupDatabase() {
  try {
    await connectToDatabase();

    // Clear collections
    await Promise.all([
      User.deleteMany({}),
      Employee.deleteMany({}),
      Station.deleteMany({}),
      WorkingStation.deleteMany({}),
      Qualification.deleteMany({}),
      Product.deleteMany({}),
      Assignment.deleteMany({}),
      Department.deleteMany({}),
      mongoose.connection.db.collection("mqttMsg").deleteMany({}),
    ]);
    console.log("🧹 Cleared existing data");

    // Insert employees first
    await Employee.insertMany(sampleEmployees);
    console.log("✅ Employees inserted");

    // Hash all user passwords before insert and map to minimal User fields
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (u) => {
        if (typeof u.password === "string" && u.password.startsWith("$2")) {
          return {
            username: u.username,
            password: u.password,
            isAdmin: !!u.isAdmin,
          };
        }
        const passwordHash = await bcrypt.hash(u.password, 10);
        return {
          username: u.username,
          password: passwordHash,
          isAdmin: !!u.isAdmin,
        };
      })
    );

    await User.insertMany(hashedUsers);
    console.log("✅ Users inserted");

    await Station.insertMany(sampleStations);
    console.log("✅ Stations inserted");

    await WorkingStation.insertMany(sampleWorkingStations);
    console.log("✅ Working Stations inserted");

    await Product.insertMany(sampleProducts);
    console.log("✅ Products inserted");

    await Qualification.insertMany(sampleQualifications);
    console.log("✅ Qualifications inserted");

    await Assignment.insertMany(sampleAssignments);
    console.log("✅ Assignments inserted");

    // Insert departments from array
    await Department.insertMany(DEPARTMENTS.map((name) => ({ name })));
    console.log("✅ Departments inserted");

    // Insert historical MQTT messages for reports testing
    const mqttSeed = buildMqttSeedMessages();
    if (mqttSeed && mqttSeed.length) {
      await mongoose.connection.db.collection("mqttMsg").insertMany(mqttSeed);
      console.log(`✅ MQTT messages inserted (${mqttSeed.length})`);
    }

    // Count log
    const [
      usersCnt,
      employeesCnt,
      stationsCnt,
      wssCnt,
      productsCnt,
      qualsCnt,
      assignsCnt,
      depsCnt,
      mqttCnt,
    ] = await Promise.all([
      User.countDocuments(),
      Employee.countDocuments(),
      Station.countDocuments(),
      WorkingStation.countDocuments(),
      Product.countDocuments(),
      Qualification.countDocuments(),
      Assignment.countDocuments(),
      Department.countDocuments(),
      mongoose.connection.db.collection("mqttMsg").countDocuments(),
    ]);

    console.log("\n🎉 Database setup complete!");
    console.log(`- users (${usersCnt})`);
    console.log(`- employees (${employeesCnt})`);
    console.log(`- stations (${stationsCnt})`);
    console.log(`- workingstations (${wssCnt})`);
    console.log(`- products (${productsCnt})`);
    console.log(`- qualifications (${qualsCnt})`);
    console.log(`- assignments (${assignsCnt})`);
    console.log(`- departments (${depsCnt})`);
    console.log(`- mqttMsg (${mqttCnt})`);
  } catch (error) {
    console.error("Error setting up database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

setupDatabase();
