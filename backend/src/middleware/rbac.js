const requireAccess = (module, minLevel) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.role_id) {
        return res.status(401).json({ error: 'Unauthorized: User role not found' });
      }
      
      const { query } = require('../config/db');
      
      // Fetch permission for this role and module
      const result = await query(
        'SELECT access_level FROM role_permissions WHERE role_id = $1 AND module = $2',
        [req.user.role_id, module]
      );
      
      if (result.rows.length === 0) {
        return res.status(403).json({ error: `Forbidden: No access to module ${module}` });
      }
      
      const userLevel = result.rows[0].access_level;
      
      // Access level hierarchy: Read < Write
      if (minLevel === 'Write' && userLevel !== 'Write') {
         return res.status(403).json({ error: `Forbidden: Write access required for module ${module}` });
      }
      
      next();
    } catch (error) {
      console.error('RBAC Error:', error);
      res.status(500).json({ error: 'Internal server error checking permissions' });
    }
  };
};

module.exports = { requireAccess };
