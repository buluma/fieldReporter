const express = require('express');
const auth = require('../middleware/auth');
const GenericModel = require('../models/genericModel');
const router = express.Router();

const allowedTables = [
    'users', 'login_logs', 'stores', 'checkin_sessions', 'availability_records',
    'placement_records', 'activation_records', 'visibility_records',
    'tl_focus_records', 'tl_objectives_records', 'objectives_records',
    'other_objectives_records', 'listings_records', 'brands',
    'brand_stocks_records', 'performance_records', 'daily_planner_records',
    'checklist_records'
];

// Middleware to check if tableName is allowed
const checkTableName = (req, res, next) => {
    const tableName = req.params.tableName;
    if (!allowedTables.includes(tableName)) {
        return res.status(400).json({ message: `Table '${tableName}' is not allowed.` });
    }
    next();
};

// Generic GET all records from a table
router.get('/:tableName', auth, checkTableName, async (req, res) => {
    try {
        const records = await GenericModel.getAll(req.params.tableName);
        res.json(records);
    } catch (error) {
        console.error(`Error fetching all records from ${req.params.tableName}:`, error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Generic GET a single record by ID from a table
router.get('/:tableName/:id', auth, checkTableName, async (req, res) => {
    try {
        const record = await GenericModel.getById(req.params.tableName, req.params.id);
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }
        res.json(record);
    } catch (error) {
        console.error(`Error fetching record from ${req.params.tableName}:`, error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Generic POST (create/upsert) a record to a table
router.post('/:tableName', auth, checkTableName, async (req, res) => {
    const { conflictTarget, ...data } = req.body;
    if (!conflictTarget) {
        return res.status(400).json({ message: 'conflictTarget is required for upsert operation' });
    }
    try {
        const newRecord = await GenericModel.upsert(req.params.tableName, data, conflictTarget);
        res.status(201).json(newRecord);
    } catch (error) {
        console.error(`Error creating/upserting record to ${req.params.tableName}:`, error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Generic PUT (update) a record in a table
router.put('/:tableName/:id', auth, checkTableName, async (req, res) => {
    const { conflictTarget, ...data } = req.body;
    // Assuming 'id' is the conflict target for updates. If not, client needs to provide it.
    const actualConflictTarget = conflictTarget || 'id'; 
    try {
        const updatedRecord = await GenericModel.upsert(req.params.tableName, { ...data, id: req.params.id }, actualConflictTarget);
        if (!updatedRecord) {
            return res.status(404).json({ message: 'Record not found' });
        }
        res.json(updatedRecord);
    } catch (error) {
        console.error(`Error updating record in ${req.params.tableName}:`, error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Generic DELETE a record from a table
router.delete('/:tableName/:id', auth, checkTableName, async (req, res) => {
    try {
        const deletedRecord = await GenericModel.delete(req.params.tableName, req.params.id);
        if (!deletedRecord) {
            return res.status(404).json({ message: 'Record not found' });
        }
        res.json({ message: 'Record deleted successfully' });
    } catch (error) {
        console.error(`Error deleting record from ${req.params.tableName}:`, error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Bulk upsert endpoint
router.post('/bulk-sync/:tableName', auth, checkTableName, async (req, res) => {
    const { records, conflictTarget } = req.body;

    if (!Array.isArray(records) || !conflictTarget) {
        return res.status(400).json({ message: 'Missing records (array) or conflictTarget for bulk sync' });
    }

    try {
        const results = await GenericModel.bulkUpsert(req.params.tableName, records, conflictTarget);
        res.status(200).json({ message: `${records.length} records synced successfully to ${req.params.tableName}`, results });
    } catch (error) {
        console.error(`Error during bulk upsert for table ${req.params.tableName}:`, error);
        res.status(500).json({ message: 'Server error during data sync', error: error.message });
    }
});

module.exports = router;
