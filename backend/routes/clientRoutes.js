const express = require('express');
const {
  getClientOrders,
  createOrder,
  getClientSubscriptions,
} = require('../controllers/clientController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// All client routes require authentication and client role
router.use(protect, authorizeRoles('client'));

router.get('/orders', getClientOrders);
router.post('/orders', createOrder);
router.get('/subscriptions', getClientSubscriptions);

module.exports = router;