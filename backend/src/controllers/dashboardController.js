const { query } = require('../config/db');
const { getFleetUtilizationPct } = require('../utils/metrics');

const getKPIs = async (req, res) => {
  try {
    const { vehicleType, status, region } = req.query;

    // Base vehicle filters
    const vehicleFilters = [];
    const vehicleParams = [];
    let vParamIdx = 1;
    if (vehicleType) {
      vehicleFilters.push(`type = $${vParamIdx++}`);
      vehicleParams.push(vehicleType);
    }
    if (status) {
      vehicleFilters.push(`status = $${vParamIdx++}`);
      vehicleParams.push(status);
    }
    if (region) {
      vehicleFilters.push(`region = $${vParamIdx++}`);
      vehicleParams.push(region);
    }
    const vWhere = vehicleFilters.length > 0 ? 'WHERE ' + vehicleFilters.join(' AND ') : '';

    // Vehicles queries
    const vRes = await query(`
      SELECT 
        COUNT(CASE WHEN status = 'On Trip' THEN 1 END) as active_vehicles,
        COUNT(CASE WHEN status = 'Available' THEN 1 END) as available_vehicles,
        COUNT(CASE WHEN status = 'In Shop' THEN 1 END) as vehicles_in_maintenance
      FROM vehicles
      ${vWhere}
    `, vehicleParams);

    // Trips queries
    const tRes = await query(`
      SELECT 
        COUNT(CASE WHEN status = 'Dispatched' THEN 1 END) as active_trips,
        COUNT(CASE WHEN status = 'Draft' THEN 1 END) as pending_trips
      FROM trips
    `);

    // Drivers queries
    const dRes = await query(`
      SELECT COUNT(*) as drivers_on_duty 
      FROM drivers 
      WHERE status IN ('On Trip', 'Available')
    `);

    const fleetUtilizationPct = await getFleetUtilizationPct({ vehicleType, status, region });

    res.json({
      activeVehicles: parseInt(vRes.rows[0].active_vehicles || 0, 10),
      availableVehicles: parseInt(vRes.rows[0].available_vehicles || 0, 10),
      vehiclesInMaintenance: parseInt(vRes.rows[0].vehicles_in_maintenance || 0, 10),
      activeTrips: parseInt(tRes.rows[0].active_trips || 0, 10),
      pendingTrips: parseInt(tRes.rows[0].pending_trips || 0, 10),
      driversOnDuty: parseInt(dRes.rows[0].drivers_on_duty || 0, 10),
      fleetUtilizationPct
    });
  } catch (error) {
    console.error('Error fetching KPIs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getRecentTrips = async (req, res) => {
  try {
    const result = await query(`
      SELECT t.*, v.name_model as vehicle_name, d.name as driver_name
      FROM trips t
      LEFT JOIN vehicles v ON t.vehicle_id = v.id
      LEFT JOIN drivers d ON t.driver_id = d.id
      ORDER BY t.updated_at DESC
      LIMIT 10
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching recent trips:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getVehicleStatusSummary = async (req, res) => {
  try {
    const result = await query(`
      SELECT status, COUNT(*) as count 
      FROM vehicles 
      GROUP BY status
    `);
    
    const data = result.rows.map(row => ({
      status: row.status,
      count: parseInt(row.count, 10)
    }));
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching vehicle status summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getKPIs,
  getRecentTrips,
  getVehicleStatusSummary
};
