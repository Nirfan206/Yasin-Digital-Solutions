const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Reference to the User model
    },
    clientName: { // Denormalized for easier access in admin/employee views
      type: String,
      required: true,
    },
    clientEmail: { // Denormalized for easier access
      type: String,
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
      enum: ['Website Building', 'App Development', 'Digital Marketing'],
    },
    requirements: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'In Progress', 'Under Review', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;