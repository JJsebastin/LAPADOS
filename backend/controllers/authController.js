const User = require('../models/User');
const UserProgress = require('../models/UserProgress');
const { generateToken } = require('../config/jwt');

exports.register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ full_name, email, password });
    
    // Create initial user progress
    await UserProgress.create({
      user_email: email,
      total_points: 0,
      level: 1,
      current_streak: 0,
      created_by: email
    });

    const token = generateToken(user._id);
    res.status(201).json({
      id: user._id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      res.json({
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        token
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Don't allow changing built-in fields
    const { password, email, role, ...allowedUpdates } = req.body;
    
    Object.assign(user, allowedUpdates);
    user.updated_date = Date.now();
    await user.save();
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
