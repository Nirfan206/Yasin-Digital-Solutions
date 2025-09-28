const Order = require('../models/Order');
const Subscription = require('../models/Subscription');
const User = require('../models/User'); // To get client details for order creation and find admin
const { createNotification } = require('../notificationController'); // Import notification helper

// @desc    Get client's orders
// @route   GET /api/client/orders
// @access  Private (Client)
const getClientOrders = async (req, res) => {
  try {
    const orders = await Order.find({ clientId: req.user._id }).sort({ orderDate: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching orders' });
  }
};

// @desc    Create a new order
// @route   POST /api/client/orders
// @access  Private (Client)
const createOrder = async (req, res) => {
  const { serviceType, requirements } = req.body;

  if (!serviceType || !requirements) {
    return res.status(400).json({ error: 'Please add service type and requirements' });
  }

  try {
    const clientUser = await User.findById(req.user._id);

    if (!clientUser || clientUser.role !== 'client') {
      return res.status(403).json({ error: 'Not authorized to create orders' });
    }

    const order = await Order.create({
      clientId: req.user._id,
      clientName: clientUser.name || clientUser.email, // Use name if available, else email
      clientEmail: clientUser.email,
      serviceType,
      requirements,
    });

    // Send notification to admin about new order
    const adminUser = await User.findOne({ role: 'admin' }); // Find an admin user
    if (adminUser) {
      const message = `New order placed by ${clientUser.name || clientUser.email} for "${serviceType}" (ID: ${order._id.toString().slice(-6)}).`;
      const link = `/admin/dashboard/order-management`; // Link to admin's order management page
      await createNotification(adminUser._id, message, link, 'new_order');
    }

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error creating order' });
  }
};

// @desc    Get client's subscriptions
// @route   GET /api/client/subscriptions
// @access  Private (Client)
const getClientSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ clientId: req.user._id }).sort({ nextRenewalDate: 1 });
    res.status(200).json(subscriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching subscriptions' });
  }
};

module.exports = {
  getClientOrders,
  createOrder,
  getClientSubscriptions,
};