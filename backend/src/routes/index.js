const express = require('express');
const router = express.Router();

// Future routes will be mounted here
router.use('/auth', require('./authRoutes'));
router.use('/dashboard', require('./dashboardRoutes'));
router.use('/vehicles', require('./vehicleRoutes'));
router.use('/drivers', require('./driverRoutes'));
router.use('/trips', require('./tripRoutes'));
router.use('/fuel-logs', require('./fuelRoutes'));
router.use('/expenses', require('./expenseRoutes'));

module.exports = router;
