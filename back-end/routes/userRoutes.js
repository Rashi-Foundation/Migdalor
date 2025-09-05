const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { requireAuth, requireAdmin } = require("../middleware/auth");

// GET /api/me
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "person_id username first_name last_name email phone department role status isAdmin"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

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
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/me/password", requireAuth, async (req, res) => {
  try {
    const { newPassword } = req.body || {};
    if (!newPassword || newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // req.user is set by requireAuth
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordChangedAt = new Date(); // optional: helps invalidate old JWTs
    await user.save();

    return res.json({ message: "Password updated successfully" });
  } catch (e) {
    console.error("PUT /me/password error", e);
    return res.status(500).json({ message: "Server error" });
  }
});

// Admin: list all users (minimal fields)
router.get("/users", requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "username isAdmin").sort({ isAdmin: -1, username: 1 }).lean();
    // Map to a cleaner shape
    const result = users.map((u) => ({ id: u._id, username: u.username, isAdmin: !!u.isAdmin }));
    res.json(result);
  } catch (e) {
    console.error("GET /users error", e);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin: delete a user (prevent deleting admin accounts)
router.delete("/users/:username", requireAuth, requireAdmin, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: "User not found" });
    // Only protect the built-in 'admin' account from deletion
    if (user.username === 'admin') {
      return res.status(403).json({ message: "Cannot delete the 'admin' user" });
    }

    await User.deleteOne({ _id: user._id });
    return res.json({ success: true });
  } catch (e) {
    console.error("DELETE /users/:username error", e);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
