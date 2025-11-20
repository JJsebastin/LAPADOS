const express = require('express');
const router = express.Router();
const { listUsers, getUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, listUsers);
router.get('/:id', protect, getUser);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);

module.exports = router;