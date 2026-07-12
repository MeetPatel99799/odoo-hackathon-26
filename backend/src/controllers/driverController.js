const { query } = require('../config/db');

const getDrivers = async (req, res) => {
  try {
    const { search } = req.query;
    let sql = 'SELECT * FROM drivers';
    const params = [];
    
    if (search) {
      sql += ' WHERE name ILIKE $1 OR license_no ILIKE $1';
      params.push(`%${search}%`);
    }

    sql += ' ORDER BY created_at DESC';

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createDriver = async (req, res) => {
  try {
    const { name, license_no, license_category, license_expiry, contact_number } = req.body;
    
    const sql = `
      INSERT INTO drivers (name, license_no, license_category, license_expiry, contact_number, status)
      VALUES ($1, $2, $3, $4, $5, 'Available')
      RETURNING *
    `;
    const params = [name, license_no, license_category, license_expiry, contact_number];
    
    const result = await query(sql, params);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'License number already exists' });
    }
    console.error('Error creating driver:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, license_no, license_category, license_expiry, contact_number } = req.body;

    const sql = `
      UPDATE drivers 
      SET name = $1, license_no = $2, license_category = $3, license_expiry = $4, contact_number = $5, updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `;
    const params = [name, license_no, license_category, license_expiry, contact_number, id];
    
    const result = await query(sql, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'License number already exists' });
    }
    console.error('Error updating driver:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateDriverStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Check if currently dispatched
    if (status !== 'On Trip') {
      const tripsCheck = await query(`
        SELECT id FROM trips 
        WHERE driver_id = $1 AND status = 'Dispatched'
      `, [id]);

      if (tripsCheck.rows.length > 0) {
        return res.status(400).json({ error: 'Driver is currently on a dispatched trip.' });
      }
    }

    const sql = `
      UPDATE drivers 
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;
    const result = await query(sql, [status, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating driver status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getDrivers,
  createDriver,
  updateDriver,
  updateDriverStatus
};
