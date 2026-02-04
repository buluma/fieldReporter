const express = require('express');
const Store = require('../models/storeModel');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all stores
router.get('/', auth, async (req, res) => {
    try {
        const stores = await Store.getAll();
        res.json(stores);
    } catch (err) {
        console.error('Error fetching stores:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a single store by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const store = await Store.getById(req.params.id);
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }
        res.json(store);
    } catch (err) {
        console.error('Error fetching store:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new store (admin/team-leader only)
router.post('/', auth, async (req, res) => {
    // Implement role-based access control here if needed
    if (req.user.assigned !== 'admin' && req.user.assigned !== 'team-leader') {
        return res.status(403).json({ message: 'Access denied. Admins or Team Leaders only.' });
    }

    try {
        const newStore = await Store.create(req.body);
        res.status(201).json(newStore);
    } catch (err) {
        console.error('Error creating store:', err);
        if (err.code === '23505') { // Unique violation
            return res.status(400).json({ message: 'Store with this name already exists.' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a store by ID (admin/team-leader only)
router.put('/:id', auth, async (req, res) => {
    // Implement role-based access control here if needed
    if (req.user.assigned !== 'admin' && req.user.assigned !== 'team-leader') {
        return res.status(403).json({ message: 'Access denied. Admins or Team Leaders only.' });
    }

    try {
        const updatedStore = await Store.update(req.params.id, req.body);
        if (!updatedStore) {
            return res.status(404).json({ message: 'Store not found' });
        }
        res.json(updatedStore);
    } catch (err) {
        console.error('Error updating store:', err);
        if (err.code === '23505') { // Unique violation
            return res.status(400).json({ message: 'Store with this name already exists.' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a store by ID (admin/team-leader only)
router.delete('/:id', auth, async (req, res) => {
    // Implement role-based access control here if needed
    if (req.user.assigned !== 'admin' && req.user.assigned !== 'team-leader') {
        return res.status(403).json({ message: 'Access denied. Admins or Team Leaders only.' });
    }

    try {
        const deletedStore = await Store.delete(req.params.id);
        if (!deletedStore) {
            return res.status(404).json({ message: 'Store not found' });
        }
        res.json({ message: 'Store deleted successfully' });
    } catch (err) {
        console.error('Error deleting store:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
