const express = require('express');
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.use(verifyToken);

router.get('/', getSettings);
router.put('/', updateSettings);

module.exports = router;
