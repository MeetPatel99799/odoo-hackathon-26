const express = require('express');
const { 
  getAvailableVehicles, getAvailableDrivers, getTrips, 
  createTrip, dispatchTrip, completeTrip, cancelTrip 
} = require('../controllers/tripController');
const { verifyToken } = require('../middleware/auth');
const { requireAccess } = require('../middleware/rbac');

const router = express.Router();

router.use(verifyToken);

// Using 'Read' and 'Write' for module 'trips' matching the DB permissions seed
router.get('/available-vehicles', requireAccess('trips', 'Read'), getAvailableVehicles);
router.get('/available-drivers', requireAccess('trips', 'Read'), getAvailableDrivers);
router.get('/', requireAccess('trips', 'Read'), getTrips);

router.post('/', requireAccess('trips', 'Write'), createTrip);
router.patch('/:id/dispatch', requireAccess('trips', 'Write'), dispatchTrip);
router.patch('/:id/complete', requireAccess('trips', 'Write'), completeTrip);
router.patch('/:id/cancel', requireAccess('trips', 'Write'), cancelTrip);

module.exports = router;
