const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Use a dynamic port or default to 5001
const PORT = process.env.PORT || 5001;

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello, Vercel!");
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
