const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    person_id: { type: String, required: true, unique: true, index: true },
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, index: true },
    phone: { type: String, trim: true },
    department: { type: String, trim: true },
    role: { type: String, trim: true },
    status: { type: String, trim: true },
  },
  { collection: "employee", timestamps: true }
);

module.exports =
  mongoose.models.Employee || mongoose.model("Employee", employeeSchema);
