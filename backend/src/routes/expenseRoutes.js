const express = require('express');
const router = express.Router();
const rbac = require('../middleware/rbac');
const { getExpenses, createExpense, getOperationalCostData } = require('../controllers/fuelExpenseController');

router.get('/', rbac.requireAccess('fuel_expenses', 'view'), getExpenses);
router.post('/', rbac.requireAccess('fuel_expenses', 'write'), createExpense);
router.get('/operational-cost', rbac.requireAccess('fuel_expenses', 'view'), getOperationalCostData);

module.exports = router;
