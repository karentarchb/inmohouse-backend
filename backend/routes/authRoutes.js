const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);

router.get('/me', protect, (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
});

router.get('/admin-test', protect, authorize('administrador'), (req, res) => {
  res.status(200).json({
    success: true,
    message: '¡Bienvenido, Administrador! Has pasado la prueba de autorización.'
  });
});

module.exports = router;