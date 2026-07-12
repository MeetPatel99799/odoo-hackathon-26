const express = require('express');
const { getVehicles, getAvailableVehicles, createVehicle, updateVehicle, updateVehicleStatus } = require('../controllers/vehicleController');
const { verifyToken } = require('../middleware/auth');
const { requireAccess } = require('../middleware/rbac');

const router = express.Router();

router.use(verifyToken);

// Using 'vehicles' and 'Read'/'Write' based on the seeded database role_permissions
router.get('/', requireAccess('vehicles', 'Read'), getVehicles);
router.get('/available', requireAccess('vehicles', 'Read'), getAvailableVehicles);

router.post('/', requireAccess('vehicles', 'Write'), createVehicle);
router.put('/:id', requireAccess('vehicles', 'Write'), updateVehicle);
router.patch('/:id/status', requireAccess('vehicles', 'Write'), updateVehicleStatus);

module.exports = router;
