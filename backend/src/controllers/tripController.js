const { query, pool } = require('../config/db');

const getAvailableVehicles = async (req, res) => {
  try {
    const result = await query("SELECT id, reg_no AS \"regNo\", max_capacity_kg AS \"capacity\", type, status FROM vehicles WHERE status='Available'");
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching available vehicles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAvailableDrivers = async (req, res) => {
  try {
    const result = await query("SELECT id, name, license_no AS \"licenseNo\", license_category AS \"category\", license_expiry AS \"licenseExpiry\", contact_number AS \"contact\", status FROM drivers WHERE status='Available' AND license_expiry >= CURRENT_DATE");
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching available drivers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTrips = async (req, res) => {
  try {
    const { status } = req.query;
    let sql = `
      SELECT t.*, t.trip_code as "tripCode", v.reg_no as vehicle, d.name as driver 
      FROM trips t
      LEFT JOIN vehicles v ON t.vehicle_id = v.id
      LEFT JOIN drivers d ON t.driver_id = d.id
      WHERE 1=1
    `;
    const params = [];
    if (status) {
      sql += ' AND t.status = $1';
      params.push(status);
    }
    sql += ' ORDER BY t.created_at DESC';

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createTrip = async (req, res) => {
  const client = await pool.connect();
  try {
    const { source, destination, vehicle_id, driver_id, cargo_weight_kg, planned_distance_km, eta } = req.body;
    
    await client.query('BEGIN');
    
    // Insert with dummy trip_code to get the ID
    const insertRes = await client.query(`
      INSERT INTO trips (trip_code, source, destination, vehicle_id, driver_id, cargo_weight_kg, planned_distance_km, eta, status)
      VALUES ('TEMP', $1, $2, $3, $4, $5, $6, $7, 'Draft')
      RETURNING *
    `, [source, destination, vehicle_id, driver_id, cargo_weight_kg, planned_distance_km, eta]);
    
    const newTrip = insertRes.rows[0];
    const tripCode = 'TR' + String(newTrip.id).padStart(6, '0');
    
    const updateRes = await client.query(`
      UPDATE trips SET trip_code = $1 WHERE id = $2 RETURNING *
    `, [tripCode, newTrip.id]);

    await client.query('COMMIT');
    res.status(201).json(updateRes.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating trip:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};

const dispatchTrip = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Lock trip
    const tripRes = await client.query('SELECT * FROM trips WHERE id = $1 FOR UPDATE', [id]);
    if (tripRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Trip not found' });
    }
    const trip = tripRes.rows[0];

    if (trip.status !== 'Draft') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Only Draft trips can be dispatched' });
    }

    // Check vehicle
    const vehicleRes = await client.query('SELECT * FROM vehicles WHERE id = $1 FOR UPDATE', [trip.vehicle_id]);
    if (vehicleRes.rows.length === 0 || vehicleRes.rows[0].status !== 'Available') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Vehicle is not available' });
    }
    const vehicle = vehicleRes.rows[0];

    // Check driver
    const driverRes = await client.query('SELECT * FROM drivers WHERE id = $1 FOR UPDATE', [trip.driver_id]);
    if (driverRes.rows.length === 0 || driverRes.rows[0].status !== 'Available') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Driver is not available' });
    }
    const driver = driverRes.rows[0];
    if (new Date(driver.license_expiry) < new Date()) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Driver license is expired' });
    }

    // Check cargo weight
    if (parseFloat(trip.cargo_weight_kg) > parseFloat(vehicle.max_capacity_kg)) {
      await client.query('ROLLBACK');
      const exceededBy = parseFloat(trip.cargo_weight_kg) - parseFloat(vehicle.max_capacity_kg);
      return res.status(400).json({ error: `Cargo weight exceeds vehicle capacity by ${exceededBy} kg` });
    }

    // Update statuses
    await client.query("UPDATE trips SET status='Dispatched', dispatched_at=NOW() WHERE id=$1", [id]);
    await client.query("UPDATE vehicles SET status='On Trip' WHERE id=$1", [trip.vehicle_id]);
    await client.query("UPDATE drivers SET status='On Trip' WHERE id=$1", [trip.driver_id]);

    await client.query('COMMIT');
    res.json({ success: true, message: 'Trip dispatched successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error dispatching trip:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};

const completeTrip = async (req, res) => {
  const { id } = req.params;
  const { final_odometer, fuel_consumed_liters } = req.body;

  if (final_odometer === undefined || isNaN(final_odometer) || Number(final_odometer) <= 0) {
    return res.status(400).json({ error: 'Valid final odometer is required' });
  }
  if (fuel_consumed_liters === undefined || isNaN(fuel_consumed_liters) || Number(fuel_consumed_liters) < 0) {
    return res.status(400).json({ error: 'Valid fuel consumed is required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const tripRes = await client.query('SELECT * FROM trips WHERE id = $1 FOR UPDATE', [id]);
    if (tripRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Trip not found' });
    }
    const trip = tripRes.rows[0];

    if (trip.status !== 'Dispatched') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Only Dispatched trips can be completed' });
    }

    const vehicleRes = await client.query('SELECT odometer FROM vehicles WHERE id = $1', [trip.vehicle_id]);
    if (vehicleRes.rows.length > 0) {
      if (Number(final_odometer) < Number(vehicleRes.rows[0].odometer)) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Final odometer cannot be less than current vehicle odometer' });
      }
    }

    // Update statuses and insert fuel log
    await client.query(`
      UPDATE trips SET status='Completed', completed_at=NOW(), final_odometer=$1, fuel_consumed_liters=$2 WHERE id=$3
    `, [final_odometer, fuel_consumed_liters, id]);
    
    await client.query("UPDATE vehicles SET status='Available', odometer=$1 WHERE id=$2", [final_odometer, trip.vehicle_id]);
    await client.query("UPDATE drivers SET status='Available' WHERE id=$1", [trip.driver_id]);
    
    await client.query(`
      INSERT INTO fuel_logs (vehicle_id, trip_id, log_date, liters, cost) 
      VALUES ($1, $2, CURRENT_DATE, $3, 0)
    `, [trip.vehicle_id, id, fuel_consumed_liters]);

    await client.query('COMMIT');
    res.json({ success: true, message: 'Trip completed successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error completing trip:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};

const cancelTrip = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const tripRes = await client.query('SELECT * FROM trips WHERE id = $1 FOR UPDATE', [id]);
    if (tripRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Trip not found' });
    }
    const trip = tripRes.rows[0];

    if (trip.status !== 'Dispatched') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Only Dispatched trips can be cancelled via this endpoint' });
    }

    // Revert statuses
    await client.query("UPDATE trips SET status='Cancelled' WHERE id=$1", [id]);
    await client.query("UPDATE vehicles SET status='Available' WHERE id=$1", [trip.vehicle_id]);
    await client.query("UPDATE drivers SET status='Available' WHERE id=$1", [trip.driver_id]);

    await client.query('COMMIT');
    res.json({ success: true, message: 'Trip cancelled successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error cancelling trip:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};

module.exports = {
  getAvailableVehicles,
  getAvailableDrivers,
  getTrips,
  createTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip
};
