import express from "express";
import bcrypt from "bcrypt";
import User from "../models/profileuser.js"; // Mongoose model

const router = express.Router();

router.post("/signup", async (req, res) => {
  console.log("\n🎯 SIGNUP ROUTE HIT!");
  console.log("📅 Timestamp:", new Date().toISOString());
  console.log("📋 Request Body:", JSON.stringify(req.body, null, 2));
  console.log("🔤 Body keys:", Object.keys(req.body));
  console.log("📡 Content-Type:", req.get('content-type'));
  
  try {
    const { name, email, password, contactNumber } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password || !contactNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with hashed password and contact number
    const newUser = new User({ name, email, password: hashedPassword, contactNumber });
    await newUser.save();

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
