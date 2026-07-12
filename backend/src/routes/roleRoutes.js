const express = require('express');
const { getRolePermissionsMatrix } = require('../controllers/roleController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.use(verifyToken);

router.get('/permissions', getRolePermissionsMatrix);

module.exports = router;
