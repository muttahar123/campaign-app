import pool from '../config/db.js';

class CampaignModel {
  static async findAll({ limit = 10, offset = 0, sort = 'created_at', order = 'DESC', status }) {
    let query = 'SELECT * FROM campaigns WHERE deleted_at IS NULL';
    const values = [];
    let queryIndex = 1;

    if (status) {
      query += ` AND status = $${queryIndex}`;
      values.push(status);
      queryIndex++;
    }

    // Protect against SQL injection by validating sort/order explicitly
    const allowedSortFields = ['created_at', 'spend', 'budget', 'roas', 'name', 'status'];
    const safeSort = allowedSortFields.includes(sort) ? sort : 'created_at';
    const safeOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    query += ` ORDER BY ${safeSort} ${safeOrder}`;
    
    query += ` LIMIT $${queryIndex} OFFSET $${queryIndex + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    
    // Get total count for pagination math
    const countQuery = status 
      ? 'SELECT COUNT(*) FROM campaigns WHERE deleted_at IS NULL AND status = $1' 
      : 'SELECT COUNT(*) FROM campaigns WHERE deleted_at IS NULL';
    const countValues = status ? [status] : [];
    const countResult = await pool.query(countQuery, countValues);
    
    return {
      data: result.rows,
      total: parseInt(countResult.rows[0].count, 10),
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10)
    };
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM campaigns WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );
    return result.rows[0];
  }

  static async create(data) {
    const { name, client, status, budget, spend, impressions, clicks, conversions, alert_threshold_percent } = data;
    const result = await pool.query(
      `INSERT INTO campaigns 
      (name, client, status, budget, spend, impressions, clicks, conversions, alert_threshold_percent) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING *`,
      [
        name, 
        client, 
        status || 'draft', 
        budget || 0, 
        spend || 0, 
        impressions || 0, 
        clicks || 0, 
        conversions || 0,
        alert_threshold_percent || 0.90
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

  static async createAlert(campaignId, message) {
    const result = await pool.query(
      'INSERT INTO alerts (campaign_id, message) VALUES ($1, $2) RETURNING *',
      [campaignId, message]
    );
    return result.rows[0];
  }
}

export default CampaignModel;
