const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const router = express.Router();

// Register a new user (for initial setup, can be restricted later)
router.post('/register', async (req, res) => {
    const { username, email, password, assigned } = req.body;
    try {
        const newUser = await User.create({ username, email, password, assigned });
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        if (error.code === '23505') { // Unique violation error code for PostgreSQL
            return res.status(400).json({ message: 'Username or email already exists' });
        }
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await User.comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, assigned: user.assigned },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Logged in successfully', token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

module.exports = router;
