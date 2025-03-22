const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ New route to get user details (needed for ProtectedRoute.js)
router.get("/user", authMiddleware, (req, res) => {
  res.json({ role: req.user.role }); // ✅ Send user role
});

// ✅ Healthcare Dashboard (Only for Healthcare Assistance)
router.get("/healthcare", authMiddleware, (req, res) => {
  if (req.user.role !== "Healthcare Assistance") {
    return res.status(403).json({ message: "Access denied." });
  }
  res.json({ message: "Welcome to the Healthcare Dashboard!" });
});

// ✅ Education Dashboard (Only for Learners)
router.get("/education", authMiddleware, (req, res) => {
  if (req.user.role !== "Learner") {
    return res.status(403).json({ message: "Access denied." });
  }
  res.json({ message: "Welcome to the Education Dashboard!" });
});

// ✅ Volunteer Dashboard (Only for Volunteers)
router.get("/volunteer", authMiddleware, (req, res) => {
  if (req.user.role !== "Volunteer") {
    return res.status(403).json({ message: "Access denied." });
  }
  res.json({ message: "Welcome to the Volunteer Dashboard!" });
});

// ✅ Donor Dashboard (Only for Donors)
router.get("/donor", authMiddleware, (req, res) => {
  if (req.user.role !== "Donor") {
    return res.status(403).json({ message: "Access denied." });
  }
  res.json({ message: "Welcome to the Donor Dashboard!" });
});

module.exports = router;
