const express = require('express');
const router = express.Router();
const {
  listBlogs,
  filterBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog
} = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, listBlogs);
router.post('/filter', protect, filterBlogs);
router.get('/:id', protect, getBlog);
router.post('/', protect, createBlog);
router.put('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);
router.post('/:id/like', protect, likeBlog);

module.exports = router;
