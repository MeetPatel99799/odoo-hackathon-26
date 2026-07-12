const db = require('../config/db');
const { getFleetUtilizationPct } = require('../utils/metrics');
const { getOperationalCost } = require('../utils/operationalCost');

// RATE_PER_KM is an assumed rate used to estimate revenue since revenue isn't separately modeled.
const RATE_PER_KM = 50;

async function getSummary(req, res) {
  try {
    const [efficiencyRes, roiRes] = await Promise.all([
      db.query(`
        SELECT 
          (SELECT SUM(planned_distance_km) FROM trips WHERE status = 'Completed') / 
          NULLIF((SELECT SUM(liters) FROM fuel_logs), 0) as kml
      `),
      db.query(`
        SELECT ROUND(AVG(((COALESCE(trip_rev.rev, 0) - (COALESCE(f.cost, 0) + COALESCE(m.cost, 0))) / NULLIF(v.acquisition_cost, 0)) * 100)::numeric, 1) as avg_roi
        FROM vehicles v
        INNER JOIN (SELECT vehicle_id, SUM(planned_distance_km * ${RATE_PER_KM}) as rev FROM trips WHERE status = 'Completed' GROUP BY vehicle_id) trip_rev ON v.id = trip_rev.vehicle_id
        LEFT JOIN (SELECT vehicle_id, SUM(cost) as cost FROM fuel_logs GROUP BY vehicle_id) f ON v.id = f.vehicle_id
        LEFT JOIN (SELECT vehicle_id, SUM(cost) as cost FROM maintenance_logs GROUP BY vehicle_id) m ON v.id = m.vehicle_id
      `)
    ]);

    const fuelEfficiencyKmL = parseFloat(efficiencyRes.rows[0]?.kml || 0).toFixed(1);
    const vehicleRoiPct = parseFloat(roiRes.rows[0]?.avg_roi || 0);

    const fleetUtilizationPct = await getFleetUtilizationPct({});
    const operationalCost = await getOperationalCost({});

    res.json({
      fuelEfficiencyKmL,
      fleetUtilizationPct,
      operationalCost,
      vehicleRoiPct
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
}

async function getMonthlyRevenue(req, res) {
  try {
    const { rows } = await db.query(`
      SELECT to_char(completed_at, 'YYYY-MM') as month, 
             SUM(planned_distance_km * ${RATE_PER_KM}) as revenue
      FROM trips
      WHERE status = 'Completed' AND completed_at IS NOT NULL
      GROUP BY to_char(completed_at, 'YYYY-MM')
      ORDER BY month DESC
      LIMIT 7
    `);
    
    // Reverse to get chronological order for charts
    res.json(rows.reverse());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch monthly revenue' });
  }
}

async function getTopCostlyVehicles(req, res) {
  try {
    const { rows } = await db.query(`
      SELECT v.reg_no as vehicle, 
             (COALESCE(f.cost, 0) + COALESCE(m.cost, 0)) as cost
      FROM vehicles v
      LEFT JOIN (SELECT vehicle_id, SUM(cost) as cost FROM fuel_logs GROUP BY vehicle_id) f ON v.id = f.vehicle_id
      LEFT JOIN (SELECT vehicle_id, SUM(cost) as cost FROM maintenance_logs GROUP BY vehicle_id) m ON v.id = m.vehicle_id
      ORDER BY cost DESC
      LIMIT 5
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch top costly vehicles' });
  }
}

async function exportCsv(req, res) {
  try {
    const { rows } = await db.query(`
      SELECT v.reg_no as vehicle,
             COALESCE(trip_rev.dist, 0) / NULLIF(f.liters, 0) as kml,
             (COALESCE(f.cost, 0) + COALESCE(m.cost, 0)) as op_cost,
             ROUND((((COALESCE(trip_rev.rev, 0) - (COALESCE(f.cost, 0) + COALESCE(m.cost, 0))) / NULLIF(v.acquisition_cost, 0)) * 100)::numeric, 1) as roi
      FROM vehicles v
      LEFT JOIN (
          SELECT vehicle_id, SUM(planned_distance_km) as dist, SUM(planned_distance_km * ${RATE_PER_KM}) as rev 
          FROM trips WHERE status = 'Completed' GROUP BY vehicle_id
      ) trip_rev ON v.id = trip_rev.vehicle_id
      LEFT JOIN (SELECT vehicle_id, SUM(cost) as cost, SUM(liters) as liters FROM fuel_logs GROUP BY vehicle_id) f ON v.id = f.vehicle_id
      LEFT JOIN (SELECT vehicle_id, SUM(cost) as cost FROM maintenance_logs GROUP BY vehicle_id) m ON v.id = m.vehicle_id
    `);

    let csv = 'vehicle,fuel_efficiency_kml,operational_cost,roi_pct\n';
    rows.forEach(r => {
      csv += `${r.vehicle},${parseFloat(r.kml || 0).toFixed(1)},${parseFloat(r.op_cost || 0).toFixed(2)},${parseFloat(r.roi || 0).toFixed(2)}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="analytics_export.csv"');
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
}

module.exports = {
  getSummary,
  getMonthlyRevenue,
  getTopCostlyVehicles,
  exportCsv
};
