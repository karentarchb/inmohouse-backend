const express = require('express');
const router = express.Router();

const {
  getAllProperties,
  createProperty,
  updateProperty,
  deleteProperty
} = require('../controllers/propertyController');

const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getAllProperties)
  .post(protect, authorize('administrador', 'agente'), createProperty);

router.route('/:id')
  .put(protect, authorize('administrador', 'agente'), updateProperty)
  .delete(protect, authorize('administrador', 'agente'), deleteProperty);

module.exports = router;