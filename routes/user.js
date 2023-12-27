const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "email and password are required" });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    console.log(user,"user");
    // Check if the user exists and verify the password
    if (user && (await bcrypt.compare(password, user.password))) {
      // Authentication successful
      return res.status(200).json({
        success: true,
        data: "Authentication successful",
        result: user,
      });
    } else {
      // Authentication failed
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = router;
