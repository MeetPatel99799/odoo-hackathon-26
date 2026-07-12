const express = require('express');
const { getDrivers, createDriver, updateDriver, updateDriverStatus } = require('../controllers/driverController');
const { verifyToken } = require('../middleware/auth');
const { requireAccess } = require('../middleware/rbac');

const router = express.Router();

router.use(verifyToken);

// Using 'Read' and 'Write' levels matching the database seed for 'drivers' module
router.get('/', requireAccess('drivers', 'Read'), getDrivers);
router.post('/', requireAccess('drivers', 'Write'), createDriver);
router.put('/:id', requireAccess('drivers', 'Write'), updateDriver);
router.patch('/:id/status', requireAccess('drivers', 'Write'), updateDriverStatus);

module.exports = router;
