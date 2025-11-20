const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  color: { type: String, enum: ['gold', 'silver', 'bronze', 'blue', 'green', 'purple'], required: true },
  criteria: {
    type: { type: String, enum: ['modules_completed', 'quiz_score', 'streak', 'points', 'time_based'] },
    value: Number,
    specific_module: String
  },
  rarity: { type: String, enum: ['common', 'rare', 'epic', 'legendary'], default: 'common' },
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now },
  created_by: String
});

module.exports = mongoose.model('Badge', badgeSchema);