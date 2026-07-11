const db = require('../config/db');
const { getOperationalCost } = require('../utils/operationalCost');

async function getFuelLogs(req, res) {
  try {
    const { rows } = await db.query(`
      SELECT f.id, v.reg_no as vehicle, f.log_date as date, f.liters, f.cost
      FROM fuel_logs f
      JOIN vehicles v ON f.vehicle_id = v.id
      ORDER BY f.log_date DESC, f.id DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch fuel logs' });
  }
}

async function createFuelLog(req, res) {
  try {
    const { vehicle_id, trip_id, log_date, liters, cost } = req.body;
    const { rows } = await db.query(
      `INSERT INTO fuel_logs (vehicle_id, trip_id, log_date, liters, cost) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [vehicle_id, trip_id || null, log_date, liters, cost]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create fuel log' });
  }
}

async function getExpenses(req, res) {
  try {
    const { rows } = await db.query(`
      SELECT 
        e.id, 
        t.trip_code as trip, 
        v.reg_no as vehicle, 
        e.toll, 
        e.other, 
        COALESCE(m.cost, 0) as maint_linked_cost, 
        (e.toll + e.other + COALESCE(m.cost, 0)) as total,
        e.status
      FROM expenses e
      JOIN vehicles v ON e.vehicle_id = v.id
      LEFT JOIN trips t ON e.trip_id = t.id
      LEFT JOIN maintenance_logs m ON e.maintenance_linked_id = m.id
      ORDER BY e.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
}

async function createExpense(req, res) {
  try {
    const { trip_id, vehicle_id, toll, other, maintenance_linked_id } = req.body;
    const { rows } = await db.query(
      `INSERT INTO expenses (trip_id, vehicle_id, toll, other, maintenance_linked_id) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [trip_id || null, vehicle_id, toll || 0, other || 0, maintenance_linked_id || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create expense' });
  }
}

async function getOperationalCostData(req, res) {
  try {
    const { vehicleId } = req.query;
    const cost = await getOperationalCost(vehicleId ? { vehicleId } : {});
    res.json({ operationalCost: cost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to calculate operational cost' });
  }
}

module.exports = {
  getFuelLogs,
  createFuelLog,
  getExpenses,
  createExpense,
  getOperationalCostData
};
