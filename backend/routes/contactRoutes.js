const express = require('express');
const {
  submitContactMessage,
  getAllContactMessages,
  markContactMessageAsRead,
} = require('../controllers/contactController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Public route for submitting contact messages
router.post('/', submitContactMessage);

// Admin-only routes for managing contact messages
router.use(protect, authorizeRoles('admin'));
router.get('/', getAllContactMessages);
router.put('/:id/read', markContactMessageAsRead);

module.exports = router;