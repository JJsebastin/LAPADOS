const Badge = require('../models/Badge');

exports.listBadges = async (req, res) => {
  try {
    const sort = req.query.sort || '-created_date';
    const limit = parseInt(req.query.limit) || 50;
    
    const badges = await Badge.find()
      .sort(sort)
      .limit(limit);
    res.json(badges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBadge = async (req, res) => {
  try {
    const badge = await Badge.findById(req.params.id);
    if (!badge) {
      return res.status(404).json({ message: 'Badge not found' });
    }
    res.json(badge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBadge = async (req, res) => {
  try {
    // Only admins can create badges
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const badge = await Badge.create({
      ...req.body,
      created_by: req.user.email
    });
    res.status(201).json(badge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBadge = async (req, res) => {
  try {
    // Only admins can update badges
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const badge = await Badge.findById(req.params.id);
    if (!badge) {
      return res.status(404).json({ message: 'Badge not found' });
    }

    Object.assign(badge, req.body);
    badge.updated_date = Date.now();
    await badge.save();

    res.json(badge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBadge = async (req, res) => {
  try {
    // Only admins can delete badges
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const badge = await Badge.findById(req.params.id);
    if (!badge) {
      return res.status(404).json({ message: 'Badge not found' });
    }

    await badge.deleteOne();
    res.json({ message: 'Badge deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};