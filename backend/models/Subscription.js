const mongoose = require('mongoose');

const subscriptionSchema = mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Reference to the User model (client)
    },
    serviceName: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    nextRenewalDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Active', 'Expired', 'Pending'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;