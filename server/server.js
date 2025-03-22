const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // ✅ Added
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/authRoutes.js"); // ✅ Fix import
const dashboardRoutes = require("./routes/dashboardRoutes.js"); // ✅ Fix import
const { sanitizeMiddleware } = require("./middleware/sanitizeMiddleware.js"); // ✅ Fix import

dotenv.config();
const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ Allow frontend
    credentials: true, // ✅ Allow cookies
  })
);
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // ✅ Parse URL-encoded data
app.use(cookieParser()); // ✅ Enable cookie parsing
app.use(sanitizeMiddleware); // Sanitize all incoming requests

// ✅ Routes
app.use("/api/users", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ✅ Start Server After Connecting to DB
const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });
