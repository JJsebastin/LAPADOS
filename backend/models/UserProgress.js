const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  user_email: { type: String, required: true },
  total_points: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  current_streak: { type: Number, default: 0 },
  longest_streak: { type: Number, default: 0 },
  last_activity: { type: Date },
  completed_moduloz: [{ type: String }],
  earned_badges: [{ type: String }],
  quiz_history: [{
    modulo_id: String,
    score: Number,
    completed_at: Date
  }],
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now },
  created_by: String
});

module.exports = mongoose.model('UserProgress', userProgressSchema);