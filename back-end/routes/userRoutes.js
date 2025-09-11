const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const logger = require("../utils/logger");

// GET /api/me
router.get("/me", requireAuth, async (req, res) => {
  try {
    logger.db("Fetch user profile", "User");
    const user = await User.findById(req.user.userId).select(
      "person_id username first_name last_name email phone department role status isAdmin"
    );
    if (!user) {
      logger.error("User profile fetch", `User ${req.user.userId} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    logger.success("User profile fetched", user.username);
    res.json({
      id: user._id,
      person_id: user.person_id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number, // <- renamed
      department: user.department,
      role: user.role,
      status: user.status,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    logger.error("User profile fetch error", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/me/password", requireAuth, async (req, res) => {
  try {
    const { newPassword } = req.body || {};
    if (!newPassword || newPassword.length < 6) {
      logger.error("Password change", "Password too short");
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // req.user is set by requireAuth
    logger.db("Find user for password change", "User");
    const user = await User.findById(req.user.userId);
    if (!user) {
      logger.error("Password change", `User ${req.user.userId} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    logger.db("Update password", "User");
    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordChangedAt = new Date(); // optional: helps invalidate old JWTs
    await user.save();

    logger.auth("Password changed", user.username);
    return res.json({ message: "Password updated successfully" });
  } catch (e) {
    logger.error("Password change error", e);
    return res.status(500).json({ message: "Server error" });
  }
});

// Admin: list all users (minimal fields)
router.get("/users", requireAuth, requireAdmin, async (req, res) => {
  try {
    logger.db("Fetch all users", "User");
    const users = await User.find({}, "username isAdmin")
      .sort({ isAdmin: -1, username: 1 })
      .lean();
    // Map to a cleaner shape
    const result = users.map((u) => ({
      id: u._id,
      username: u.username,
      isAdmin: !!u.isAdmin,
    }));

    logger.success("Users fetched", `${result.length} users`);
    res.json(result);
  } catch (e) {
    logger.error("GET /users error", e);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin: delete a user (prevent deleting admin accounts)
router.delete(
  "/users/:username",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    try {
      logger.db("Find user for deletion", "User");
      const user = await User.findOne({ username: req.params.username });
      if (!user) {
        logger.error("User deletion", `User ${req.params.username} not found`);
        return res.status(404).json({ message: "User not found" });
      }
      // Only protect the built-in 'admin' account from deletion
      if (user.username === "admin") {
        logger.error("User deletion", "Cannot delete admin user");
        return res
          .status(403)
          .json({ message: "Cannot delete the 'admin' user" });
      }

      logger.db("Delete user", "User");
      await User.deleteOne({ _id: user._id });

      logger.auth("User deleted", req.params.username);
      return res.json({ success: true });
    } catch (e) {
      logger.error("DELETE /users/:username error", e);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
