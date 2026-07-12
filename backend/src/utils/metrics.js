const { query } = require('../config/db');

const getFleetUtilizationPct = async ({ vehicleType, status, region }) => {
  let filterQuery = '';
  const params = [];
  let paramCount = 1;

  if (vehicleType) {
    filterQuery += ` AND type = $${paramCount++}`;
    params.push(vehicleType);
  }
  if (status) {
    filterQuery += ` AND status = $${paramCount++}`;
    params.push(status);
  }
  if (region) {
    filterQuery += ` AND region = $${paramCount++}`;
    params.push(region);
  }

  const sql = `
    SELECT 
      COALESCE(
        ROUND(
          100.0 * COUNT(CASE WHEN status = 'On Trip' THEN 1 END) / 
          NULLIF(COUNT(CASE WHEN status != 'Retired' THEN 1 END), 0)
        , 0)
      , 0) as utilization_pct
    FROM vehicles
    WHERE 1=1 ${filterQuery}
  `;

  const result = await query(sql, params);
  return parseFloat(result.rows[0].utilization_pct || 0);
};

module.exports = {
  getFleetUtilizationPct
};
