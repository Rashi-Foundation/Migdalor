const express = require("express");
require("dotenv").config();
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { requireAuth, requireAdmin } = require("../middleware/auth");

// Login (User schema)
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password)
      return res
        .status(400)
        .json({ message: "Username and password are required" });

    const user = await User.findOne({ username });
    // Always treat as hashed
    if (!user)
      return res.status(401).json({ message: "Invalid username or password" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(401).json({ message: "Invalid username or password" });

    const token = jwt.sign(
      {
        userId: user._id,
        isAdmin: !!user.isAdmin,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        isAdmin: !!user.isAdmin,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// Register (User schema) - admin only
router.post("/register", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { username, password, isAdmin = false } = req.body || {};

    // Validate required fields for User schema
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "username and password are required",
      });
    }

    // Check duplicates by username
    const existing = await User.findOne({ username }).select("_id");
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Username already exists",
      });
    }

    // Hash and create
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username: username.trim(),
      password: hashedPassword,
      isAdmin: !!isAdmin,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        isAdmin: !!newUser.isAdmin,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
});

// Admin: change a user's password by username
router.put(
  "/users/:username/password",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    try {
      const { newPassword } = req.body || {};
      if (!newPassword || newPassword.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters long" });
      }

      const user = await User.findOne({ username: req.params.username });
      if (!user) return res.status(404).json({ message: "User not found" });

      user.password = await bcrypt.hash(newPassword, 10);
      user.passwordChangedAt = new Date();
      await user.save();

      return res.json({ message: "Password updated" });
    } catch (e) {
      console.error("admin password update error:", e);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
