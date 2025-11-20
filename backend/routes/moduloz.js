const express = require('express');
const router = express.Router();
const {
  listModuloz,
  filterModuloz,
  getModulo,
  createModulo,
  updateModulo,
  deleteModulo
} = require('../controllers/moduloController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, listModuloz);
router.post('/filter', protect, filterModuloz);
router.get('/:id', protect, getModulo);
router.post('/', protect, createModulo);
router.put('/:id', protect, updateModulo);
router.delete('/:id', protect, deleteModulo);

module.exports = router;