const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { getSummary, getMonthlyRevenue, getTopCostlyVehicles, exportCsv } = require('../controllers/analyticsController');

router.use(verifyToken);

router.get('/summary', getSummary);
router.get('/monthly-revenue', getMonthlyRevenue);
router.get('/top-costly-vehicles', getTopCostlyVehicles);
router.get('/export/csv', exportCsv);

module.exports = router;
