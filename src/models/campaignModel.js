import pool from '../config/db.js';

class CampaignModel {
  static async findAll() {
    const result = await pool.query(
      'SELECT * FROM campaigns WHERE deleted_at IS NULL ORDER BY created_at DESC'
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM campaigns WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );
    return result.rows[0];
  }

  static async create(data) {
    const { name, client, status, budget, spend, impressions, clicks, conversions } = data;
    const result = await pool.query(
      `INSERT INTO campaigns 
      (name, client, status, budget, spend, impressions, clicks, conversions) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *`,
      [
        name, 
        client, 
        status || 'draft', 
        budget || 0, 
        spend || 0, 
        impressions || 0, 
        clicks || 0, 
        conversions || 0
      ]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const fields = [];
    const values = [];
    let query = 'UPDATE campaigns SET ';
    
    let counter = 1;
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        fields.push(`${key} = $${counter}`);
        values.push(value);
        counter++;
      }
    }

    if (fields.length === 0) return null;

    query += fields.join(', ');
    query += ` WHERE id = $${counter} AND deleted_at IS NULL RETURNING *`;
    values.push(id);

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async softDelete(id) {
    const result = await pool.query(
      'UPDATE campaigns SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 AND deleted_at IS NULL RETURNING *',
      [id]
    );
    return result.rows[0];
  }
}

export default CampaignModel;
