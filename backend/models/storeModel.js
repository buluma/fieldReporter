const { query } = require('../config/db');

class Store {
    static async create({ name, region, location, address, phone, email, contact_person, notes, userId, latitude, longitude }) {
        const res = await query(
            `INSERT INTO stores (name, region, location, address, phone, email, contact_person, notes, user_id, latitude, longitude)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
             RETURNING *`,
            [name, region, location, address, phone, email, contact_person, notes, userId, latitude, longitude]
        );
        return res.rows[0];
    }

    static async getAll() {
        const res = await query('SELECT * FROM stores');
        return res.rows;
    }

    static async getById(id) {
        const res = await query('SELECT * FROM stores WHERE id = $1', [id]);
        return res.rows[0];
    }

    static async update(id, { name, region, location, address, phone, email, contact_person, notes, userId, latitude, longitude }) {
        const res = await query(
            `UPDATE stores
             SET name = $1, region = $2, location = $3, address = $4, phone = $5, email = $6, contact_person = $7, notes = $8, user_id = $9, latitude = $10, longitude = $11
             WHERE id = $12
             RETURNING *`,
            [name, region, location, address, phone, email, contact_person, notes, userId, latitude, longitude, id]
        );
        return res.rows[0];
    }

    static async delete(id) {
        const res = await query('DELETE FROM stores WHERE id = $1 RETURNING *', [id]);
        return res.rows[0];
    }
}

module.exports = Store;
