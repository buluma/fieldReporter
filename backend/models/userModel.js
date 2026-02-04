const { query } = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
    static async create({ username, email, password, assigned }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const res = await query(
            'INSERT INTO users (username, email, password, assigned) VALUES ($1, $2, $3, $4) RETURNING id, username, email, assigned',
            [username, email, hashedPassword, assigned]
        );
        return res.rows[0];
    }

    static async findByUsername(username) {
        const res = await query('SELECT * FROM users WHERE username = $1', [username]);
        return res.rows[0];
    }

    static async findById(id) {
        const res = await query('SELECT id, username, email, assigned FROM users WHERE id = $1', [id]);
        return res.rows[0];
    }

    static async comparePassword(candidatePassword, hashedPassword) {
        return bcrypt.compare(candidatePassword, hashedPassword);
    }
}

module.exports = User;
