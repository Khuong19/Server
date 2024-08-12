const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secret_key';

// Register a new user
const register = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Basic validation for email, password, and username
    if (!email || !password || !username) {
      return res.status(400).json({ error: 'Email, password, and username are required' });
    }

    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const user = new User({ email, password: hashedPassword, username });
    await user.save();

    // Send the user object (omit sensitive fields in production)
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    // Log the error for server-side debugging
    console.error('Registration error:', err.message || err);
    // Send a generic error message
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Log in an existing user
const login = async (req, res) => {
  const { email, password } = req.body;

  // Basic validation for email and password
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    // If password matches, generate a JWT token
    if (isMatch) {
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        JWT_SECRET
      );
      return res.json({ message: 'Login successful', token, userId: user._id });
    }

    // If password does not match
    res.status(401).json({ error: 'Invalid credentials' });
  } catch (err) {
    // Log detailed error
    console.error('Login error:', err.message || err);
    // Send generic error message
    res.status(500).json({ error: 'Login failed' });
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
          req.user = decoded; // Attach decoded token (user data) to request object
          next();
      });
  } else {
      res.status(401).json({ error: 'No token provided' });
  }
};


module.exports = {
  register,
  login,
  logout,
  isAuthenticated,
};
