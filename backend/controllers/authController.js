const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Client = require('../models/Client'); // For creating client profile on registration

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please add all fields' });
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ error: 'User already exists' });
  }

  try {
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'client', // Default to 'client' if not specified
    });

    if (user) {
      // If the user is a client, create a corresponding Client profile
      if (user.role === 'client') {
        await Client.create({
          userId: user._id,
          name: user.name || 'New Client',
          email: user.email,
          registeredDate: user.createdAt,
        });
      }

      res.status(201).json({
        message: 'User registered successfully. Please log in.',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(400).json({ error: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  // req.user is set by the protect middleware
  res.status(200).json({ user: req.user });
};

// @desc    Update user profile (name)
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const { name } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = name || user.name;

      const updatedUser = await user.save();

      // If the user is a client, also update the Client profile
      if (updatedUser.role === 'client') {
        await Client.findOneAndUpdate(
          { userId: updatedUser._id },
          { name: updatedUser.name },
          { new: true, upsert: true }
        );
      }

      res.json({
        message: 'Profile updated successfully',
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
        },
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating profile' });
  }
};

// @desc    Update user password
// @route   PUT /api/auth/password
// @access  Private
const updateUserPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user && (await user.matchPassword(currentPassword))) {
      user.password = newPassword; // Mongoose pre-save hook will hash it
      await user.save();
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(401).json({ error: 'Invalid current password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating password' });
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateUserProfile,
  updateUserPassword,
};