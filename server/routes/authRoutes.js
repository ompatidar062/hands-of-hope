const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { validateSignUp, validateSignIn } = require("../middleware/validateMiddleware");
const { sanitizeMiddleware } = require("../middleware/sanitizeMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// **User Sign-Up**
router.post("/signup", sanitizeMiddleware, validateSignUp, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const user = await User.create({ name, email, password, role });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// **User Sign-In**
router.post("/signin", sanitizeMiddleware, validateSignIn, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    // ✅ Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role}, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // ✅ Send token as HTTP-only cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",

      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, name: user.name, role: user.role ,email:user.email},
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.get("/auth-status", authMiddleware({ optional: true }), async (req, res) => {
  try {
    if (!req.user) {
      return res.json({ authenticated: false });
    }
    
    const user = await User.findById(req.user.id).select("name role");
    res.json({ 
      authenticated: true, 
      user: { name: user.name, role: user.role } 
    });
  } catch (error) {
    res.json({ authenticated: false });
  }
});



router.post("/logout", (req, res) => {
  try {
    res.cookie("jwt", "", { 
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      expires: new Date(0), // Expire immediately
      domain: process.env.COOKIE_DOMAIN || undefined,
      path: "/"
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
      clearLocalStorage: true, // Flag for frontend to clear storage
      clearSessionStorage: true
    });

  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed. Please try again."
    });
  }
});

module.exports = router;
