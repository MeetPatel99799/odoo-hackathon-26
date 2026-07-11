const express = require('express');
const router = express.Router();
const rbac = require('../middleware/rbac');
const { getSummary, getMonthlyRevenue, getTopCostlyVehicles, exportCsv } = require('../controllers/analyticsController');

router.get('/summary', rbac.requireAccess('analytics', 'view'), getSummary);
router.get('/monthly-revenue', rbac.requireAccess('analytics', 'view'), getMonthlyRevenue);
router.get('/top-costly-vehicles', rbac.requireAccess('analytics', 'view'), getTopCostlyVehicles);
router.get('/export/csv', rbac.requireAccess('analytics', 'view'), exportCsv);

module.exports = router;
