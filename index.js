const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet"); // ✅ Add helmet for security headers
const morgan = require("morgan"); // ✅ Add morgan for logging
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors()); // Allow all origins (configure properly for production)
app.use(helmet()); // Add security headers
app.use(morgan("dev")); // Log requests to the console

// ✅ Routes
app.use("/", authRoutes);

// ✅ Root Route (Health Check)
app.get("/", (req, res) => {
  res.send("Hello, Vercel! Your Express backend is running.");
});

// ✅ Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// ✅ Validate Environment Variables
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("❌ Missing required environment variables.");
  process.exit(1); // Exit if required variables are missing
}

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Export for Vercel
module.exports = app;

// ✅ Start Server
if (require.main === module) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}