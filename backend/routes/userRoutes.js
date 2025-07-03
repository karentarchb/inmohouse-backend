const express = require('express');
const router = express.Router();

const { 
    getAgents,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/userController');

const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/agents', authorize('administrador', 'agente'), getAgents);

router.use(authorize('administrador'));

router.route('/')
  .get(getAllUsers)
  .post(createUser);

router.route('/:id')
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;