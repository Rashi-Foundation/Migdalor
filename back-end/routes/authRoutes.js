const express = require("express");
require("dotenv").config();
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const logger = require("../utils/logger");

// Login (User schema)
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      logger.error("Login attempt", "Missing credentials");
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    logger.db("Find user", "User");
    const user = await User.findOne({ username });
    // Always treat as hashed
    if (!user) {
      logger.auth("Login failed", username);
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      logger.auth("Login failed", username);
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        isAdmin: !!user.isAdmin,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    logger.auth("Login successful", username);
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
    logger.error("Login error", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// Register (User schema) - admin only
router.post("/register", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { username, password, isAdmin = false } = req.body || {};

    // Validate required fields for User schema
    if (!username || !password) {
      logger.error("User registration", "Missing required fields");
      return res.status(400).json({
        success: false,
        message: "username and password are required",
      });
    }

    // Check duplicates by username
    logger.db("Check existing user", "User");
    const existing = await User.findOne({ username }).select("_id");
    if (existing) {
      logger.error("User registration", `Username ${username} already exists`);
      return res.status(409).json({
        success: false,
        message: "Username already exists",
      });
    }

    // Hash and create
    logger.db("Create user", "User");
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username: username.trim(),
      password: hashedPassword,
      isAdmin: !!isAdmin,
    });

    logger.auth("User registered", username);
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
    logger.error("Register error", err);
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
        logger.error("Password update", "Password too short");
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters long" });
      }

      logger.db("Find user for password update", "User");
      const user = await User.findOne({ username: req.params.username });
      if (!user) {
        logger.error(
          "Password update",
          `User ${req.params.username} not found`
        );
        return res.status(404).json({ message: "User not found" });
      }

      logger.db("Update password", "User");
      user.password = await bcrypt.hash(newPassword, 10);
      user.passwordChangedAt = new Date();
      await user.save();

      logger.auth("Password updated", req.params.username);
      return res.json({ message: "Password updated" });
    } catch (e) {
      logger.error("admin password update error", e);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
