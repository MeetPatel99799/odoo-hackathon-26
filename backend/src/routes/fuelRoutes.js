const express = require('express');
const router = express.Router();
const rbac = require('../middleware/rbac');
const { verifyToken } = require('../middleware/auth');
const { getFuelLogs, createFuelLog } = require('../controllers/fuelExpenseController');

router.use(verifyToken);

router.get('/', rbac.requireAccess('expenses', 'view'), getFuelLogs);
router.post('/', rbac.requireAccess('expenses', 'write'), createFuelLog);

module.exports = router;
