const UserProgress = require('../models/UserProgress');

exports.listUserProgress = async (req, res) => {
  try {
    const sort = req.query.sort || '-total_points';
    const limit = parseInt(req.query.limit) || 50;
    
    const userProgress = await UserProgress.find()
      .sort(sort)
      .limit(limit);
    res.json(userProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.filterUserProgress = async (req, res) => {
  try {
    const filter = req.body.filter || {};
    const sort = req.body.sort || '-created_date';
    const limit = parseInt(req.body.limit) || 50;

    const userProgress = await UserProgress.find(filter)
      .sort(sort)
      .limit(limit);
    res.json(userProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserProgress = async (req, res) => {
  try {
    const userProgress = await UserProgress.findById(req.params.id);
    if (!userProgress) {
      return res.status(404).json({ message: 'User progress not found' });
    }
    res.json(userProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createUserProgress = async (req, res) => {
  try {
    const userProgress = await UserProgress.create({
      ...req.body,
      created_by: req.user.email
    });
    res.status(201).json(userProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserProgress = async (req, res) => {
  try {
    const userProgress = await UserProgress.findById(req.params.id);
    if (!userProgress) {
      return res.status(404).json({ message: 'User progress not found' });
    }

    Object.assign(userProgress, req.body);
    userProgress.updated_date = Date.now();
    await userProgress.save();

    res.json(userProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUserProgress = async (req, res) => {
  try {
    const userProgress = await UserProgress.findById(req.params.id);
    if (!userProgress) {
      return res.status(404).json({ message: 'User progress not found' });
    }

    await userProgress.deleteOne();
    res.json({ message: 'User progress deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};