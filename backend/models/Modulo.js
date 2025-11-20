const mongoose = require('mongoose');

const moduloSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  xp_reward: { type: Number, required: true },
  estimated_minutes: Number,
  content: String,
  quiz_questions: [{
    question: String,
    options: [String],
    correct_answer: Number,
    explanation: String
  }],
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now },
  created_by: String
});

module.exports = mongoose.model('Modulo', moduloSchema);