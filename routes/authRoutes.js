const express = require("express");
const { register, login, verifyAdmin } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/check-admin", verifyAdmin); // ✅ Add this route

module.exports = router;