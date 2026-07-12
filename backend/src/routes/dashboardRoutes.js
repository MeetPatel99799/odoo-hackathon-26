const express = require('express');
const { getKPIs, getRecentTrips, getVehicleStatusSummary } = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Protected by auth middleware only
router.use(verifyToken);

router.get('/kpis', getKPIs);
router.get('/recent-trips', getRecentTrips);
router.get('/vehicle-status-summary', getVehicleStatusSummary);

module.exports = router;
