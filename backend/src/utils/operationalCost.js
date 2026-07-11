const db = require('../config/db');

async function getOperationalCost({ vehicleId } = {}) {
  let fuelQuery = 'SELECT SUM(cost) as total FROM fuel_logs';
  let maintQuery = 'SELECT SUM(cost) as total FROM maintenance_logs';
  
  const params = [];
  if (vehicleId) {
    fuelQuery += ' WHERE vehicle_id = $1';
    maintQuery += ' WHERE vehicle_id = $1';
    params.push(vehicleId);
  }

  const [fuelRes, maintRes] = await Promise.all([
    db.query(fuelQuery, params),
    db.query(maintQuery, params)
  ]);

  const fuelCost = parseFloat(fuelRes.rows[0]?.total || 0);
  const maintCost = parseFloat(maintRes.rows[0]?.total || 0);

  return fuelCost + maintCost;
}

module.exports = { getOperationalCost };
