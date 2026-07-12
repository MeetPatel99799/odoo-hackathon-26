const express = require('express');
const router = express.Router();
const rbac = require('../middleware/rbac');
const { verifyToken } = require('../middleware/auth');
const { getExpenses, createExpense, getOperationalCostData } = require('../controllers/fuelExpenseController');

router.use(verifyToken);

router.get('/', rbac.requireAccess('expenses', 'view'), getExpenses);
router.post('/', rbac.requireAccess('expenses', 'write'), createExpense);
router.get('/operational-cost', rbac.requireAccess('expenses', 'view'), getOperationalCostData);

module.exports = router;
