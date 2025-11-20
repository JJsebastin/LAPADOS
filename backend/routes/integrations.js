const express = require('express');
const router = express.Router();
const {
  uploadFile,
  invokeLLM,
  sendEmail,
  generateImage
} = require('../controllers/integrationController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/upload-file', protect, upload.single('file'), uploadFile);
router.post('/invoke-llm', protect, invokeLLM);
router.post('/send-email', protect, sendEmail);
router.post('/generate-image', protect, generateImage);

module.exports = router;