const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true }, // bcrypt hash
    isAdmin: { type: Boolean, default: false },
  },
  { collection: "user", timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
