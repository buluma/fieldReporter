const { pool } = require('../config/db');
const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '../config/schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

async function migrate() {
    try {
        console.log('Starting database migration...');
        await pool.query(schema);
        console.log('Database migration complete.');
    } catch (err) {
        console.error('Database migration failed:', err);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

migrate();
