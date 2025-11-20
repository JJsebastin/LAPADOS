const Blog = require('../models/Blog');

exports.listBlogs = async (req, res) => {
  try {
    const sort = req.query.sort || '-created_date';
    const limit = parseInt(req.query.limit) || 50;
    
    const blogs = await Blog.find()
      .sort(sort)
      .limit(limit);
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.filterBlogs = async (req, res) => {
  try {
    const filter = req.body.filter || {};
    const sort = req.body.sort || '-created_date';
    const limit = parseInt(req.body.limit) || 50;

    const blogs = await Blog.find(filter)
      .sort(sort)
      .limit(limit);
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const blog = await Blog.create({
      ...req.body,
      created_by: req.user.email
    });
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    Object.assign(blog, req.body);
    blog.updated_date = Date.now();
    await blog.save();

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Only allow deletion by author or admin
    if (blog.author_email !== req.user.email && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await blog.deleteOne();
    res.json({ message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const userEmail = req.user.email;
    const likedIndex = blog.liked_by.indexOf(userEmail);

    if (likedIndex > -1) {
      // Unlike
      blog.liked_by.splice(likedIndex, 1);
    } else {
      // Like
      blog.liked_by.push(userEmail);
    }

    blog.likes_count = blog.liked_by.length;
    await blog.save();

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
