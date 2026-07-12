const express = require('express');
const { getMaintenanceLogs, createMaintenanceLog, closeMaintenanceLog } = require('../controllers/maintenanceController');
const { verifyToken } = require('../middleware/auth');
const { requireAccess } = require('../middleware/rbac');

const router = express.Router();

router.use(verifyToken);

// Using 'maintenance' module and 'Read'/'Write' based on the seeded role_permissions
router.get('/', requireAccess('maintenance', 'Read'), getMaintenanceLogs);
router.post('/', requireAccess('maintenance', 'Write'), createMaintenanceLog);
router.patch('/:id/close', requireAccess('maintenance', 'Write'), closeMaintenanceLog);

module.exports = router;
