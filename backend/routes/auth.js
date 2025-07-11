const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserAuth');

// 🔐 Secret key for JWT
const JWT_SECRET = 'your_secret_key_here'; // Replace this with an environment variable in real projects

// ✅ Register Route
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// ✅ Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    // Create JWT
    const token = jwt.sign({ id: user._id, name: user.name }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ message: 'Login successful', token, user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
