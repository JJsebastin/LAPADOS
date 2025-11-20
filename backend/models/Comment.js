const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  blog_id: { type: String, required: true },
  content: { type: String, required: true },
  author_email: { type: String, required: true },
  author_name: { type: String, required: true },
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now },
  created_by: String
});

module.exports = mongoose.model('Comment', commentSchema);