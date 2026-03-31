import pool from '../config/db.js';

class UserModel {
  static async create(username, passwordHash) {
    const result = await pool.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at',
      [username, passwordHash]
    );
    return result.rows[0];
  }

  static async findByUsername(username) {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    return result.rows[0];
  }
}

export default UserModel;
