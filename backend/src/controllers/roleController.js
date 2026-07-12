const { query } = require('../config/db');

const getRolePermissionsMatrix = async (req, res) => {
  try {
    const sql = `
      SELECT r.name as role_name, rp.module, rp.access_level 
      FROM role_permissions rp
      JOIN roles r ON rp.role_id = r.id
    `;
    const result = await query(sql);

    const rolesRes = await query('SELECT name FROM roles');
    const matrix = {};
    
    rolesRes.rows.forEach(role => {
      matrix[role.name] = {
        fleet: 'none',
        drivers: 'none',
        trips: 'none',
        fuel_expenses: 'none',
        analytics: 'none'
      };
    });

    result.rows.forEach(row => {
      const role = row.role_name;
      const module = row.module;
      const access = row.access_level === 'Write' ? 'full' : 'view';

      if (!matrix[role]) return;

      if (module === 'vehicles' || module === 'maintenance') {
        if (matrix[role].fleet !== 'full') {
          matrix[role].fleet = access;
        }
      } else if (module === 'drivers') {
        matrix[role].drivers = access;
      } else if (module === 'trips') {
        matrix[role].trips = access;
      } else if (module === 'expenses') {
        matrix[role].fuel_expenses = access;
      }
    });

    if (matrix['Fleet Manager']) {
      matrix['Fleet Manager'].analytics = 'full';
      // Fleet manager has full access on trips and fuel_expenses too
      matrix['Fleet Manager'].trips = 'full';
      matrix['Fleet Manager'].fuel_expenses = 'full';
    }
    if (matrix['Financial Analyst']) {
      matrix['Financial Analyst'].analytics = 'view';
    }

    res.json(matrix);
  } catch (error) {
    console.error('Error fetching role permissions matrix:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getRolePermissionsMatrix };
