const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Client = require('../models/Client'); // For creating client profile on registration
const sendEmail = require('../utils/sendEmail'); // Import sendEmail utility

// Helper function to generate and send OTP
const generateAndSendOtp = async (user, res) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  const otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save();

  const otpMessage = `
    <h1>Your One-Time Password (OTP)</h1>
    <p>Hi ${user.name || user.email},</p>
    <p>Your One-Time Password (OTP) for Yasin Digital Solutions is: <strong>${otp}</strong></p>
    <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
    <p>If you did not request this, please ignore this email.</p>
    <p>Best regards,</p>
    <p>The Yasin Digital Solutions Team</p>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your OTP for Yasin Digital Solutions',
      message: otpMessage,
    });
    return { success: true, message: 'OTP sent to your email.' };
  } catch (emailError) {
    console.error('Error sending OTP email:', emailError);
    // Clear OTP fields if email sending fails to prevent user from being stuck
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    return { success: false, error: 'Failed to send OTP email. Please try again.' };
  }
};

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
      // Send OTP for verification
      const otpResult = await generateAndSendOtp(user, res);
      if (!otpResult.success) {
        // If OTP email fails, delete the user to allow re-registration
        await User.findByIdAndDelete(user._id);
        return res.status(500).json({ error: otpResult.error });
      }

      res.status(201).json({
        message: 'Registration successful. OTP sent to your email for verification.',
        otpRequired: true,
        userId: user._id,
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

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Send OTP for verification
  const otpResult = await generateAndSendOtp(user, res);
  if (!otpResult.success) {
    return res.status(500).json({ error: otpResult.error });
  }

  res.json({
    message: 'Login successful. OTP sent to your email for verification.',
    otpRequired: true,
    userId: user._id,
  });
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public (or Private if user ID is passed in body)
const verifyOtp = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.status(400).json({ error: 'User ID and OTP are required' });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    if (user.otpExpires && user.otpExpires < Date.now()) {
      // Clear expired OTP
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();
      return res.status(400).json({ error: 'OTP has expired' });
    }

    // OTP is valid, clear it and log the user in
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // If the user was just registered as a client, create their Client profile now
    if (user.role === 'client' && !(await Client.findOne({ userId: user._id }))) {
      await Client.create({
        userId: user._id,
        name: user.name || 'New Client',
        email: user.email,
        registeredDate: user.createdAt,
      });
    }

    // Send welcome email for new registrations (if not already sent)
    // This part might need adjustment if you want to send welcome email *after* OTP verification
    // For now, I'll assume the welcome email is sent during initial registration attempt.
    // If you want to send it *only* after OTP verification, move the sendEmail call from registerUser here.

    res.status(200).json({
      message: 'OTP verified successfully. You are now logged in.',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during OTP verification' });
  }
};

// @desc    Request new OTP (for resend)
// @route   POST /api/auth/request-otp
// @access  Public (requires userId)
const requestOtp = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const otpResult = await generateAndSendOtp(user, res);
    if (!otpResult.success) {
      return res.status(500).json({ error: otpResult.error });
    }

    res.status(200).json({ message: 'New OTP sent to your email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error requesting new OTP' });
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
  verifyOtp,
  requestOtp,
};