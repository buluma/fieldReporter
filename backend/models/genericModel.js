const { query } = require('../config/db');

class GenericModel {
    static async upsert(tableName, data, conflictTarget, returningColumns = '*') {
        if (!data || Object.keys(data).length === 0) {
            throw new Error('Data for upsert cannot be empty.');
        }

        const columns = Object.keys(data);
        const values = Object.values(data);
        const placeholders = columns.map((col, index) => `$${index + 1}`).join(', ');
        const columnNames = columns.join(', ');

        // Construct SET clause for ON CONFLICT DO UPDATE
        const setClause = columns.map((col, index) => `${col} = $${index + 1}`).join(', ');

        const sql = `
            INSERT INTO ${tableName} (${columnNames})
            VALUES (${placeholders})
            ON CONFLICT (${conflictTarget}) DO UPDATE SET
                ${setClause}
            RETURNING ${returningColumns};
        `;

        const res = await query(sql, values);
        return res.rows[0];
    }

    static async bulkUpsert(tableName, records, conflictTarget, returningColumns = '*') {
        if (!Array.isArray(records) || records.length === 0) {
            throw new Error('Records for bulk upsert cannot be empty.');
        }

        const client = await query('BEGIN'); // Start transaction

        try {
            const results = [];
            for (const record of records) {
                const upsertedRecord = await this.upsert(tableName, record, conflictTarget, returningColumns);
                results.push(upsertedRecord);
            }
            await query('COMMIT'); // Commit transaction
            return results;
        } catch (error) {
            await query('ROLLBACK'); // Rollback on error
            throw error;
        }
    }

    static async getAll(tableName) {
        const res = await query(`SELECT * FROM ${tableName}`);
        return res.rows;
    }

    static async getById(tableName, id) {
        const res = await query(`SELECT * FROM ${tableName} WHERE id = $1`, [id]);
        return res.rows[0];
    }

    static async delete(tableName, id) {
        const res = await query(`DELETE FROM ${tableName} WHERE id = $1 RETURNING *`, [id]);
        return res.rows[0];
    }
}

module.exports = GenericModel;
