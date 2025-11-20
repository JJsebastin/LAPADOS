const express = require('express');
const router = express.Router();
const {
  listBadges,
  getBadge,
  createBadge,
  updateBadge,
  deleteBadge
} = require('../controllers/badgeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, listBadges);
router.get('/:id', protect, getBadge);
router.post('/', protect, createBadge);
router.put('/:id', protect, updateBadge);
router.delete('/:id', protect, deleteBage);

module.exports = router;