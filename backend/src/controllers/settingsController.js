const { query } = require('../config/db');

const getSettings = async (req, res) => {
  try {
    const result = await query('SELECT * FROM settings LIMIT 1');
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { depot_name, currency, distance_unit } = req.body;
    
    const checkRes = await query('SELECT id FROM settings LIMIT 1');
    let result;
    if (checkRes.rows.length === 0) {
      result = await query(
        `INSERT INTO settings (depot_name, currency, distance_unit) 
         VALUES ($1, $2, $3) RETURNING *`,
        [depot_name, currency, distance_unit]
      );
    } else {
      result = await query(
        `UPDATE settings 
         SET depot_name = $1, currency = $2, distance_unit = $3, updated_at = NOW() 
         WHERE id = $4 RETURNING *`,
        [depot_name, currency, distance_unit, checkRes.rows[0].id]
      );
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
