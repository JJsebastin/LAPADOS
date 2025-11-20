const express = require('express');
const router = express.Router();
const {
  listComments,
  filterComments,
  getComment,
  createComment,
  updateComment,
  deleteComment
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, listComments);
router.post('/filter', protect, filterComments);
router.get('/:id', protect, getComment);
router.post('/', protect, createComment);
router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);

module.exports = router;