const express = require('express');
const { getMaintenanceLogs, createMaintenanceLog, closeMaintenanceLog } = require('../controllers/maintenanceController');
const { verifyToken } = require('../middleware/auth');
const { requireAccess } = require('../middleware/rbac');

const router = express.Router();

router.use(verifyToken);

// Using 'fleet' module per prompt requirement, mapped to 'vehicles' in RBAC middleware
router.get('/', requireAccess('fleet', 'view'), getMaintenanceLogs);
router.post('/', requireAccess('fleet', 'full'), createMaintenanceLog);
router.patch('/:id/close', requireAccess('fleet', 'full'), closeMaintenanceLog);

module.exports = router;
