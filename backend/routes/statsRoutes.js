const express = require('express');
const router = express.Router();

const { getSummary } = require('../controllers/statsController');

const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/summary', protect, authorize('administrador', 'agente', 'cliente'), getSummary);

module.exports = router;