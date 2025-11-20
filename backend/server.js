const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/user-progress', require('./routes/userProgress'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/moduloz', require('./routes/moduloz'));
app.use('/api/badges', require('./routes/badges'));
app.use('/api/integrations', require('./routes/integrations'));

// Static files (uploads)
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));