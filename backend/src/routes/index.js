const express = require('express');
const router = express.Router();

// Future routes will be mounted here
router.use('/auth', require('./authRoutes'));

module.exports = router;
