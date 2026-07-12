const express = require('express');
const router = express.Router();

// Future routes will be mounted here
router.use('/auth', require('./authRoutes'));
router.use('/dashboard', require('./dashboardRoutes'));

module.exports = router;
