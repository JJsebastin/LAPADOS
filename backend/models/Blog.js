const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author_email: { type: String, required: true },
  author_name: { type: String, required: true },
  type: { type: String, enum: ['blog', 'infographic'], default: 'blog' },
  image_url: String,
  likes_count: { type: Number, default: 0 },
  liked_by: [{ type: String }],
  tags: [{ type: String }],
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now },
  created_by: String
});

module.exports = mongoose.model('Blog', blogSchema);