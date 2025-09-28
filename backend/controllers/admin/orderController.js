const Order = require('../../models/Order');

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private (Admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ orderDate: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching orders' });
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private (Admin)
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Please provide a new status' });
  }

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating order status' });
  }
};

module.exports = {
  getAllOrders,
  updateOrderStatus,
};