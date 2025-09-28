const Client = require('../../models/Client');
const Employee = require('../../models/Employee');
const Order = require('../../models/Order');
const Job = require('../../models/Job');
const Subscription = require('../../models/Subscription');

// @desc    Get admin overview data
// @route   GET /api/admin/overview
// @access  Private (Admin)
const getAdminOverviewData = async (req, res) => {
  try {
    const totalClients = await Client.countDocuments();
    const totalEmployees = await Employee.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalSubscriptions = await Subscription.countDocuments();

    const orders = await Order.find({});
    const orderStatusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, { 'Pending': 0, 'In Progress': 0, 'Under Review': 0, 'Completed': 0, 'Cancelled': 0 });

    const jobs = await Job.find({});
    const jobStatusCounts = jobs.reduce((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    }, { 'Assigned': 0, 'In Progress': 0, 'Under Review': 0, 'Completed': 0 });

    res.status(200).json({
      totalClients,
      totalEmployees,
      totalOrders,
      orderStatusCounts,
      totalJobs,
      jobStatusCounts,
      totalSubscriptions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching admin overview data' });
  }
};

module.exports = {
  getAdminOverviewData,
};