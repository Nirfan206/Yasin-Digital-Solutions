const Subscription = require('../../models/Subscription');

// @desc    Get all subscriptions
// @route   GET /api/admin/subscriptions
// @access  Private (Admin)
const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({});
    res.status(200).json(subscriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching subscriptions' });
  }
};

// @desc    Create a new subscription
// @route   POST /api/admin/subscriptions
// @access  Private (Admin)
const createSubscription = async (req, res) => {
  const { clientId, serviceName, startDate, nextRenewalDate, status } = req.body;

  if (!clientId || !serviceName || !startDate || !nextRenewalDate || !status) {
    return res.status(400).json({ error: 'Please add all required subscription fields' });
  }

  try {
    const subscription = await Subscription.create({
      clientId,
      serviceName,
      startDate,
      nextRenewalDate,
      status,
    });
    res.status(201).json(subscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error creating subscription' });
  }
};

// @desc    Update subscription details
// @route   PUT /api/admin/subscriptions/:id
// @access  Private (Admin)
const updateSubscription = async (req, res) => {
  const { id } = req.params;
  const { clientId, serviceName, startDate, nextRenewalDate, status } = req.body;

  try {
    const subscription = await Subscription.findById(id);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    subscription.clientId = clientId || subscription.clientId;
    subscription.serviceName = serviceName || subscription.serviceName;
    subscription.startDate = startDate || subscription.startDate;
    subscription.nextRenewalDate = nextRenewalDate || subscription.nextRenewalDate;
    subscription.status = status || subscription.status;

    const updatedSubscription = await subscription.save();
    res.status(200).json(updatedSubscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating subscription' });
  }
};

// @desc    Delete a subscription
// @route   DELETE /api/admin/subscriptions/:id
// @access  Private (Admin)
const deleteSubscription = async (req, res) => {
  const { id } = req.params;

  try {
    const subscription = await Subscription.findById(id);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    await subscription.deleteOne();
    res.status(200).json({ message: 'Subscription removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error deleting subscription' });
  }
};

module.exports = {
  getAllSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
};