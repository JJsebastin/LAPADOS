const express = require('express');
const router = express.Router();
const {
  listUserProgress,
  filterUserProgress,
  getUserProgress,
  createUserProgress,
  updateUserProgress,
  deleteUserProgress
} = require('../controllers/userProgressController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, listUserProgress);
router.post('/filter', protect, filterUserProgress);
router.get('/:id', protect, getUserProgress);
router.post('/', protect, createUserProgress);
router.put('/:id', protect, updateUserProgress);
router.delete('/:id', protect, deleteUserProgress);

module.exports = router;