const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Register Function
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log(" Received Registration Data:", req.body);

    // Convert email to lowercase to ensure consistency
    const emailLowerCase = email.trim();

    // Check if user exists (case-insensitive)
    const existingUser = await User.findOne({ email: { $regex: new RegExp("^" + emailLowerCase + "$", "i") } });
    if (existingUser) {
      return res.status(400).json({ message: "❌ User already exists" });
    }

    // Identify Admin
    const isAdmin = emailLowerCase === "Admin@admingmail.com";

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      username,
      email: emailLowerCase, // Store email consistently
      password: hashedPassword,
      isAdmin,
    });

    console.log("📝 Saving User:", newUser);

    await newUser.save();

    res.status(201).json({ message: " Registration Successful!" });
  } catch (error) {
    console.error(" Registration Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Login Function
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔑 Login Attempt:", email);

    // Convert email to lowercase for case-insensitive search
    const emailLowerCase = email.trim();

    // Find user (case-insensitive search)
    const user = await User.findOne({ email: { $regex: new RegExp("^" + emailLowerCase + "$", "i") } });

    if (!user) {
      return res.status(404).json({ message: " User not found" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: " Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "1h" });

    console.log(" Login Successful:", email);

    res.json({ token, isAdmin: user.isAdmin });

  } catch (error) {
    console.error(" Login Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = { register, login };
