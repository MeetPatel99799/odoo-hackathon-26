const { query } = require('../config/db');

const getVehicles = async (req, res) => {
  try {
    const { type, status, search } = req.query;
    
    let sql = 'SELECT * FROM vehicles WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (type) {
      sql += ` AND type = $${paramCount++}`;
      params.push(type);
    }
    
    if (status) {
      sql += ` AND status = $${paramCount++}`;
      params.push(status);
    }

    if (search) {
      sql += ` AND (reg_no ILIKE $${paramCount} OR name_model ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    sql += ' ORDER BY created_at DESC';

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAvailableVehicles = async (req, res) => {
  req.query.status = 'Available';
  return getVehicles(req, res);
};

const createVehicle = async (req, res) => {
  try {
    const { reg_no, name_model, type, max_capacity_kg, odometer, acquisition_cost, region } = req.body;
    
    const sql = `
      INSERT INTO vehicles (reg_no, name_model, type, max_capacity_kg, odometer, acquisition_cost, region, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'Available')
      RETURNING *
    `;
    const params = [reg_no, name_model, type, max_capacity_kg, odometer || 0, acquisition_cost, region];
    
    const result = await query(sql, params);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Registration number already exists' });
    }
    console.error('Error creating vehicle:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const { name_model, type, max_capacity_kg, odometer, acquisition_cost, region } = req.body;

    const sql = `
      UPDATE vehicles 
      SET name_model = $1, type = $2, max_capacity_kg = $3, odometer = $4, acquisition_cost = $5, region = $6, updated_at = NOW()
      WHERE id = $7
      RETURNING *
    `;
    const params = [name_model, type, max_capacity_kg, odometer, acquisition_cost, region, id];
    
    const result = await query(sql, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateVehicleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // If vehicle has open Dispatched trip, block
    const tripsCheck = await query(`
      SELECT id FROM trips 
      WHERE vehicle_id = $1 AND status = 'Dispatched'
    `, [id]);

    if (tripsCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Vehicle is currently on a dispatched trip.' });
    }

    const sql = `
      UPDATE vehicles 
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;
    const result = await query(sql, [status, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating vehicle status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getVehicles,
  getAvailableVehicles,
  createVehicle,
  updateVehicle,
  updateVehicleStatus
};
