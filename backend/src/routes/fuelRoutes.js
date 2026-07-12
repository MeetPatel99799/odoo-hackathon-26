const express = require('express');
const router = express.Router();
const rbac = require('../middleware/rbac');
const { getFuelLogs, createFuelLog } = require('../controllers/fuelExpenseController');

router.get('/', rbac.requireAccess('fuel_expenses', 'view'), getFuelLogs);
router.post('/', rbac.requireAccess('fuel_expenses', 'write'), createFuelLog);

module.exports = router;
