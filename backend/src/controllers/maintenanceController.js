const { query, pool } = require('../config/db');

const getMaintenanceLogs = async (req, res) => {
  try {
    const sql = `
      SELECT m.*, v.reg_no as vehicle_reg_no 
      FROM maintenance_logs m
      JOIN vehicles v ON m.vehicle_id = v.id
      ORDER BY m.created_at DESC
    `;
    const result = await query(sql);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching maintenance logs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createMaintenanceLog = async (req, res) => {
  const client = await pool.connect();
  try {
    const { vehicle_id, service_type, cost, service_date, status } = req.body;
    
    await client.query('BEGIN');

    const insertSql = `
      INSERT INTO maintenance_logs (vehicle_id, service_type, cost, service_date, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const insertRes = await client.query(insertSql, [
      vehicle_id, 
      service_type, 
      cost || 0, 
      service_date || new Date().toISOString().split('T')[0], 
      status || 'Scheduled'
    ]);
    const newLog = insertRes.rows[0];

    // R9: If status is 'In Shop', update vehicle status in the same transaction
    if (newLog.status === 'In Shop') {
      await client.query("UPDATE vehicles SET status='In Shop' WHERE id=$1", [vehicle_id]);
    }

    await client.query('COMMIT');
    res.status(201).json(newLog);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating maintenance log:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};

const closeMaintenanceLog = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Get log to find vehicle_id
    const logRes = await client.query('SELECT vehicle_id, status FROM maintenance_logs WHERE id = $1 FOR UPDATE', [id]);
    if (logRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Maintenance log not found' });
    }
    const log = logRes.rows[0];

    if (log.status === 'Completed') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Maintenance log is already completed' });
    }

    // Update log status to Completed
    await client.query("UPDATE maintenance_logs SET status='Completed', updated_at=NOW() WHERE id=$1", [id]);

    // R10: Update vehicle status to Available IF not Retired
    await client.query(`
      UPDATE vehicles 
      SET status='Available' 
      WHERE id=$1 AND status != 'Retired'
    `, [log.vehicle_id]);

    await client.query('COMMIT');
    res.json({ success: true, message: 'Maintenance log closed successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error closing maintenance log:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};

module.exports = {
  getMaintenanceLogs,
  createMaintenanceLog,
  closeMaintenanceLog
};
