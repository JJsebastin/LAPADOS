const Comment = require('../models/Comment');

exports.listComments = async (req, res) => {
  try {
    const sort = req.query.sort || '-created_date';
    const limit = parseInt(req.query.limit) || 50;
    
    const comments = await Comment.find()
      .sort(sort)
      .limit(limit);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.filterComments = async (req, res) => {
  try {
    const filter = req.body.filter || {};
    const sort = req.body.sort || '-created_date';
    const limit = parseInt(req.body.limit) || 50;

    const comments = await Comment.find(filter)
      .sort(sort)
      .limit(limit);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      ...req.body,
      created_by: req.user.email
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Only allow update by author
    if (comment.author_email !== req.user.email) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(comment, req.body);
    comment.updated_date = Date.now();
    await comment.save();

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Only allow deletion by author or admin
    if (comment.author_email !== req.user.email && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};