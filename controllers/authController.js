const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secret_key'; // It's recommended to move this to environment variables

// Register a new user
const register = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.status(400).json({ error: 'Email, password, and username are required' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, username });
    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Log in an existing user
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
          const token = jwt.sign(
              { userId: user._id.toString(), email: user.email }, // Ensure userId is included
              JWT_SECRET
          );
          return res.json({ message: 'Login successful', token, userId: user._id });
      }
      res.status(401).json({ error: 'Invalid password' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Login failed' });
  }
};


// Get the user profile
const getMe = async (req, res) => {
  try {
    const userId = req.user.userId; 
    const user = await User.findById(userId).select('-password'); 
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { email, username, password } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (email) {
      user.email = email;
    }
    if (username) {
      user.username = username;
    }
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({
      message: 'User profile updated successfully',
      user: {
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
};

// Log out the user
const logout = (req, res) => {
  res.json({ message: 'Logout successful' });
};

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; 

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      req.user = { _id: decoded.userId, userId: decoded.userId };;
      next();
    });
  } else {
    res.status(401).json({ error: 'No token provided' });
  }
};

module.exports = {
  getMe,
  updateProfile,
  register,
  login,
  logout,
  isAuthenticated,
};
