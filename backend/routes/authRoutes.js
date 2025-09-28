const express = require('express');
const {
  registerUser,
  loginUser,
  getMe,
  updateUserProfile,
  updateUserPassword,
  verifyOtp, // New import
  requestOtp, // New import
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOtp); // New route
router.post('/request-otp', requestOtp); // New route
router.get('/me', protect, getMe);
router.put('/profile', protect, updateUserProfile);
router.put('/password', protect, updateUserPassword);

module.exports = router;