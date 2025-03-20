const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

// ✅ Use a dynamic port for Vercel
const PORT = process.env.PORT || 5001;

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Define API Routes
app.use("/auth", authRoutes);

// ✅ Root Route for Testing
app.get("/", (req, res) => {
  res.send("Hello, Vercel! Your Express backend is running.");
});

// ✅ Export for Vercel's Serverless Functions
module.exports = app;

// ✅ Start Server only if not in Vercel's Serverless Environment
if (require.main === module) {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}
