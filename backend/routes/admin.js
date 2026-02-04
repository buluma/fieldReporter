const express = require('express');
const path = require('path');
const auth = require('../middleware/auth'); // Use your auth middleware
const router = express.Router();

// Middleware to ensure user is an admin
const ensureAdmin = (req, res, next) => {
    // Assuming req.user is populated by your auth middleware
    if (req.user && (req.user.assigned === 'admin' || req.user.assigned === 'team-leader')) {
        next(); // User is an admin or team-leader, proceed
    } else {
        res.status(403).send('Access Denied: Admins or Team Leaders only.');
    }
};

// Serve static files for the admin panel
router.use('/', ensureAdmin, express.static(path.join(__dirname, '../../public/admin')));

// Serve the admin dashboard HTML
router.get('/', ensureAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/admin/index.html'));
});

// Example API endpoint for admin data - protected
router.get('/users', auth, ensureAdmin, async (req, res) => {
    try {
        const users = await query('SELECT id, username, email, assigned FROM users');
        res.json(users.rows);
    } catch (err) {
        console.error('Error fetching users for admin:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
